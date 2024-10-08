import createCtx from "./ctx";

export default async function handleRequest(req, url, diesel) {
  
  const { pathname } = url;
  const { method } = req;

  const routeHandler = diesel.trie.search(pathname, method);
  if (!routeHandler || !routeHandler.handler) {
    return responseNotFound(pathname)
  }

  if (routeHandler?.method !== method) {
    return responseMethodNotAllowed()
  }

  req.query = Object.fromEntries(url.searchParams.entries());

  // if route is dynamic then extract dynamic value

  const dynamicParams = routeHandler?.isDynamic
    ? extractDynamicParams(routeHandler?.path, pathname)
    : {};
  req.params = dynamicParams;

  const ctx = createCtx(req)

  const middlewares = [
    ...diesel.globalMiddlewares,
    ...(diesel.middlewares.get(pathname) || []),
  ];

  // Execute middleware and check if any returns a response
  const middlewareResult =  await executeMiddleware(middlewares, ctx);
  if(middlewareResult) return middlewareResult;

    // Route handler execution
    const result = await routeHandler.handler(ctx);
    return result ?? responseNoHandler()
}

const extractDynamicParams = (routePattern, path) => {
  const object = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?"); // Ignore the query string in the path
  const pathSegments = pathWithoutQuery.split("/"); // Re-split after removing query

  if (routeSegments.length !== pathSegments.length) {
    return null; // Path doesn't match the pattern
  }

  routeSegments.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      const dynamicKey = segment.slice(1); // Remove ':' to get the key name
      object[dynamicKey] = pathSegments[index]; // Map the path segment to the key
    }
  });

  return object;
};

async function executeMiddleware(middlewares, ctx) {
  for (const middleware of middlewares) {
    try {
     const result = await middleware(ctx)
     if (result) return result;
    } catch (error) {
      return responseServerError()
    }
  }
  return null;
}


function responseNotFound(path) {
  return new Response(`Route not found for ${path}`, { status: 404 });
}

function responseMethodNotAllowed() {
  return new Response("Method not allowed", { status: 405 });
}

function responseNoHandler() {
  return new Response("No response from handler", { status: 204 });
}

function responseServerError() {
  return new Response("Internal Server Error", { status: 500 });
}
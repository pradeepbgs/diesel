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

  if (routeHandler.isDynamic) {
    req.routePattern = routeHandler?.path
  }

  const ctx = createCtx(req,url)

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
import createCtx from "./ctx";

export default async function handleRequest(req, url, diesel) {
  const { pathname } = url;
  const { method } = req;
  
  // Try to find the route handler in the trie
  const routeHandler = diesel.trie.search(pathname, method);
  
  // Early return if route or method is not found
  if (!routeHandler || !routeHandler.handler) return responseNotFound(pathname);
  if (routeHandler.method !== method) return responseMethodNotAllowed();
  // If the route is dynamic, we only set routePattern if necessary
  if (routeHandler.isDynamic) req.routePattern = routeHandler.path;

  const ctx = createCtx(req, url);

  if (diesel.hasMiddleware) {
  const middlewares = [
    ...diesel.globalMiddlewares,
    ...diesel.middlewares.get(pathname) || []
  ];

  const middlewareResult = await executeMiddleware(middlewares, ctx);
  if (middlewareResult) return middlewareResult;
  
}
 

  // Finally, execute the route handler and return its result
  try {
    const result = await routeHandler.handler(ctx);
    return result ?? responseNoHandler();
  } catch (error) {
    return responseServerError();
  }
}

// Optimized middleware execution: stops as soon as a middleware returns a response
async function executeMiddleware(middlewares, ctx) {
  for (const middleware of middlewares) {
    const result = await middleware(ctx);
    if (result) return result;  // Early exit if middleware returns a result
  }
}

// Reused response functions for better organization and clarity
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

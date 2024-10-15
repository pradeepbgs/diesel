import createCtx from "./ctx";
import type { ContextType, DieselT, handlerFunction, RouteCache, RouteHandlerT } from "./types";

const routeCache:RouteCache = {}

export default async function handleRequest(req:Request, url:URL, diesel:DieselT): Promise<Response> {

  const ctx:ContextType = createCtx(req, url);

  // OnReq hook 1
  if (diesel.hasOnReqHook) {
    await diesel.hooks.onRequest(ctx)
  }

  // middleware execution 
  if (diesel.hasMiddleware) {
    
    const middlewares : handlerFunction[] = [
      ...diesel.globalMiddlewares,
      ...diesel.middlewares.get(url.pathname) || []
    ] 

    const middlewareResult = await executeMiddleware(middlewares, ctx);
    if (middlewareResult) return middlewareResult;

  }

  // Try to find the route handler in the trie
  let routeHandler :RouteHandlerT | undefined;
  if(routeCache[url.pathname+req.method]) {
    routeHandler = routeCache[url.pathname+req.method]
  } else {
    routeHandler = diesel.trie.search(url.pathname, req.method);
    routeCache[url.pathname+req.method]=routeHandler
  }

  // Early return if route or method is not found
  if (!routeHandler || !routeHandler.handler) {
    return new Response(`Route not found for ${url.pathname}`, { status: 404 })
  }

  if (routeHandler.method !== req.method) {
    return new Response("Method not allowed", { status: 405 })
  }

  // If the route is dynamic, we only set routePattern if necessary
  if (routeHandler.isDynamic) req.routePattern = routeHandler.path;

  // Run preHandler hooks 2
  if (diesel.hasPreHandlerHook) {
      const Hookresult = await diesel.hooks.preHandler(ctx);
      if(Hookresult) return Hookresult;
    }
  

  // Finally, execute the route handler and return its result
  try {
    const result = await routeHandler.handler(ctx) as Response | null | void ;

    // 3. run the postHandler hooks 
    if (diesel.hasPostHandlerHook) {
      await diesel.hooks.postHandler(ctx)  
    }

    // 4. Run onSend hooks before sending the response
    if (diesel.hasOnSendHook) {
        const hookResponse = await diesel.hooks.onSend(result, ctx);
        if(hookResponse) return hookResponse
    }

    return result ??  new Response("No response from handler", { status: 204 })
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

// middleware execution
async function executeMiddleware(middlewares:handlerFunction[], ctx:ContextType): Promise<Response | null | void> {
  for (const middleware of middlewares) {
    const result = await middleware(ctx);
    if (result) return result; 
  }
}



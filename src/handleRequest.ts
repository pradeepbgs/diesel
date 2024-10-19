import { Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, corsT, DieselT, handlerFunction, middlewareFunc, RouteCache, RouteHandlerT } from "./types";


// const routeCache:RouteCache = {}

export default async function handleRequest(req: Request, server: Server, url: URL, diesel: DieselT): Promise<Response> {

  const ctx: ContextType = createCtx(req, server, url);

  // Try to find the route handler in the trie
  let routeHandler: RouteHandlerT | undefined = diesel.trie.search(url.pathname, req.method);;
  // if(routeCache[url.pathname+req.method]) {
  //   routeHandler = routeCache[url.pathname+req.method]
  // } else {
  //   routeHandler = diesel.trie.search(url.pathname, req.method);
  //   routeCache[url.pathname+req.method]=routeHandler
  // }

  // Early return if route or method is not found
  if (!routeHandler || routeHandler.method !== req.method) {
    return new Response(routeHandler ? "Method not allowed" : `Route not found for ${url.pathname}`, {
      status: routeHandler ? 405 : 404,
    });
  }

  // If the route is dynamic, we only set routePattern if necessary
  if (routeHandler.isDynamic) req.routePattern = routeHandler.path;

  // cors execution
  if (diesel.corsConfig) {
    const corsResult = await applyCors(req, ctx, diesel.corsConfig)
    if(corsResult) return corsResult;
  }

  // OnReq hook 1
  if (diesel.hasOnReqHook && diesel.hooks.onRequest) diesel.hooks.onRequest(ctx, server)

  // filter applying
  if (diesel.filters.length > 0) {

    const path = req.routePattern ?? url.pathname
    const hasRoute = diesel.filters.includes(path)

    if (hasRoute === false) {
      if (diesel.filterFunction) {
        const filterResult = await diesel?.filterFunction(ctx, server)
        if (filterResult) return filterResult
      } else {
        return new Response(JSON.stringify({
          message: "Authentication required"
        }), { status: 400 })
      }
    }
  }

  // middleware execution 
  if (diesel.hasMiddleware) {
    const middlewares = [
      ...diesel.globalMiddlewares,
      ...diesel.middlewares.get(url.pathname) || []
    ] as middlewareFunc[]

    for (const middleware of middlewares) {
      const result = await middleware(ctx, server);
      if (result) return result;
    }

  }

  // Run preHandler hooks 2
  if (diesel.hasPreHandlerHook && diesel.hooks.preHandler) {
    const Hookresult = await diesel.hooks.preHandler(ctx);
    if (Hookresult) return Hookresult;
  }

  const preHandlerResult = diesel.hasPreHandlerHook ? await diesel.hooks.preHandler?.(ctx) : null;
  if (preHandlerResult) return preHandlerResult;

  // Finally, execute the route handler and return its result
  try {
    const result = await routeHandler.handler(ctx) as Response | null | void;

    // 3. run the postHandler hooks 
    if (diesel.hasPostHandlerHook && diesel.hooks.postHandler) {
      await diesel.hooks.postHandler(ctx)
    }

    // 4. Run onSend hooks before sending the response
    if (diesel.hasOnSendHook && diesel.hooks.onSend) {
      const hookResponse = await diesel.hooks.onSend(ctx, result);
      if (hookResponse) return hookResponse
    }

    return result ?? new Response("No response from handler", { status: 204 })
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}


async function applyCors(req: Request, ctx: ContextType, config: corsT = {}): Promise<Response | null>  {
  const origin = req.headers.get('origin') ?? '*'
  const allowedOrigins = config?.origin
  const allowedHeaders = config?.allowedHeaders ?? ["Content-Type", "Authorization"]
  const allowedMethods = config?.methods ?? ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  const allowedCredentials = config?.credentials ?? false
  const exposedHeaders = config?.exposedHeaders ?? []

  ctx.setHeader('Access-Control-Allow-Methods', allowedMethods)
  ctx.setHeader("Access-Control-Allow-Headers", allowedHeaders);
  ctx.setHeader("Access-Control-Allow-Credentials", allowedCredentials);
  if (exposedHeaders.length) {
    ctx.setHeader("Access-Control-Expose-Headers", exposedHeaders);
  }

  if (allowedOrigins === '*') {
    ctx.setHeader("Access-Control-Allow-Origin", "*")
  } else if (Array.isArray(allowedOrigins)) {
    if (origin && allowedOrigins.includes(origin)) {
      ctx.setHeader("Access-Control-Allow-Origin", origin)
    } else if (allowedOrigins.includes('*')) {
      ctx.setHeader("Access-Control-Allow-Origin", '*')
    }
    else {
      return ctx.status(403).json({ message: "CORS not allowed" })
    }
  } else if (typeof allowedOrigins === 'string') {
    if (origin === allowedOrigins) {
      ctx.setHeader("Access-Control-Allow-Origin", origin)
    }
    else {
      return ctx.status(403).json({ message: "CORS not allowed" });
    }
  } else {
    return ctx.status(403).json({ message: "CORS not allowed" })
  }

  ctx.setHeader("Access-Control-Allow-Origin", origin)

  if (req.method === 'OPTIONS') {
    ctx.setHeader('Access-Control-Max-Age', '86400')
    return ctx.status(204).text('')
  }

  return null
}
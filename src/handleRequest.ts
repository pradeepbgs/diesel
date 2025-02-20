import { Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, DieselT, RouteHandlerT } from "./types";
import { getMimeType } from "./utils";


export default async function handleRequest(req: Request, server: Server, url: URL, diesel: DieselT
): Promise<Response> {
  
  const ctx: ContextType = createCtx(req, server, url);

  const routeHandler: RouteHandlerT | undefined = diesel.trie.search(
    url.pathname,
    req.method
  );

  req.routePattern = routeHandler?.path;

  if (diesel.hasFilterEnabled) {
    const path = req.routePattern ?? url.pathname;
    const filterResponse = await handleFilterRequest(diesel, path, ctx, server);
    if (filterResponse) return filterResponse;
  }

  if (diesel.hasMiddleware) {
    const globalMiddlewareResponse = await executeMiddlewares(
      diesel.globalMiddlewares,
      ctx,
      server
    );
    if (globalMiddlewareResponse) return globalMiddlewareResponse;

    const pathMiddlewares = diesel.middlewares.get(url.pathname) || [];
    const pathMiddlewareResponse = await executeMiddlewares(
      pathMiddlewares,
      ctx,
      server
    );
    if (pathMiddlewareResponse) return pathMiddlewareResponse;
  }

  if (!routeHandler?.handler || routeHandler.method !== req.method) {
    if (diesel.staticPath) {
      const staticResponse = await handleStaticFiles(diesel, url.pathname, ctx);
      if (staticResponse) return staticResponse;
      
      const wildCard = diesel.trie.search("*", req.method)
      if (wildCard?.handler) {
        return (await wildCard.handler(ctx)) as Response;
      }
    }
    if (diesel.hooks.routeNotFound && !routeHandler?.handler) {
      const routeNotFoundResponse = await diesel.hooks.routeNotFound(ctx);
      if (routeNotFoundResponse) return routeNotFoundResponse;
    }

    if (!routeHandler || !routeHandler?.handler?.length) {
      return generateErrorResponse(404, `Route not found for ${url.pathname}`);
    }

    if(routeHandler?.method !== req.method){
      return generateErrorResponse(405, "Method not allowed") 
    }

  }

  if (diesel.hooks.preHandler) {
    const preHandlerResponse = await diesel.hooks.preHandler(ctx);
    if (preHandlerResponse) return preHandlerResponse;
  }

  const result = routeHandler.handler(ctx);
  const finalResult = result instanceof Promise ? await result : result;

  if (diesel.hooks.postHandler) await diesel.hooks.postHandler(ctx);

  if (diesel.hooks.onSend) {
    const hookResponse = await diesel.hooks.onSend(ctx, finalResult);
    if (hookResponse) return hookResponse;
  }

  return finalResult ?? generateErrorResponse(204, "No response from this handler");
}


async function executeMiddlewares(
  middlewares: Function[],
  ctx: ContextType,
  server: Server
): Promise<Response | null> {
  for (const middleware of middlewares) {
    const result = await middleware(ctx, server);
    if (result) return result;
  }
  return null;
}


export async function handleFilterRequest(diesel: DieselT, path: string, ctx: ContextType, server: Server) {
  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(ctx, server);
        if (filterResult) return filterResult;
      }
    } else {
      return ctx.json({ error: true, message: "Protected route, authentication required", status: 401 }, 401);
    }
  }
}

export function generateErrorResponse(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ error: true, message, status }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export async function handleStaticFiles(diesel: DieselT, pathname: string, ctx: ContextType): Promise<Response | null> {
  if (!diesel.staticPath) return null;

  const filePath = `${diesel.staticPath}${pathname}`;
  const file = Bun.file(filePath)

  if (await file.exists()) {
    const mimeType = getMimeType(filePath)
    return ctx.file(filePath, 200, mimeType)
  }

  return null
}

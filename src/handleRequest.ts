import { Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, corsT, DieselT, RouteHandlerT } from "./types";
import { getMimeType } from "./utils";


export default async function handleRequest( req: Request, server: Server, url: URL, diesel: DieselT
): Promise<Response> {

  const routeHandler: RouteHandlerT | undefined = diesel.trie.search(
    url.pathname,
    req.method
  );

  req.routePattern = routeHandler?.path;

  const ctx: ContextType = createCtx(req, server, url);

  // filter applying
  if (diesel.hasFilterEnabled) {
    const path = req.routePattern ?? url.pathname;
    const filterResponse = await handleFilterRequest(diesel, path, ctx, server);
    if (filterResponse) return filterResponse;
  }

  // middleware execution
  if (diesel.hasMiddleware) {
    const globalMiddleware = diesel.globalMiddlewares;
    for (let i = 0; i < globalMiddleware.length; i++) {
      const result = await globalMiddleware[i](ctx, server);
      if (result) return result;
    }

    const pathMiddlewares = diesel.middlewares.get(url.pathname) || [];
    for (let i = 0; i < pathMiddlewares.length; i++) {
      const result = await pathMiddlewares[i](ctx, server);
      if (result) return result;
    }
  }

  if (!routeHandler?.handler || routeHandler.method !== req.method) {
    const wildCard = diesel.trie.search("*", req.method)
    if (wildCard) {
      const staticResponse = await handleStaticFiles(diesel, url.pathname, ctx);
      if (staticResponse) return staticResponse;

      const result = await wildCard.handler(ctx);
      return result as Response
    }
    if ( !routeHandler || routeHandler?.handler.length == 0) {
      return generateErrorResponse(404, `Route not found for ${url.pathname}`);
    } else if (routeHandler?.method !== req.method) {
      return generateErrorResponse(405, "Method not allowed");
    }

  }

  // Run preHandler hooks 2
  if (diesel.hooks.preHandler) {
    const Hookresult = await diesel.hooks.preHandler(ctx);
    if (Hookresult) return Hookresult;
  }

  // // Finally, execute the route handler and return its result
  const result = routeHandler.handler(ctx);
  const finalResult = result instanceof Promise ? await result : result;
  
  // // Hooks: Post-Handler and OnSend
  if (diesel.hooks.postHandler) await diesel.hooks.postHandler(ctx);

  if (diesel.hooks.onSend) {
    const hookResponse = await diesel.hooks.onSend(ctx, finalResult);
    if (hookResponse) return hookResponse;
  }

  return finalResult ?? generateErrorResponse(204, "No response from this handler");
}


export async function handleFilterRequest(diesel: DieselT, path: string, ctx: ContextType, server: Server) {
  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(ctx, server);
        if (filterResult) return filterResult;
      }
    }
    return ctx.json({ error: true, message: "Protected route, authentication required", status: 401 }, 401);
  }
}

export function generateErrorResponse(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ error: true, message, status }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export async function handleStaticFiles(diesel: DieselT, pathname: string, ctx: ContextType): Promise<Response | null> {
  if (!diesel.UseStaticFiles) throw new Error("Static files directory is not configured.");

  const filePath = `${diesel.UseStaticFiles}${pathname}`;
  if (/\.(js|css|html)$/.test(pathname)) {
    const mimeType = getMimeType(filePath);
    return ctx.file(filePath, 200, mimeType);
  }
  return null;
}

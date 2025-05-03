import { BunRequest, Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, DieselT, middlewareFunc, RouteHandlerT } from "./types";
import { getMimeType } from "./utils/mimeType";


export default async function handleRequest(
  req: BunRequest,
  server: Server,
  url: URL,
  diesel: DieselT
) {

  const ctx: ContextType = createCtx(req, server, url);

  const routeHandler: RouteHandlerT | undefined = diesel.trie.search(
    url.pathname,
    req.method
  );

  req.routePattern = routeHandler?.path;

  try {

    // PipeLines such as filters , middlewares,hooks
    // pipeline 1 - middleware execution
    if (diesel.hasMiddleware) {
      if (diesel.globalMiddlewares.length) {
        const globalMiddlewareResponse = await executeMiddlewares(
          diesel.globalMiddlewares,
          ctx,
          server
        );
        if (globalMiddlewareResponse) return globalMiddlewareResponse;
      }

      const pathMiddlewares = diesel.middlewares.get(url.pathname) || [];
      if (pathMiddlewares?.length) {
        const pathMiddlewareResponse = await executeMiddlewares(
          pathMiddlewares,
          ctx,
          server
        );
        if (pathMiddlewareResponse) return pathMiddlewareResponse;
      }
    }

        // pipepline 2 - filter execution
        if (diesel.hasFilterEnabled) {
          const path = req.routePattern ?? url.pathname;
          const filterResponse = await handleFilterRequest(diesel, path, ctx, server);
          const finalResult = filterResponse instanceof Promise ? await filterResponse : filterResponse;
          if (finalResult) return finalResult;
        }
    

    // if route not found
    if (!routeHandler?.handler || routeHandler.method !== req.method) {
      if (diesel.staticPath) {
        const staticResponse = await handleStaticFiles(diesel, url.pathname, ctx);
        if (staticResponse) return staticResponse;

        const wildCard = diesel.trie.search("*", req.method)
        if (wildCard?.handler) {
          return (await wildCard.handler(ctx));
        }
      }
      if (diesel.hooks.routeNotFound && Array.isArray(diesel.hooks.routeNotFound) && !routeHandler?.handler) {
        const handlers = diesel.hooks.routeNotFound;
        for (let i = 0; i < handlers.length; i++) {
          const routeNotFoundResponse = handlers[i](ctx);
          const finalResult = routeNotFoundResponse instanceof Promise ? await routeNotFoundResponse : routeNotFoundResponse;
          if (finalResult) return finalResult;
        }
      }

      if (!routeHandler || !routeHandler?.handler?.length) {
        return generateErrorResponse(404, `Route not found for ${url.pathname}`);
      }

      if (routeHandler?.method !== req.method) {
        return generateErrorResponse(405, "Method not allowed")
      }

    }

    // pre-handler
    if (diesel.hooks.preHandler?.length && Array.isArray(diesel.hooks.preHandler)) {
      const handlers = diesel.hooks.preHandler;
      for (let i = 0; i < handlers.length; i++) {
        const preHandlerResponse = handlers[i](ctx);
        const finalResult = preHandlerResponse instanceof Promise ? await preHandlerResponse : preHandlerResponse;
        if (finalResult) return finalResult;
      }
    }

    const result = routeHandler.handler(ctx);
    const finalResult = result instanceof Promise ? await result : result;
    return finalResult ?? generateErrorResponse(204, "");

  }
  catch (error: any) {
    if (diesel.hooks.onError && Array.isArray(diesel.hooks.onError)) {
      const handlers = diesel.hooks.onError
      for (let i = 0; i < handlers.length; i++) {
        const onErrorHookResponse = diesel.hooks.onError[i](error, req, url, server)
        const finalResult = onErrorHookResponse instanceof Promise ? await onErrorHookResponse : onErrorHookResponse;
        if (finalResult) return finalResult;
      }
    }
    return generateErrorResponse(500, "Internal Server Error");
  }
  finally {
    if (diesel.hooks.onSend && Array.isArray(diesel.hooks.onSend)) {
      const handlers = diesel.hooks.onSend;
      for (let i = 0; i < handlers.length; i++) {
        const onSendResponse = handlers[i](ctx);
        const finalResult = onSendResponse instanceof Promise ? await onSendResponse : onSendResponse;
        if (finalResult) return finalResult;
      }
    }
  }
}


async function executeHooks(
  handlers: middlewareFunc[],
  args: any
) {
  for (let i = 0; i < handlers.length; i++) {
    const result = handlers[i](args);
    const finalResult = result instanceof Promise ? await result : result;
    if (finalResult) return finalResult;
  }
};

export async function executeMiddlewares(
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

export async function executeBunMiddlewares(
  middlewares: Function[],
  req: BunRequest,
  server: Server) {
  for (const middleware of middlewares) {
    const result = await middleware(req, server);
    if (result) return result;
  }
}

export async function handleFilterRequest(
  diesel: DieselT,
  path: string,
  ctx: ContextType,
  server: Server) {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(ctx, server);
        if (filterResult) return filterResult;
      }
    } else {
      return Response.json({ error: true, message: "Protected route, authentication required", status: 401 }, { status: 401 });
    }
  }
}

export async function handleBunFilterRequest(
  diesel: DieselT,
  path: string,
  req: BunRequest,
  server: Server) {

  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(req as any, server);
        if (filterResult) return filterResult;
      }
    } else {
      return Response.json({ error: true, message: "Protected route, authentication required", status: 401 }, { status: 401 });
    }
  }
}

export function generateErrorResponse(
  status: number,
  message: string
): Response {
  return new Response(
    JSON.stringify({ error: true, message, status }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

export async function handleStaticFiles(
  diesel: DieselT,
  pathname: string,
  ctx: ContextType
): Promise<Response | null> {

  if (!diesel.staticPath) return null;

  const filePath = `${diesel.staticPath}${pathname}`;
  const file = Bun.file(filePath)

  if (await file.exists()) {
    const mimeType = getMimeType(filePath)
    return ctx.file(filePath, mimeType, 200)
  }

  return null
}


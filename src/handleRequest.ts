import { BunRequest, Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, DieselT, HookType, RouteHandlerT } from "./types";
import { getMimeType } from "./utils/mimeType";


export default async function handleRequest(
  req: BunRequest,
  server: Server,
  diesel: DieselT
) {
  // initilalize it first so every req wiill have predefined so v8 doesn't deoptimise it.
  req.routePattern = undefined
  const url = new URL(req.url)
  
  const ctx: ContextType = createCtx(req, server, url);

  const routeHandler: RouteHandlerT | undefined = diesel.trie.search(
    url.pathname,
    req.method
  );
  req.routePattern = routeHandler?.path

  try {

    // PipeLines such as filters , middlewares, hooks
    if (diesel.hooks.onRequest) await runHooks('onRequest', diesel.hooks.onRequest, [req, url, server])

    // middleware execution
    if (diesel.hasMiddleware) {
      const mwResult = await runMiddlewares(diesel, url.pathname, ctx, server);
      if (mwResult) return mwResult;
    }

    // filter execution
    if (diesel.hasFilterEnabled) {
      const path = req.routePattern ?? url.pathname;
      const filterResponse = await runFilter(diesel, path, ctx, server);
      if (filterResponse) return filterResponse;
    }

    // if route not found
    if (!routeHandler) return await handleRouteNotFound(diesel, ctx, url.pathname)

    // pre-handler
    if (diesel.hooks.preHandler) {
      const result = await runHooks('preHandler', diesel.hooks.preHandler, [ctx, server]);
      if (result) return result;
    }

    const result = routeHandler.handler(ctx);
    const finalResult = result instanceof Promise ? await result : result;

    // onSend
    if (diesel.hasOnSendHook) {
      const response = await runHooks('onSend', diesel.hooks.onSend, [ctx, finalResult, server]);
      if (response) return response;
    }
    if (finalResult instanceof Response) {
      return finalResult;
    }

    // if we dont return a response then by default Bun shows a err 
    return generateErrorResponse(500, "No response returned from handler.");

  }
  catch (error: any) {
    const errorResult = await runHooks("onError", diesel.hooks.onError, [error, req, url, server]);
    return errorResult || generateErrorResponse(500, "Internal Server Error");
  }

}

async function runHooks<T extends any[]>(
  label: HookType,
  hooksArray: any,
  args: T): Promise<any> {
  if (!hooksArray?.length) return;
  for (let i = 0; i < hooksArray.length; i++) {
    const result = hooksArray[i](...args);
    const finalResult = result instanceof Promise ? await result : result;
    if (finalResult && label !== 'onRequest') return finalResult
  }
}

async function runMiddlewares(diesel: DieselT, pathname: string, ctx: ContextType, server: Server) {

  if (diesel.globalMiddlewares.length) {
    const res = await executeMiddlewares(diesel.globalMiddlewares, ctx, server);
    if (res) return res;
  }

  const local = diesel.middlewares.get(pathname) || [];
  if (local.length) {
    const res = await executeMiddlewares(local, ctx, server);
    if (res) return res;
  }

  return null;
}

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

async function runFilter(diesel: DieselT, path: string, ctx: ContextType, server: Server) {
  const filterResponse = await handleFilterRequest(diesel, path, ctx, server);
  const finalResult = filterResponse instanceof Promise ? await filterResponse : filterResponse;
  if (finalResult) return finalResult;
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
      return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
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
      return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
    }
  }
}

async function handleRouteNotFound(diesel: DieselT, ctx: ContextType, pathname: string) {
  if (diesel.staticPath) {
    const staticRes = await handleStaticFiles(diesel, pathname, ctx);
    if (staticRes) return staticRes;

    const wildcard = diesel.trie.search("*", ctx.req.method);
    if (wildcard?.handler) return await wildcard.handler(ctx);
  }

  const fallback = diesel.routeNotFoundFunc(ctx);
  return fallback || generateErrorResponse(404, `Route not found for ${pathname}`);
}


export function generateErrorResponse(
  status: number,
  error: string
): Response {
  return new Response(
    JSON.stringify({ error }),
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


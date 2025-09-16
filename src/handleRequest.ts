import { BunRequest, Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, DieselT, HookType, RouteHandlerT } from "./types";
import { getMimeType } from "./utils/mimeType";

// from chatGPT , only for test for prodcution we will stil use new URL
/** Fast parse that extracts pathname and raw query without constructing URL */
export function parseRequestUrl(rawUrl: string): string {
  let pathStart = 0;

  // Case 1: Absolute URL like "http://host:port/path?query"
  const protoIndex = rawUrl.indexOf("://");
  if (protoIndex !== -1) {
    const firstSlash = rawUrl.indexOf("/", protoIndex + 3);
    pathStart = firstSlash === -1 ? rawUrl.length : firstSlash;
  }
  // Case 2: Protocol-relative URL like "//host/path"
  else if (rawUrl.startsWith("//")) {
    const firstSlash = rawUrl.indexOf("/", 2);
    pathStart = firstSlash === -1 ? rawUrl.length : firstSlash;
  }

  // Extract only the path part
  const pathAndQuery = rawUrl.slice(pathStart) || "/";

  // Strip query if present
  const qIdx = pathAndQuery.indexOf("?");
  return qIdx === -1 ? pathAndQuery : pathAndQuery.slice(0, qIdx);
}


export default async function handleRequest(
  req: BunRequest,
  server: Server,
  diesel: DieselT
): Promise<Response> {

  const pathname = parseRequestUrl(req.url);
  // console.log("custom pathname", pathname);

  // const timenow  = new Date().getTime();
  // const url = new URL(req.url)
  // console.log(url?.pathname, url?.searchParams.get('name')) 


  const routeHandler: RouteHandlerT | undefined = diesel.trie.search(
    pathname,
    req.method
  );
  // console.log(routeHandler)
  const ctx: ContextType = createCtx(req, server, pathname, routeHandler?.path);

  try {

    // PipeLines such as filters , middlewares, hooks
    if (diesel.hasOnReqHook)
      await runHooks('onRequest', diesel.hooks.onRequest, [req, pathname, server])

    // middleware execution
    if (diesel.hasMiddleware) {
      const mwResult = await runMiddlewares(diesel, pathname, ctx, server);
      if (mwResult) return mwResult;
    }

    // filter execution
    if (diesel.hasFilterEnabled) {
      const filterResponse = await runFilter(diesel, pathname, ctx, server);
      if (filterResponse) return filterResponse;
    }

    // if route not found
    if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname)

    // pre-handler
    if (diesel.hasPreHandlerHook) {
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
    const errorResult = await runHooks("onError", diesel.hooks.onError, [error, req, pathname, server]);
    return errorResult || generateErrorResponse(500, "Internal Server Error");
  }

}

export async function runHooks<T extends any[]>(
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

export async function runMiddlewares(diesel: DieselT, pathname: string, ctx: ContextType, server: Server) {

  // const global = diesel.globalMiddlewares;
  // if (global.length) {
  //   for (const middleware of global) {
  //     const result = await middleware(ctx, server);
  //     if (result) return result;
  //   }
  // }

  const local = diesel.middlewares.get(pathname)
  if (local && local.length) {
    for (const middleware of local) {
      const result = await middleware(ctx, server);
      if (result) return result;
    }
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

export async function runFilter(diesel: DieselT, path: string, ctx: ContextType, server: Server) {
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

export async function handleRouteNotFound(diesel: DieselT, ctx: ContextType, pathname: string): Promise<Response> {
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


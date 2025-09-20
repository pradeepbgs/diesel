import { BunRequest, Server } from "bun";
import createCtx from "./ctx";
import type { ContextType, DieselT, HookType } from "./types";
import { getMimeType } from "./utils/mimeType";
import { tryDecodeURI } from "./utils/urls";


export default async function handleRequest(
  req: BunRequest,
  server: Server,
  diesel: DieselT
): Promise<Response | undefined> {

  let pathname;
  const start = req.url.indexOf('/', req.url.indexOf(':') + 4);
  let i = start;
  for (; i < req.url.length; i++) {
    const charCode = req.url.charCodeAt(i);
    if (charCode === 37) { // percent-encoded
      const queryIndex = req.url.indexOf('?', i);
      const path = req.url.slice(start, queryIndex === -1 ? undefined : queryIndex);
      pathname = tryDecodeURI(path.includes('%25') ? path.replace(/%25/g, '%2525') : path);
      break;
    } else if (charCode === 63) {
      break;
    }
  }
  if (!pathname) {
    pathname = req.url.slice(start, i);
  }

  const routeHandler = diesel.trie.search(pathname, req.method);

  const ctx = createCtx(req, server, pathname,
    // diesel.on.bind(diesel), 
    // diesel.emit.bind(diesel), 
    routeHandler?.path)


  // PipeLines such as filters , middlewares, hooks
  if (diesel.hasOnReqHook)
    await runHooks('onRequest', diesel.hooks.onRequest, [req, pathname, server])

  // middleware execution
  if (diesel.hasMiddleware) {
    const mwResult = await runMiddlewares(diesel, pathname, ctx);
    if (mwResult) return mwResult;
  }

  // filter execution
  if (diesel.hasFilterEnabled) {
    const filterResponse = await runFilter(diesel, pathname, ctx);
    if (filterResponse) return filterResponse;
  }

  // if route not found
  if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname)

  // pre-handler
  if (diesel.hasPreHandlerHook) {
    const result = await runHooks('preHandler', diesel.hooks.preHandler, [ctx]);
    if (result) return result;
  }

  const result = routeHandler.handler(ctx);
  const finalResult = result instanceof Promise ? await result : result;

  // onSend
  if (diesel.hasOnSendHook) {
    const response = await runHooks('onSend', diesel.hooks.onSend, [ctx, finalResult]);
    if (response) return response;
  }

  if (finalResult instanceof Response) {
    return finalResult;
  }

  // if we dont return a response then by default Bun shows a err 
  return generateErrorResponse(500, "No response returned from handler.");

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

export async function runMiddlewares(diesel: DieselT, pathname: string, ctx: ContextType,) {

  const global = diesel.globalMiddlewares;
  if (global.length) {
    for (const middleware of global) {
      const result = await middleware(ctx);
      if (result) return result;
    }
  }

  const local = diesel.middlewares.get(pathname)
  if (local && local.length) {
    for (const middleware of local) {
      const result = await middleware(ctx);
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

export async function runFilter(diesel: DieselT, path: string, ctx: ContextType) {
  const filterResponse = await handleFilterRequest(diesel, path, ctx);
  const finalResult = filterResponse instanceof Promise ? await filterResponse : filterResponse;
  if (finalResult) return finalResult;
}

export async function handleFilterRequest(
  diesel: DieselT,
  path: string,
  ctx: ContextType) {
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(ctx);
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

export async function handleRouteNotFound(diesel: DieselT, ctx: ContextType, pathname: string): Promise<Response | undefined> {
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


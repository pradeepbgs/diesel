import { Server } from "bun";
import { ContextType, DieselT, HookType } from "../types";
import { getMimeType } from "./mimeType";

export async function runHooks<T extends any[]>(
  label: HookType,
  hooksArray: any,
  args: T): Promise<Response | undefined> {

  if (!hooksArray?.length) return;
  for (let i = 0; i < hooksArray.length; i++) {
    const result = hooksArray[i](...args);
    const finalResult = result instanceof Promise ? await result : result;
    if (finalResult && label !== 'onRequest') return finalResult
  }
}

export async function runMiddlewares(diesel: DieselT, pathname: string, ctx: ContextType) {

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
  req: Request,
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
  req: Request,
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
  return fallback instanceof Promise ? await fallback : fallback || generateErrorResponse(404, `404 Route not found for ${pathname}`);
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


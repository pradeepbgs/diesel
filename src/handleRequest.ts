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

  if (routeHandler?.isDynamic) req.routePattern = routeHandler.path;

  const ctx: ContextType = createCtx(req, server, url);


  // cors execution
  if (diesel.corsConfig) {
    const corsResponse = applyCors(req, ctx, diesel.corsConfig);
    if (corsResponse) return corsResponse;
  }

  // OnReq hook 1
  if (diesel.hasOnReqHook && diesel.hooks.onRequest) {
    diesel.hooks.onRequest(req, url, server);
  }

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

  if (!routeHandler || routeHandler.method !== req.method) {
    const wildCard = diesel.trie.search("*", req.method)
    if (wildCard) {
      const staticResponse = await handleStaticFiles(diesel, url.pathname, ctx);
      if (staticResponse) return staticResponse;

      const result = await wildCard.handler(ctx);
      return result as Response
    }

    return generateErrorResponse(routeHandler ? 405 : 404, routeHandler ? "Method not allowed" : `Route not found for ${url.pathname}`);
  }

  // Run preHandler hooks 2
  if (diesel.hasPreHandlerHook && diesel.hooks.preHandler) {
    const Hookresult = await diesel.hooks.preHandler(ctx);
    if (Hookresult) return Hookresult;
  }

  // // Finally, execute the route handler and return its result
  const result = (await routeHandler.handler(ctx)) as Response | null | void;

  // // Hooks: Post-Handler and OnSend
  if (diesel.hasPostHandlerHook && diesel.hooks.postHandler) {
    await diesel.hooks.postHandler(ctx);
  }

  if (diesel.hasOnSendHook && diesel.hooks.onSend) {
    const hookResponse = await diesel.hooks.onSend(ctx, result);
    if (hookResponse) return hookResponse;
  }

  // // Default Response if Handler is Void
  return result ?? generateErrorResponse(204, "No response from this handler");
}

export function applyCors(
  req: Request,
  ctx: ContextType,
  config: corsT = {}
): Response | null {
  const origin = req.headers.get("origin") ?? "*";
  const allowedOrigins = config?.origin;
  const allowedHeaders = config?.allowedHeaders ?? [
    "Content-Type",
    "Authorization",
  ];
  const allowedMethods = config?.methods ?? [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
  ];
  const allowedCredentials = config?.credentials ?? false;
  const exposedHeaders = config?.exposedHeaders ?? [];

  ctx.setHeader("Access-Control-Allow-Methods", allowedMethods);
  ctx.setHeader("Access-Control-Allow-Headers", allowedHeaders);
  ctx.setHeader("Access-Control-Allow-Credentials", allowedCredentials);

  if (exposedHeaders.length)
    ctx.setHeader("Access-Control-Expose-Headers", exposedHeaders);

  if (allowedOrigins === "*" || origin === "*") {
    ctx.setHeader("Access-Control-Allow-Origin", "*");
  } else if (Array.isArray(allowedOrigins)) {
    if (origin && allowedOrigins.includes(origin)) {
      ctx.setHeader("Access-Control-Allow-Origin", origin);
    } else if (allowedOrigins.includes("*")) {
      ctx.setHeader("Access-Control-Allow-Origin", "*");
    } else {
      return ctx.json({ message: "CORS not allowed" }, 403);
    }
  } else if (typeof allowedOrigins === "string") {
    if (origin === allowedOrigins) {
      ctx.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      return ctx.json({ message: "CORS not allowed" }, 403);
    }
  } else {
    return ctx.json({ message: "CORS not allowed" }, 403);
  }

  ctx.setHeader("Access-Control-Allow-Origin", origin);

  if (req.method === "OPTIONS") {
    ctx.setHeader("Access-Control-Max-Age", "86400");
    return ctx.text("", 204);
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
  if (!diesel.staticFiles) throw new Error("Static files directory is not configured.");

  const filePath = `${diesel.staticFiles}${pathname}`;
  if (/\.(js|css|html)$/.test(pathname)) {
    const mimeType = getMimeType(filePath);
    return ctx.file(filePath, 200, mimeType);
  }
  return null;
}
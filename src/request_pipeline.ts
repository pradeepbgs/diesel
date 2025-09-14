import { generateErrorResponse, handleRouteNotFound, runFilter, runHooks, runMiddlewares } from "./handleRequest";
import { DieselT } from "./types";

export const buildRequestPipeline = (diesel: DieselT) => {
  const parts: string[] = [];

  // Hooks
  if (diesel.hasOnReqHook) {
    parts.push(`await runHooks("onRequest", diesel.hooks.onRequest, [req, pathname, server]);`);
  }

  // Middlewares
  if (diesel.hasMiddleware) {
    parts.push(`
        const mwResult = await runMiddlewares(diesel, pathname, ctx, server);
        if (mwResult) return mwResult;
      `);
  }

  // Filters
  if (diesel.hasFilterEnabled) {
    parts.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx, server);
        if (filterResponse) return filterResponse;
      `);
  }

  // Route not found check
  parts.push(`
      if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname);
    `);

  // Pre-handler
  if (diesel.hasPreHandlerHook) {
    parts.push(`
        const preResult = await runHooks("preHandler", diesel.hooks.preHandler, [ctx, server]);
        if (preResult) return preResult;
      `);
  }

  // Actual route handler
  parts.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `);

  // onSend
  if (diesel.hasOnSendHook) {
    parts.push(`
        const sendResponse = await runHooks("onSend", diesel.hooks.onSend, [ctx, finalResult, server]);
        if (sendResponse) return sendResponse;
      `);
  }

  // Final response
  parts.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);

  const fnBody = `
      return async function pipeline(req, server, diesel, ctx, routeHandler, pathname) {
          ${parts.join("\n")}
      }
    `;

  diesel.pipeline = new Function(
    "runHooks",
    "runMiddlewares",
    "runFilter",
    "handleRouteNotFound",
    "generateErrorResponse",
    fnBody
  )(
    runHooks,
    runMiddlewares,
    runFilter,
    handleRouteNotFound,
    generateErrorResponse
  );
}


export const BunRequestPipline = (diesel: DieselT, method: string, ...handlers: Function[]) => {
  const parts: string[] = []

  // Middlewares
  if (diesel.hasMiddleware) {
    parts.push(`
          const mwResult = await runMiddlewares(diesel, pathname, ctx, server);
          if (mwResult) return mwResult;
        `);
  }

  // method mathch
  parts.push(`
            if ("${method}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `)

  if (handlers.length === 1) {
    parts.push(`
       const response = handlers[0](req, server)
    if (response instanceof Promise) {
      const resolved = await response;
      return resolved ?? new Response("Not Found", { status: 404 });
    }
    if (response instanceof Response) return response
      `)
  }
  else {
    parts.push(`
      for (let i = 0; i < handlers.length; i++) {
      const response = handlers[i](req, server)
      if (response instanceof Promise) {
        const resolved = await response;
        return resolved ?? new Response("Not Found", { status: 404 });
      }
      if (response instanceof Response) return response
    }
      `)
  }

  const fnBody = `
    return async function(req, server) {
      ${parts.join("\n")}
    }
  `;

  const fnc = new Function("runMiddlewares", "diesel", "handlers", fnBody)(
    runMiddlewares,
    diesel,
    handlers,
  );
  // console.log(String(fnc))
  return fnc
}
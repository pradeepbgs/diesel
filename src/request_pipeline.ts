import { BunRequest, Server } from "bun";
import { executeBunMiddlewares, generateErrorResponse, handleBunFilterRequest, handleRouteNotFound, runFilter, runHooks, runMiddlewares } from "./handleRequest";
import { CompileConfig, DieselT } from "./types";

export const buildRequestPipeline = (config: CompileConfig, diesel: DieselT) => {
  const pipeline: string[] = [];
  const globalMiddlewares = diesel.globalMiddlewares ?? []
  // Hooks
  if (config?.hasOnReqHook) {
    pipeline.push(`await runHooks("onRequest", diesel.hooks.onRequest, [req, pathname, server]);`);
  }

  // Middlewares
  if (config?.hasMiddleware) {
    if (globalMiddlewares.length > 0) {
      if (globalMiddlewares.length <= 5) {
        // Inline each middleware for max speed
        for (let i = 0; i < globalMiddlewares.length; i++) {
          pipeline.push(`
          {
            const result = await globalMiddlewares[${i}](ctx, server);
            if (result) return result;
          }
        `);
        }
      } else {
        // Use loop for larger middleware lists
        pipeline.push(`
        for (let i = 0; i < globalMiddlewares.length; i++) {
          const result = await globalMiddlewares[i](ctx, server);
          if (result) return result;
        }
      `);
      }
    }

    // Local/path-specific middlewares still run via function
    // console.log(diesel.middlewares.size)
    if (diesel.middlewares.size > 0) {
      pipeline.push(`
      const mwResult = await runMiddlewares(diesel, pathname, ctx, server);
      if (mwResult) return mwResult;
    `);
    }
  }


  // Filters
  if (config.hasFilterEnabled) {
    pipeline.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx, server);
        if (filterResponse) return filterResponse;
      `);
  }

  // Route not found check
  pipeline.push(`
      if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname);
    `);

  // Pre-handler
  if (config.hasPreHandlerHook) {
    pipeline.push(`
        const preResult = await runHooks("preHandler", diesel.hooks.preHandler, [ctx, server]);
        if (preResult) return preResult;
      `);
  }

  // Actual route handler
  pipeline.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `);

  // onSend
  if (config.hasOnSendHook) {
    pipeline.push(`
        const sendResponse = await runHooks("onSend", diesel.hooks.onSend, [ctx, finalResult, server]);
        if (sendResponse) return sendResponse;
      `);
  }

  // Final response
  pipeline.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);

  const fnBody = `
      return async function pipeline(req, server, diesel, ctx, routeHandler, pathname) {
          ${pipeline.join("\n")}
      }
    `;

  const fnc = new Function(
    "runHooks",
    "runMiddlewares",
    "runFilter",
    "handleRouteNotFound",
    "generateErrorResponse",
    "globalMiddlewares",
    fnBody
  )(
    runHooks,
    runMiddlewares,
    runFilter,
    handleRouteNotFound,
    generateErrorResponse,
    globalMiddlewares
  );
  // console.log(fnc.toString())
  return fnc;
}


export const BunRequestPipline = (config: CompileConfig, diesel: DieselT, method: string, path: string, ...handlers: Function[]) => {
  const pipeline: string[] = []

  const globalMiddlewares = config?.hasMiddleware ? diesel.globalMiddlewares : [];
  const pathMiddlewares = config?.hasMiddleware ? diesel.middlewares.get(path) || [] : [];
  const allMiddlewares = [...globalMiddlewares, ...pathMiddlewares];
  // onReq hooks
  const onRequestHooks = config?.hasOnReqHook ? diesel.hooks.onRequest : [];
  //filters
  const hasFilter = diesel.filters.has(path)
  const filterFunctions = diesel.filterFunction

  // Hooks
  if (onRequestHooks) {
    pipeline.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${path}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);
  }

  // Middlewares
  if (allMiddlewares.length) {
    pipeline.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);
  }

  // filter 
  if (config.hasFilterEnabled) {
    if (!hasFilter) {
      pipeline.push(
        `if (${filterFunctions.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`
      )
    }
  }

  // method mathch
  pipeline.push(`
            if ("${method}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `)

  // Handler invocation
  if (handlers.length === 1) {
    pipeline.push(`
       const response = handlers[0](req, server)
    if (response instanceof Promise) {
      const resolved = await response;
      return resolved ?? new Response("Not Found", { status: 404 });
    }
    if (response instanceof Response) return response
      `)
  }
  else {
    pipeline.push(`
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
      ${pipeline.join("\n")}
    }
  `;

  const fnc = new Function(
    "executeBunMiddlewares",
    "handlers",
    "runHooks",
    "filterFunctions",
    "onRequestHooks",
    "allMiddlewares",
    fnBody
  )
    (
      executeBunMiddlewares,
      handlers,
      runHooks,
      filterFunctions,
      onRequestHooks,
      allMiddlewares
    );
  // console.log(String(fnc))
  return fnc
}


const prevBunReq = (diesel: DieselT, path: string, method: string, handlers: Function[]) => {
  diesel.routes[path] = async (req: BunRequest, server: Server) => {

    if (diesel.hasMiddleware) {
      if (diesel.globalMiddlewares.length) {
        const globalMiddlewareResponse = await executeBunMiddlewares(
          diesel.globalMiddlewares,
          req,
          server
        );
        if (globalMiddlewareResponse) return globalMiddlewareResponse;
      }

      const pathMiddlewares = diesel.middlewares.get(path) || [];
      if (pathMiddlewares?.length) {
        const pathMiddlewareResponse = await executeBunMiddlewares(
          pathMiddlewares,
          req,
          server
        );
        if (pathMiddlewareResponse) return pathMiddlewareResponse;
      }
    }

    if (method !== req.method) return new Response("Method Not Allowed", { status: 405 });

    if (handlers.length === 1) {
      const response = handlers[0](req, server)
      if (response instanceof Promise) {
        const resolved = await response;
        return resolved ?? new Response("Not Found", { status: 404 });
      }
      if (response instanceof Response) return response
    }
    else {
      for (let i = 0; i < handlers.length; i++) {
        const response = handlers[i](req, server)
        if (response instanceof Promise) {
          const resolved = await response;
          return resolved ?? new Response("Not Found", { status: 404 });
        }
        if (response instanceof Response) return response
      }
    }

  }
}
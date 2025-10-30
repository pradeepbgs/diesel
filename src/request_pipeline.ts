import { CompileConfig, DieselT, HookFunction, middlewareFunc } from "./types";
import { Context } from "./ctx";
import { executeBunMiddlewares, generateErrorResponse, handleRouteNotFound, runFilter, runHooks } from "./utils/request.util";
import { isPromise } from "./utils/promise";


function extractBody(fn: Function) {
  const src = fn.toString().trim();

  // Arrow function without braces: () => new Response("...")
  if (src.includes("=>") && !src.includes("{")) {
    return `return ${src.split("=>")[1].trim()};`;
  }

  // Normal function: () => { return ... }
  const start = src.indexOf("{") + 1;
  const end = src.lastIndexOf("}");
  return src.slice(start, end).trim();
}

const isAsync = (func: Function) => func.constructor.name === 'AsyncFunction';

const pushHooks = (pipeline: string[], hooks: HookFunction[], hooksType: string, ...args: any) => {
  if (hooks.length > 5) {
    pipeline.push(`
      for (let i = 0; i < diesel.hooks.${hooksType}.length; i++) {
        const result = diesel.hooks.${hooksType}[i](${args});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${hooksType}' !== 'onRequest') return finalResult
    }
  `)
  }
  // else inline each hooks functions
  else {
    hooks?.forEach((handler: Function, index: number) => {
      const isFunctionAsync = isAsync(handler)
      if (isFunctionAsync) {
        // use await
        pipeline.push(`
            const ${hooksType}${index}Result = await diesel.hooks.${hooksType}[${index}](${args})
            if (${hooksType}${index}Result && '${hooksType}' !== 'onRequest') return ${hooksType}${index}Result
            `)
      }
      else {
        // normal function invokation
        pipeline.push(`
            const ${hooksType}${index}Result = diesel.hooks.${hooksType}[${index}](${args})
             if (${hooksType}${index}Result && '${hooksType}' !== 'onRequest') return ${hooksType}${index}Result
            `)
      }
    })
  }
}

const pushParsePathname = (pipeline: string[]) => {
  pipeline.push(`
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
        } else if (charCode === 63) { // ?
            break;
        }
    }
    if (!pathname) {
      pathname = req.url.slice(start, i);
    }
  `)
}

const pushMiddlewares = (pipeline: string[], globalMiddlewares: middlewareFunc[]) => {
  if (globalMiddlewares.length <= 5) {
    // Inline each middleware for max speed
    for (let i = 0; i < globalMiddlewares.length; i++) {
      const isFunctionAsync = isAsync(globalMiddlewares[i])
      if (isFunctionAsync) {
        pipeline.push(`
          const resultMiddleware${i} = await globalMiddlewares[${i}](ctx);
          if (resultMiddleware${i}) return resultMiddleware${i};
      `);
      }
      else {
        pipeline.push(`
        const resultMiddleware${i} = globalMiddlewares[${i}](ctx);
        if (resultMiddleware${i}) return resultMiddleware${i};
    `);
      }
    }
  } else {
    // Use loop for larger middleware lists
    pipeline.push(`
    for (let i = 0; i < globalMiddlewares.length; i++) {
      const result = await globalMiddlewares[i](ctx);
      if (result) return result;
    }
  `);

  }
}

export const buildRequestPipeline = (diesel: DieselT) => {
  const pipeline: string[] = [];

  const PreHandlerHook = diesel?.hasPreHandlerHook ? diesel.hooks.preHandler : [] as any;
  const OnSendHook = diesel?.hasOnSendHook ? diesel.hooks.onSend : [] as any;

  // parse pathname
  pushParsePathname(pipeline)

  // finc routeHandler
  pipeline.push(`
      const matchedRouteHandler = diesel.router.find(req.method, pathname);
    `);


  pipeline.push(`
          const ctx = new Context(
          req, 
          server, 
          pathname, 
          matchedRouteHandler?.path,
          matchedRouteHandler?.params,
          env,
          executionContext
          )
    `)


  // Filters
  if (diesel.hasFilterEnabled) {
    pipeline.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx);
        if (filterResponse) return filterResponse;
      `);
  }


  // Pre-handler
  if (diesel.hasPreHandlerHook) {
    pushHooks(pipeline, PreHandlerHook, 'preHandler', 'ctx')
  }

  // Actual route handler
  pipeline.push(`
          let finalResult
                const handlers = matchedRouteHandler?.handler;
          
                if (handlers.length === 1) {
                  const result = handlers[0](ctx);
                  finalResult = isPromise(result) ? await result : result;
                }
                else {
                  for (let i = 0; i < handlers.length; i++) {
                    const result = handlers[i](ctx);
                    finalResult = isPromise(result) ? await result : result;
                    if (finalResult) break;
                  }
                }
    `);

  // onSend
  if (diesel.hasOnSendHook) {
    pushHooks(pipeline, OnSendHook, 'onSend', 'ctx', 'finalResult')
  }

  // Final response
  pipeline.push(`
      if (finalResult) return finalResult;
    `);

  // Route not found check
  pipeline.push(`
    return await handleRouteNotFound(diesel, ctx, pathname);
  `);

  const fnBody = `
      return async function pipeline(req, diesel, server, env, executionContext) {
          ${pipeline.join("\n")}
      }
    `;

  const fnc = new Function(
    "runFilter",
    "handleRouteNotFound",
    "generateErrorResponse",
    "Context",
    "isPromise",
    fnBody
  )(
    runFilter,
    handleRouteNotFound,
    generateErrorResponse,
    Context,
    isPromise
  );

  // console.log(fnc.toString())
  return fnc;

}

export const BunRequestPipline = (diesel: DieselT, method: string, path: string, ...handlersOrResponse: Function[]) => {
  const pipeline: string[] = []
  // handlers
  let response_data: string | object | undefined;
  if (typeof handlersOrResponse[0] === "string" || typeof handlersOrResponse[0] === "object") {
    response_data = handlersOrResponse[0];
  }
  const handlers = handlersOrResponse

  const globalMiddlewares = diesel?.hasMiddleware ? diesel.globalMiddlewares : [];
  const pathMiddlewares = diesel?.hasMiddleware ? diesel.middlewares.get(path) || [] : [];
  const allMiddlewares = [...globalMiddlewares, ...pathMiddlewares];

  // onReq hooks
  const onRequestHooks = diesel?.hasOnReqHook ? diesel.hooks.onRequest : [];

  //filters
  const hasFilter = diesel.filters.has(path)
  const filterFunctions = diesel.filterFunction
  // Hooks
  if (onRequestHooks && onRequestHooks?.length > 0) {
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
  if (diesel.hasFilterEnabled) {
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

  // Direct send response
  if (typeof response_data !== "undefined") {
    if (typeof response_data === "string") {
      pipeline.push(`
        return new Response(${JSON.stringify(response_data)});
      `);
    } else {
      const jsonText = JSON.stringify(response_data);
      pipeline.push(`
        return new Response(${JSON.stringify(jsonText)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `);
    }
  }
  // Single Handler
  else if (handlers.length === 1) {
    const handlerFn = handlers[0];
    const isFunctionAsync = isAsync(handlerFn)

    // const body = extractBody(handlerFn);

    // pipeline.push(`${body}`)

    if (isFunctionAsync) {
      pipeline.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);
    } else {
      pipeline.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `);
    }
  }
  // for multiple handlers
  else {
    handlers.forEach((handler, index) => {
      const isFunctionAsync = isAsync(handler)
      // const body = extractBody(handler);
      // pipeline.push(`{
      //   ${body}
      // }`);

      if (isFunctionAsync) {
        pipeline.push(`
            const response${index} = await handlers[${index}](req, server);
            if (response${index} instanceof Response) return response${index};
        `);
      } else {
        pipeline.push(`
            const response${index} = handlers[${index}](req, server);
            if (response${index} instanceof Response) return response${index};
        `);
      }
    })
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


//  Deprecated

// const prevBunReq = (diesel: DieselT, path: string, method: string, handlers: Function[]) => {
//   diesel.routes[path] = async (req: BunRequest, server: Server) => {

//     if (diesel.hasMiddleware) {
//       if (diesel.globalMiddlewares.length) {
//         const globalMiddlewareResponse = await executeBunMiddlewares(
//           diesel.globalMiddlewares,
//           req,
//           server
//         );
//         if (globalMiddlewareResponse) return globalMiddlewareResponse;
//       }

//       const pathMiddlewares = diesel.middlewares.get(path) || [];
//       if (pathMiddlewares?.length) {
//         const pathMiddlewareResponse = await executeBunMiddlewares(
//           pathMiddlewares,
//           req,
//           server
//         );
//         if (pathMiddlewareResponse) return pathMiddlewareResponse;
//       }
//     }

//     if (method !== req.method) return new Response("Method Not Allowed", { status: 405 });

//     if (handlers.length === 1) {
//       const response = handlers[0](req, server)
//       if (response instanceof Promise) {
//         const resolved = await response;
//         return resolved ?? new Response("Not Found", { status: 404 });
//       }
//       if (response instanceof Response) return response
//     }
//     else {
//       for (let i = 0; i < handlers.length; i++) {
//         const response = handlers[i](req, server)
//         if (response instanceof Promise) {
//           const resolved = await response;
//           return resolved ?? new Response("Not Found", { status: 404 });
//         }
//         if (response instanceof Response) return response
//       }
//     }

//   }
// }
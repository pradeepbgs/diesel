import { BunRequest, Server } from "bun";
import createCtx, { Context } from "./ctx";
import type { DieselT } from "./types";
import { tryDecodeURI } from "./utils/urls";
import { generateErrorResponse, handleRouteNotFound, runFilter, runHooks, runMiddlewares } from "./utils/request.util";


export default async function handleRequest(
  req: Request,
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

  const ctx = new Context(req, server, pathname, routeHandler?.path)
  // const ctx = createCtx(req,server,pathname,routeHandler?.path)


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
import { Server } from "bun";
import { ContextType, DieselT } from "./types";
import createCtx from "./ctx";
import { applyCors, generateErrorResponse, handleFilterRequest, handleStaticFiles } from "./handleRequest";

export const pipelineHandler = async (req: Request, server: Server, url: URL, diesel: DieselT) => {

    const ctx: ContextType = createCtx(req, server, url);

    const pipeline = [

        () => applyCors(req, ctx, diesel.corsConfig),

        () => diesel.hasOnReqHook && diesel.hooks.onRequest?.(req, url, server),

        async () => diesel.hasFilterEnabled && await handleFilterRequest(diesel, req.routePattern ?? url.pathname, ctx, server),

        async () => {
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
        },

        async () => {
            const routeHandler = diesel.trie.search(url.pathname, req.method);
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
            if (routeHandler?.isDynamic) req.routePattern = routeHandler.path;

            if (diesel.hasPreHandlerHook) {
                const preHookResponse = await diesel.hooks.preHandler?.(ctx);
                if (preHookResponse) return preHookResponse;
            }

            const result = await routeHandler.handler(ctx);

            if (diesel.hasPostHandlerHook && diesel.hooks.postHandler) {
                await diesel.hooks.postHandler(ctx);
            }
            if (diesel.hasOnSendHook && diesel.hooks.onSend) {
                const hookResponse = await diesel.hooks.onSend(ctx, result);
                if (hookResponse) return hookResponse;
            }
            return result ?? generateErrorResponse(204, "No response from this handler");
        }

    ]

    for (let i = 0; i < pipeline.length; i++) {
        const result = await pipeline[i]();
        if (result) return result;
    }
}
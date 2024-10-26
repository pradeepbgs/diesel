var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import createCtx from "./ctx";
export default function handleRequest(req, server, url, diesel) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // Try to find the route handler in the trie
        const routeHandler = diesel.trie.search(url.pathname, req.method);
        // Early return if route or method is not found
        if (!routeHandler || routeHandler.method !== req.method) {
            return new Response(routeHandler ? "Method not allowed" : `Route not found for ${url.pathname}`, {
                status: routeHandler ? 405 : 404,
            });
        }
        // If the route is dynamic, we only set routePattern if necessary
        if (routeHandler.isDynamic)
            req.routePattern = routeHandler.path;
        // create the context which contains the methods Req,Res, many more
        const ctx = createCtx(req, server, url);
        // cors execution
        if (diesel.corsConfig) {
            const corsResult = applyCors(req, ctx, diesel.corsConfig);
            if (corsResult)
                return corsResult;
        }
        // OnReq hook 1
        if (diesel.hasOnReqHook && diesel.hooks.onRequest)
            diesel.hooks.onRequest(ctx, server);
        // filter applying
        if (diesel.hasFilterEnabled) {
            const path = (_a = req.routePattern) !== null && _a !== void 0 ? _a : url.pathname;
            const hasRoute = diesel.filters.includes(path);
            if (hasRoute === false) {
                if (diesel.filterFunction) {
                    try {
                        const filterResult = yield diesel.filterFunction(ctx, server);
                        if (filterResult)
                            return filterResult;
                    }
                    catch (error) {
                        console.error("Error in filterFunction:", error);
                        return new Response(JSON.stringify({
                            message: "Internal Server Error"
                        }), { status: 500 });
                    }
                }
                else {
                    return new Response(JSON.stringify({
                        message: "Authentication required"
                    }), { status: 400 });
                }
            }
        }
        // middleware execution 
        if (diesel.hasMiddleware) {
            // first run global midl
            for (const globalMiddleware of diesel.globalMiddlewares) {
                const result = yield globalMiddleware(ctx, server);
                if (result)
                    return result;
            }
            // then path specific midl
            const pathMiddlewares = diesel.middlewares.get(url.pathname) || [];
            for (const pathMiddleware of pathMiddlewares) {
                const result = yield pathMiddleware(ctx, server);
                if (result)
                    return result;
            }
        }
        // Run preHandler hooks 2
        if (diesel.hasPreHandlerHook && diesel.hooks.preHandler) {
            const Hookresult = yield diesel.hooks.preHandler(ctx);
            if (Hookresult)
                return Hookresult;
        }
        const preHandlerResult = diesel.hasPreHandlerHook ? yield ((_c = (_b = diesel.hooks).preHandler) === null || _c === void 0 ? void 0 : _c.call(_b, ctx)) : null;
        if (preHandlerResult)
            return preHandlerResult;
        // Finally, execute the route handler and return its result
        try {
            const result = yield routeHandler.handler(ctx);
            // 3. run the postHandler hooks 
            if (diesel.hasPostHandlerHook && diesel.hooks.postHandler) {
                yield diesel.hooks.postHandler(ctx);
            }
            // 4. Run onSend hooks before sending the response
            if (diesel.hasOnSendHook && diesel.hooks.onSend) {
                const hookResponse = yield diesel.hooks.onSend(ctx, result);
                if (hookResponse)
                    return hookResponse;
            }
            return result !== null && result !== void 0 ? result : new Response("No response from handler", { status: 204 });
        }
        catch (error) {
            return new Response("Internal Server Error", { status: 500 });
        }
    });
}
function applyCors(req, ctx, config = {}) {
    var _a, _b, _c, _d, _e;
    const origin = (_a = req.headers.get('origin')) !== null && _a !== void 0 ? _a : '*';
    const allowedOrigins = config === null || config === void 0 ? void 0 : config.origin;
    const allowedHeaders = (_b = config === null || config === void 0 ? void 0 : config.allowedHeaders) !== null && _b !== void 0 ? _b : ["Content-Type", "Authorization"];
    const allowedMethods = (_c = config === null || config === void 0 ? void 0 : config.methods) !== null && _c !== void 0 ? _c : ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
    const allowedCredentials = (_d = config === null || config === void 0 ? void 0 : config.credentials) !== null && _d !== void 0 ? _d : false;
    const exposedHeaders = (_e = config === null || config === void 0 ? void 0 : config.exposedHeaders) !== null && _e !== void 0 ? _e : [];
    ctx.setHeader('Access-Control-Allow-Methods', allowedMethods);
    ctx.setHeader("Access-Control-Allow-Headers", allowedHeaders);
    ctx.setHeader("Access-Control-Allow-Credentials", allowedCredentials);
    if (exposedHeaders.length) {
        ctx.setHeader("Access-Control-Expose-Headers", exposedHeaders);
    }
    if (allowedOrigins === '*') {
        ctx.setHeader("Access-Control-Allow-Origin", "*");
    }
    else if (Array.isArray(allowedOrigins)) {
        if (origin && allowedOrigins.includes(origin)) {
            ctx.setHeader("Access-Control-Allow-Origin", origin);
        }
        else if (allowedOrigins.includes('*')) {
            ctx.setHeader("Access-Control-Allow-Origin", '*');
        }
        else {
            return ctx.status(403).json({ message: "CORS not allowed" });
        }
    }
    else if (typeof allowedOrigins === 'string') {
        if (origin === allowedOrigins) {
            ctx.setHeader("Access-Control-Allow-Origin", origin);
        }
        else {
            return ctx.status(403).json({ message: "CORS not allowed" });
        }
    }
    else {
        return ctx.status(403).json({ message: "CORS not allowed" });
    }
    ctx.setHeader("Access-Control-Allow-Origin", origin);
    if (req.method === 'OPTIONS') {
        ctx.setHeader('Access-Control-Max-Age', '86400');
        return ctx.status(204).text('');
    }
    return null;
}

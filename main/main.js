var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";
import rateLimit from "./utils.js";
export default class Diesel {
    constructor() {
        this.routes = [];
        this.globalMiddlewares = [];
        this.middlewares = new Map();
        this.trie = new Trie();
        this.corsConfig = null;
        this.hasMiddleware = false;
        this.hasOnReqHook = false;
        this.hasPreHandlerHook = false;
        this.hasPostHandlerHook = false;
        this.hasOnSendHook = false;
        this.hooks = {
            onRequest: null,
            preHandler: null,
            postHandler: null,
            onSend: null,
            onError: null,
            onClose: null
        };
        this.filters = [];
        this.filterFunction = null;
        this.hasFilterEnabled = false;
        this.wss = null;
    }
    filter() {
        this.hasFilterEnabled = true;
        return {
            routeMatcher: (...routes) => {
                this.routes = routes.sort();
                return this.filter();
            },
            permitAll: () => {
                for (const route of this === null || this === void 0 ? void 0 : this.routes) {
                    this.filters.push(route);
                }
                return this.filter();
            },
            require: (fnc) => {
                if (fnc) {
                    this.filterFunction = fnc;
                }
            }
        };
    }
    cors(corsConfig) {
        this.corsConfig = corsConfig;
    }
    addHooks(typeOfHook, fnc) {
        if (typeof typeOfHook !== 'string') {
            throw new Error("hookName must be a string");
        }
        if (typeof fnc !== 'function') {
            throw new Error("callback must be a instance of function");
        }
        if (this.hooks.hasOwnProperty(typeOfHook)) {
            this.hooks[typeOfHook] = fnc; // Overwrite or set the hook
        }
        else {
            throw new Error(`Unknown hook type: ${typeOfHook}`); // Throw an error for invalid hook types
        }
    }
    compile() {
        if (this.globalMiddlewares.length > 0) {
            this.hasMiddleware = true;
        }
        for (const [path, middlewares] of this.middlewares.entries()) {
            if (middlewares.length > 0) {
                this.hasMiddleware = true;
                break;
            }
        }
        // check if hook is present or not
        if (this.hooks.onRequest)
            this.hasOnReqHook = true;
        if (this.hooks.preHandler)
            this.hasPreHandlerHook = true;
        if (this.hooks.postHandler)
            this.hasPostHandlerHook = true;
        if (this.hooks.onSend)
            this.hasOnSendHook = true;
    }
    listen(port, callback, { sslCert = null, sslKey = null } = {}) {
        if (typeof Bun === 'undefined')
            throw new Error('.listen() is designed to run on Bun only...');
        if (typeof port !== "number") {
            throw new Error('Port must be a numeric value');
        }
        this.compile();
        const options = {
            port,
            fetch: (req, server) => __awaiter(this, void 0, void 0, function* () {
                const url = new URL(req.url);
                try {
                    return yield handleRequest(req, server, url, this);
                }
                catch (error) {
                    return new Response("Internal Server Error", { status: 500 });
                }
            }),
            onClose() {
                console.log("Server is shutting down...");
            },
        };
        if (sslCert && sslKey) {
            options.certFile = sslCert;
            options.keyFile = sslKey;
        }
        const server = Bun.serve(options);
        Bun === null || Bun === void 0 ? void 0 : Bun.gc(false);
        if (typeof callback === "function") {
            return callback();
        }
        if (sslCert && sslKey) {
            console.log(`HTTPS server is running on https://localhost:${port}`);
        }
        else {
            console.log(`HTTP server is running on http://localhost:${port}`);
        }
        return server;
    }
    register(pathPrefix, handlerInstance) {
        if (typeof pathPrefix !== 'string') {
            throw new Error("path must be a string");
        }
        if (typeof handlerInstance !== 'object') {
            throw new Error("handler parameter should be a instance of router object", handlerInstance);
        }
        const routeEntries = Object.entries(handlerInstance.trie.root.children);
        handlerInstance.trie.root.subMiddlewares.forEach((middleware, path) => {
            if (!this.middlewares.has(pathPrefix + path)) {
                this.middlewares.set(pathPrefix + path, []);
            }
            middleware === null || middleware === void 0 ? void 0 : middleware.forEach((midl) => {
                var _a, _b;
                if (!((_a = this.middlewares.get(pathPrefix + path)) === null || _a === void 0 ? void 0 : _a.includes(midl))) {
                    (_b = this.middlewares.get(pathPrefix + path)) === null || _b === void 0 ? void 0 : _b.push(midl);
                }
            });
        });
        for (const [routeKey, routeNode] of routeEntries) {
            const fullpath = pathPrefix + (routeNode === null || routeNode === void 0 ? void 0 : routeNode.path);
            const routeHandler = routeNode.handler[0];
            const httpMethod = routeNode.method[0];
            this.trie.insert(fullpath, { handler: routeHandler, method: httpMethod });
        }
        handlerInstance.trie = new Trie();
    }
    addRoute(method, path, handlers) {
        if (typeof path !== "string") {
            throw new Error("Path must be a string type");
        }
        if (typeof method !== "string") {
            throw new Error("method must be a string type");
        }
        const middlewareHandlers = handlers.slice(0, -1);
        const handler = handlers[handlers.length - 1];
        if (!this.middlewares.has(path)) {
            this.middlewares.set(path, []);
        }
        middlewareHandlers.forEach((middleware) => {
            var _a, _b;
            if (path === '/') {
                if (!this.globalMiddlewares.includes(middleware)) {
                    this.globalMiddlewares.push(middleware);
                }
            }
            else {
                if (!((_a = this.middlewares.get(path)) === null || _a === void 0 ? void 0 : _a.includes(middleware))) {
                    (_b = this.middlewares.get(path)) === null || _b === void 0 ? void 0 : _b.push(middleware);
                }
            }
        });
        this.trie.insert(path, { handler, method });
    }
    use(pathORHandler, handler) {
        var _a, _b;
        if (typeof pathORHandler === "function") {
            if (!this.globalMiddlewares.includes(pathORHandler)) {
                this.globalMiddlewares.push(pathORHandler);
            }
            return;
        }
        const path = pathORHandler;
        if (!this.middlewares.has(path)) {
            this.middlewares.set(path, []);
        }
        if (handler) {
            if (!((_a = this.middlewares.get(path)) === null || _a === void 0 ? void 0 : _a.includes(handler))) {
                (_b = this.middlewares.get(path)) === null || _b === void 0 ? void 0 : _b.push(handler);
            }
        }
    }
    get(path, ...handlers) {
        this.addRoute("GET", path, handlers);
        return this;
    }
    post(path, ...handlers) {
        this.addRoute("POST", path, handlers);
        return this;
    }
    put(path, ...handlers) {
        this.addRoute("PUT", path, handlers);
        return this;
    }
    patch(path, ...handlers) {
        this.addRoute("PATCH", path, handlers);
        return this;
    }
    delete(path, ...handlers) {
        this.addRoute("DELETE", path, handlers);
        return this;
    }
}
export { rateLimit, };

import Trie from "./trie.js";
import { ContextType, corsT, HookFunction, HookType, middlewareFunc, type handlerFunction, type Hooks, type listenCalllBackType } from "./types.js";
import { Server } from "bun";
declare class Diesel {
    #private;
    routes: Map<String, any>;
    globalMiddlewares: middlewareFunc[];
    middlewares: Map<string, middlewareFunc[]>;
    trie: Trie;
    hasOnReqHook: boolean;
    hasMiddleware: boolean;
    hasPreHandlerHook: boolean;
    hasPostHandlerHook: boolean;
    hasOnSendHook: boolean;
    hooks: Hooks;
    corsConfig: corsT;
    constructor();
    cors(corsConfig: corsT): void;
    addHooks(typeOfHook: HookType, fnc: HookFunction): void;
    compile(): void;
    listen(port: number, callback?: listenCalllBackType, { sslCert, sslKey }?: any): void | Server;
    register(pathPrefix: string, handlerInstance: any): void;
    use(pathORHandler?: string | middlewareFunc, handler?: middlewareFunc): void;
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: any, ...handlers: handlerFunction[]): this;
}
declare function rateLimit(props: {
    time?: number;
    max?: number;
    message?: string;
}): (ctx: ContextType) => void | Response;
export { Diesel, rateLimit };

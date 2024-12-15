import Trie from "./trie.js";
import { corsT, FilterMethods, HookFunction, HookType, middlewareFunc, onError, onRequest, type handlerFunction, type Hooks, type HttpMethod, type listenCalllBackType } from "./types.js";
import { Server } from "bun";
export default class Diesel {
    tempRoutes: Map<string, any>;
    globalMiddlewares: middlewareFunc[];
    middlewares: Map<string, middlewareFunc[]>;
    trie: Trie;
    hasOnReqHook: boolean;
    hasMiddleware: boolean;
    hasPreHandlerHook: boolean;
    hasPostHandlerHook: boolean;
    hasOnSendHook: boolean;
    hasOnError: boolean;
    hooks: Hooks;
    corsConfig: corsT;
    FilterRoutes: string[] | null | undefined;
    filters: Set<string>;
    filterFunction: middlewareFunc | null;
    hasFilterEnabled: boolean;
    constructor();
    filter(): FilterMethods;
    cors(corsConfig: corsT): void;
    addHooks(typeOfHook: HookType, fnc: HookFunction | onError | onRequest): void;
    compile(): void;
    listen(port: number, callback?: listenCalllBackType, { sslCert, sslKey }?: any): Server | void;
    route(basePath: string, routerInstance: any): void;
    register(pathPrefix: string, handlerInstance: any): void;
    addRoute(method: HttpMethod, path: string, handlers: handlerFunction[]): void;
    use(pathORHandler?: string | middlewareFunc, ...handlers: middlewareFunc[]): void;
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: any, ...handlers: handlerFunction[]): this;
}

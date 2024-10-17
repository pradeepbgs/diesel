import Trie from "./trie.js";
import { corsT, HookType, type handlerFunction, type Hooks, type listenCalllBackType } from "./types.js";
declare class Diesel {
    #private;
    routes: Map<String, any>;
    globalMiddlewares: handlerFunction[];
    middlewares: Map<string, handlerFunction[]>;
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
    addHooks(typeOfHook: HookType, fnc: handlerFunction): void;
    compile(): void;
    listen(port: number, callback?: listenCalllBackType, { sslCert, sslKey }?: any): void | import("bun").Server;
    register(pathPrefix: string, handlerInstance: any): void;
    use(pathORHandler: string | handlerFunction, handler: handlerFunction): number | undefined;
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: any, ...handlers: handlerFunction[]): this;
}
export { Diesel };

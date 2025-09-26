import { Handler, HTTPVersion } from "find-my-way";
import { handlerFunction, middlewareFunc } from "../types";
import { NormalizedRoute, Router } from "./interface";
declare class TrieNodes {
    children: Map<string, TrieNodes>;
    isEndOfWord: boolean;
    handlers: Map<string, () => void>;
    paramName: string[];
    middlewares: middlewareFunc[];
    constructor();
}
export declare class TrieRouter {
    root: TrieNodes;
    globalMiddlewares: middlewareFunc[];
    constructor();
    pushMiddleware(path: string, ...handlers: middlewareFunc[]): void;
    insert(method: string, path: string, handler: () => void): void;
    search(method: string, path: string): {
        handler: middlewareFunc[];
        params?: undefined;
    } | {
        params: string[];
        handler: middlewareFunc[];
    };
}
export declare class TrieRouter2 implements Router {
    private trie;
    private cache;
    constructor();
    add(method: string, path: string, handler: handlerFunction | Handler<HTTPVersion.V1>): void;
    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export {};

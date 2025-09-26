import { NormalizedRoute, Router } from "../router/interface";
import type { handlerFunction, HttpMethod, middlewareFunc, RouteHandlerT } from "../types";
declare class TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
    handler: handlerFunction | null;
    isDynamic: boolean;
    pattern: string;
    path: string;
    methodMap: Map<string, handlerFunction>;
    segmentCount: number;
    params: string[];
    middlewares: middlewareFunc[];
    constructor();
}
export default class Trie {
    root: TrieNode;
    cachedSegments: Map<string, string[]>;
    globalMiddlewares: middlewareFunc[];
    constructor();
    pushMidl(path: string, ...middlewares: middlewareFunc[]): void;
    insert(path: string, route: RouteHandlerT): void;
    search(path: string, method: HttpMethod): {
        handler: middlewareFunc[];
        params?: undefined;
    } | {
        params: string[];
        handler: middlewareFunc[];
    };
}
export declare class TrieRouter implements Router {
    private trie;
    private cache;
    add(method: string, path: string, handler: handlerFunction): void;
    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export {};

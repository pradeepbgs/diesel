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
    constructor();
}
export default class Trie {
    root: TrieNode;
    cachedSegments: Map<string, string[]>;
    constructor();
    pushMidl(path: string, ...middlewares: middlewareFunc[]): void;
    insert(path: string, route: RouteHandlerT): void;
    search(path: string, method: HttpMethod): {
        handler: handlerFunction;
        params: string[];
    } | null;
}
export declare class TrieRouter implements Router {
    private trie;
    private cache;
    add(method: string, path: string, handler: handlerFunction): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export {};

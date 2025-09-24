import { NormalizedRoute, Router } from "../router/interface";
import type { handlerFunction, HttpMethod, middlewareFunc, RouteHandlerT } from "../types";
declare class TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
    handler: handlerFunction[] | middlewareFunc[] | any;
    isDynamic: boolean;
    pattern: string;
    path: string;
    method: string[];
    constructor();
}
export default class Trie {
    root: TrieNode;
    constructor();
    pushMidl(path: string, ...middlewares: middlewareFunc[]): void;
    insert(path: string, route: RouteHandlerT): void;
    search(path: string, method: HttpMethod): {
        path: string;
        handler: any;
        pattern: string;
    } | null;
}
export declare class TrieRouter implements Router {
    private trie;
    private cache;
    add(method: string, path: string, handler: handlerFunction): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export {};

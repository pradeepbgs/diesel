import type { handlerFunction, HttpMethod, RouteHandlerT } from "./types";
declare class TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
    handler: handlerFunction[];
    isDynamic: boolean;
    pattern: string;
    path: string;
    method: string[];
    constructor();
}
export default class Trie {
    root: TrieNode;
    constructor();
    insert(path: string, route: RouteHandlerT): void;
    search(path: string, method: HttpMethod): {
        path: string;
        handler: handlerFunction;
        pattern: string;
    } | null;
}
export {};

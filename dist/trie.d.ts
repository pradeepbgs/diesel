import type { handlerFunction, HttpMethod, RouteT } from "./types";
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
    insert(path: string, route: RouteT): void;
    search(path: string, method: HttpMethod): {
        path: string;
        handler: handlerFunction;
        isDynamic: boolean;
        pattern: string;
        method: string;
    } | {
        path: string;
        handler: handlerFunction[];
        isDynamic: boolean;
        pattern: string;
        method: string;
    } | null;
}
export {};

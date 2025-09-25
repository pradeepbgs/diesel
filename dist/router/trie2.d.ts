import { Handler, HTTPVersion } from "find-my-way";
import { handlerFunction } from "../types";
import { NormalizedRoute, Router } from "./interface";
declare class TrieNodes {
    children: Map<string, TrieNodes>;
    isEndOfWord: boolean;
    handlers: Map<string, () => void>;
    paramName: string[];
    constructor();
}
export declare class TrieRouter {
    root: TrieNodes;
    constructor();
    insert(method: string, path: string, handler: () => void): void;
    search(method: string, path: string): {
        params: string[];
        handler: () => void;
    } | null;
}
export declare class TrieRouter2 implements Router {
    private trie;
    private cache;
    constructor();
    add(method: string, path: string, handler: handlerFunction | Handler<HTTPVersion.V1>): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export {};

import { handlerFunction, middlewareFunc } from "../types";
import { TrieRouter } from "./trie";
import { TrieRouter2 } from "./trie2";

export interface Router {
    add(method: string, path: string, handler: handlerFunction): void
    find(method: string, path: string): Find | null
    addMiddleware(path: string, handlers: middlewareFunc[]): void
}

export interface Find {
    params: string[] | null;
    handler: middlewareFunc[];
}


export class RouterFactory {
    static create(name?: string): Router {
        switch (name) {
            case 't2':
                return new TrieRouter2()
            case 'trie':
                return new TrieRouter()
            default: return new TrieRouter2()
        }
    }
}
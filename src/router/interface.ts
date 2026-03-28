import { TrieRouter } from "./trie.js";


export interface Router {
    add(method: string, path: string, handler: Function): void
    find(method: string, path: string): Find
    addMiddleware(path: string, handlers: Function | Function[]): void
}

export interface Find {
    params: Record<string, string> | undefined;
    middlewares: Function[] | undefined;
    handler: Function | undefined;
}

export class RouterFactory {
    static create(name?: string): Router {
        switch (name) {
            case 't2':
                return new TrieRouter()
            case 'trie':
                return new TrieRouter()
            default: return new TrieRouter()
        }
    }
}
import { TrieRouter } from "./trie.js";


export interface Router {
    add(method: string, path: string, handler: Function): void
    find(method: string, path: string): Find | null
    addMiddleware(path: string, handlers: Function | Function[]): void
}

export interface Find {
    params: Record<string, number>|null;
    handler: Function[];
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
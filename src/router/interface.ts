import { handlerFunction, middlewareFunc } from "../types";
import { Handler, HTTPVersion } from 'find-my-way'
import { TrieRouter } from "./trie";
import { FindMyWayRouter } from './find-my-way'
import { TrieRouter2 } from "./trie2";

export interface Router {
    add(method: string, path: string, handler: handlerFunction | Handler<HTTPVersion.V1>): void
    find(method: string, path: string): NormalizedRoute | null
    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void
}

export interface RouteMatchResult {
    handler: handlerFunction | Handler<HTTPVersion.V1>;
    params: { [k: string]: string | undefined; }
}

export interface NormalizedRoute {
    handler: handlerFunction | handlerFunction[] | middlewareFunc[];
    params?: Record<string, string> | string[];
    path?: string | { [k: string]: string | undefined; }
    method?: string;
}



export class RouterFactory {


    static create(name?: string): Router {
        switch (name) {
            case 't2':
                return new TrieRouter2()
            case 'trie':
                return new TrieRouter()
            case 'fastify':
                return new FindMyWayRouter()
            case 'fs':
                return new FindMyWayRouter()
            case 'find-my-way':
                return new FindMyWayRouter()
            case 'findmyway':
                return new FindMyWayRouter()
            default: return new TrieRouter()
        }
    }
    
}
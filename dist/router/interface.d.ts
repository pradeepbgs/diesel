import { handlerFunction } from "../types";
import { Handler, HTTPVersion } from 'find-my-way';
export interface Router {
    add(method: string, path: string, handler: handlerFunction | Handler<HTTPVersion.V1>): void;
    find(method: string, path: string): NormalizedRoute | null;
}
export interface RouteMatchResult {
    handler: handlerFunction | Handler<HTTPVersion.V1>;
    params: {
        [k: string]: string | undefined;
    };
}
export interface NormalizedRoute {
    handler: handlerFunction;
    params?: Record<string, string>;
    path?: string;
    method?: string;
}
export declare class RouterFactory {
    static create(name?: string): Router;
}

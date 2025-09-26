import { NormalizedRoute, Router } from './interface';
import { handlerFunction, middlewareFunc } from '../types';
export declare class FindMyWayRouter implements Router {
    private router;
    add(method: string, path: string, handler: handlerFunction): void;
    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void;
    find(method: string, path: string): NormalizedRoute | null;
}

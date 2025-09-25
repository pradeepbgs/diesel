import { NormalizedRoute, Router } from './interface';
import { handlerFunction } from '../types';
export declare class FindMyWayRouter implements Router {
    private router;
    add(method: string, path: string, handler: handlerFunction): void;
    find(method: string, path: string): NormalizedRoute | null;
}

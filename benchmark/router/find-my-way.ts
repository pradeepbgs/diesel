import FindMyWay, { type HTTPMethod } from 'find-my-way';
import type { Find, Router } from '../../src/router/interface';
import type { handlerFunction, middlewareFunc } from '../../src/types';

export class FindMyWayRouter implements Router {
    private router = FindMyWay({});

    add(method: string, path: string, handler: handlerFunction) {
        this.router.on(method as any, path, handler as any);
    }

    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void {
        // throw new Error("Middl is disbaled for fastify router , use native t2 for now")
    }

    find(method: string, path: string): Find | null {
        return this.router.find(method as HTTPMethod, path)
    }
}
import FindMyWay, { HTTPMethod } from 'find-my-way';
import { NormalizedRoute, Router } from './interface';
import { handlerFunction, middlewareFunc } from '../types';

export class FindMyWayRouter implements Router {
    private router = FindMyWay({});

    add(method: string, path: string, handler: handlerFunction) {
        this.router.on(method as any, path, handler as any);
    }

    addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void {
        // throw new Error("Middl is disbaled for fastify router , use native t2 for now")
    }

    find(method: string, path: string): NormalizedRoute | null {
        const result = this.router.find(method as HTTPMethod, path) as any
        if (result) return { handler: [result.handler], params: result.params };
        return null;
    }
}

import { Handler, HTTPVersion } from "find-my-way";
import { handlerFunction, middlewareFunc } from "../types";
import { NormalizedRoute, Router } from "./interface";
import { extractDynamicParams, extractParam } from "../ctx";

class TrieNodes {
    children: Map<string, TrieNodes>
    isEndOfWord: boolean
    handlers: Map<string, () => void>;
    paramName: string[]
    middlewares: middlewareFunc[]
    constructor() {
        this.children = new Map()
        this.handlers = new Map()
        this.isEndOfWord = false
        this.paramName = []
        this.middlewares = []
    }

}

//
export class TrieRouter {
    root: TrieNodes
    globalMiddlewares: middlewareFunc[]
    constructor() {
        this.root = new TrieNodes()
        this.globalMiddlewares = []
    }

    pushMiddleware(path: string, ...handlers: middlewareFunc[]) {
        if (path === '/') {
            this.globalMiddlewares.push(...handlers)
            return;
        }

        let node = this.root;
        const pathSegments = path.split("/").filter(Boolean);

        for (const element of pathSegments) {
            let key = element
            if (element.startsWith(':')) {
                key = ':'
            }
            else if (element.startsWith('*')) {
                node.middlewares.push(...handlers)
            }

            if (!node.children.has(key)) node.children.set(key, new TrieNodes());

            node = node.children.get(key)!
        }

        node.middlewares.push(...handlers)

        // node.isEndOfWord = true
    }

    insert(method: string, path: string, handler: () => void) {
        let node = this.root

        const pathSegments = path.split('/').filter(Boolean);

        // handle if path is / 
        if (path === '/') {
            node.isEndOfWord = true
            node.handlers.set(method, handler)
            node.paramName = []
            return;
        }

        for (const element of pathSegments) {
            let key = element
            if (element.startsWith(':')) {
                key = ':'
            }

            if (!node.children.has(key)) node.children.set(key, new TrieNodes());

            node = node.children.get(key)!
        }

        node.paramName = pathSegments
            .filter(s => s.startsWith(':'))
            .map(s => s.slice(1))

        node.handlers.set(method, handler)
        node.isEndOfWord = true
    }

    search(method: string, path: string,) {
        let node = this.root

        const pathSegments = path.split('/').filter(Boolean);

        let collected: middlewareFunc[] = [...this.globalMiddlewares];
        // console.log('collected midl ', collected)
        for (const element of pathSegments) {
            // if (node.children.has('*')) {
            //     collected.push(...node.children.get('*')!.middlewares);
            // }
            if (node.children.has(element)) {
                node = node.children.get(element)!;
            } else if (node.children.has(':')) {
                node = node.children.get(':')!;
            } else if (node.children.has('*')) {
                // collected.push(...node.children.get('*')!.middlewares);
                node = node.children.get('*')!;
                break;
            } else {
                // console.log('object');
                return { handler: collected };
            }

            if (node.middlewares.length > 0) {
                collected.push(...node.middlewares);
            }
        }

        const handlers = [...collected];
        const methodHandler = node.handlers.get(method);
        if (methodHandler) handlers.push(methodHandler);
        return {
            params: node.paramName as string[],
            handler: handlers
        }

        // if (node.isEndOfWord) {
        //     const h = node.handlers.get(method)
        //     return h ? {
        //         params: node.paramName as string[],
        //         handler: [...collected, node.handlers.get(method)]
        //     } : {
        //         handler: collected
        //     }
        // }
        // return {
        //     handler: [...this.globalMiddlewares]
        // }
    }
}


export class TrieRouter2 implements Router {
    private trie: TrieRouter
    private cache: Map<string, NormalizedRoute | null> = new Map()

    constructor() {
        this.trie = new TrieRouter()
    }

    add(method: string, path: string, handler: handlerFunction | Handler<HTTPVersion.V1>): void {
        this.trie.insert(method, path, handler as any)
    }

    addMiddleware(path: string, ...handlers: middlewareFunc[] | any) {
        this.trie.pushMiddleware(path, ...handlers)
    }

    find(method: string, path: string): NormalizedRoute | null {

        return this.trie.search(method, path) as any

        const cacheKey = method + ':' + path
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!

        const result = this.trie.search(method, path) as any
        this.cache.set(cacheKey, result)
        return result
    }
}


// const t1 = new TrieRouter()
// t1.insert('GET', '/', () => "Hello /")
// t1.insert('GET', "/user", () => "Hell /user")
// t1.insert('GET', '/user/*', () => 'user/* route')
// t1.insert('GET', '/hello/*', () => '/hello/*')
// t1.insert('GET', '/moon/:id', () => "/moon/:id")

// t1.pushMiddleware('/', function home() {
//     return "Midd /" as any
// })
// t1.pushMiddleware('/user/*', () => "user/* middleware " as any)

// const h = t1.search('GET', '/user/2')

// for (const k of h?.handler!) {
//     console.log(k?.(null as any, null as any))
// }

// const router = new TrieRouter()
// global middleware (applies to all requests)
// router.pushMiddleware('/', () => 'log mid' as any);

// // path-specific middleware
// router.pushMiddleware('/users/*', () => "/user/* middleware" as any);        // applies to /users/* paths
// router.pushMiddleware('/users/:id', () => "id checkmid " as any); // applies to /users/:id/*

// routes
// router.insert('GET', '/users', () => "get user by handlr") as any;
// router.insert('GET', '/users/:id', () => "get user by id handler" as any);
// router.insert('GET', '/users/:id/profile', () => "get user / id / profile");
// router.insert('GET', '/users/hello', () => "Hello /user/hello")

// const matched = router.search('POST', '/users/hello')
// console.log(matched.handler?.length)
// for (const k of matched?.handler!) {
//     console.log(k?.(null as any, null as any))
// }

// for (let i = 0; i < 4; i++) {
//     t1.f
// }

// const t = new TrieRouter2()
// t.add('GET', '/user/:id/:name', () => 'root')
// t.add('GET', '/user/:id/pk', () => 'root /user/:id/pk')


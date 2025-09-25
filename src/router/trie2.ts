import { Handler, HTTPVersion } from "find-my-way";
import { handlerFunction } from "../types";
import { NormalizedRoute, Router } from "./interface";
import { extractDynamicParams, extractParam } from "../ctx";

class TrieNodes {
    children: Map<string, TrieNodes>
    isEndOfWord: boolean
    handlers: Map<string, () => void>;
    paramName: string[]

    constructor() {
        this.children = new Map()
        this.handlers = new Map()
        this.isEndOfWord = false
        this.paramName = []
    }

}

//
export class TrieRouter {
    root: TrieNodes
    constructor() {
        this.root = new TrieNodes()
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

        // custom 
        // const startCutsom = performance.now();
        // let segmentStart = 0
        // let segmentIndex = 0
        // const segments: string[] = []

        // for (let i = 0; i <= path.length; i++) {
        //     if (i === path.length || path.charCodeAt(i) === 47) { // 47 means /
        //         console.log(path.slice(segmentStart, i))
        //         if (i > segmentStart) {
        //             segments.push(path.slice(segmentStart, i));
        //         }
        //         segmentStart = i + 1
        //     }
        // }
        // const end = performance.now();

        // const totalMs = end - startCutsom;
        // console.log(`lookup time custom : ${totalMs.toFixed(2)} ms `);
        // // normal

        const pathSegments = path.split('/').filter(Boolean);



        for (const element of pathSegments) {
            if (!node.children.has(element)) {
                if (node.children.has(':')) {
                    node = node.children.get(':')!
                }
                else if (node.children.has('*')) {
                    node = node.children.get('*')!
                    break;
                }
                else {
                    return null
                }
            }
            else {
                node = node.children.get(element)!
            }
        }

        if (node.isEndOfWord) {
            const h = node.handlers.get(method)
            return h ? {
                params: node.paramName as string[],
                handler: h
            } : null
        }
        return null
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

    find(method: string, path: string): NormalizedRoute | null {

        return this.trie.search(method,path) as any
        
        const cacheKey = method + ':' + path
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!

        const result = this.trie.search(method, path) as any
        this.cache.set(cacheKey, result)
        return result
    }
}


// const t = new TrieRouter2()
// t.add('GET', '/user/:id/:name', () => 'root')
// t.add('GET', '/user/:id/pk', () => 'root /user/:id/pk')


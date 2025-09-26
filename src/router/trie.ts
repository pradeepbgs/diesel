import { extractParam } from "../ctx";
import { NormalizedRoute, Router } from "../router/interface";
import type {
  handlerFunction,
  HttpMethod,
  middlewareFunc,
  RouteHandlerT,
} from "../types";

class TrieNode {
  children: Record<string, TrieNode>;
  isEndOfWord: boolean;
  handler: handlerFunction | null;
  isDynamic: boolean;
  pattern: string;
  path: string;
  methodMap: Map<string, handlerFunction>; // O(1) method lookup
  segmentCount: number; // cached number of segments
  params: string[]
  middlewares: middlewareFunc[]
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = null;
    this.isDynamic = false;
    this.pattern = "";
    this.path = "";
    this.methodMap = new Map();
    this.segmentCount = 0;
    this.params = [];
    this.middlewares = []
  }
}

export default class Trie {
  root: TrieNode;
  cachedSegments: Map<string, string[]>;
  globalMiddlewares: middlewareFunc[]

  constructor() {
    this.root = new TrieNode();
    this.cachedSegments = new Map();
    this.globalMiddlewares = []
  }

  pushMidl(path: string, ...middlewares: middlewareFunc[]) {
    let node = this.root;
    const segments = path.split("/").filter(Boolean);

    if (path === "/") {
      node.handler = middlewares[0] as any
      this.globalMiddlewares.push(...middlewares)
      return;
    }

    for (const segment of segments) {
      let key = segment;
      if (segment.startsWith(":")) key = ":";

      else if (segment.startsWith('*')) node.middlewares.push(...middlewares)

      if (!node.children[key]) node.children[key] = new TrieNode();
      node = node.children[key];
    }
    node.middlewares.push(...middlewares)
    node.handler = middlewares[0] as any// store first middleware
  }

  insert(path: string, route: RouteHandlerT): void {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);

    this.cachedSegments.set(path, pathSegments);

    if (path === "/") {
      node.isEndOfWord = true;
      node.handler = route.handler;
      node.path = path;
      node.methodMap.set(route.method!, route.handler);
      node.segmentCount = 0;
      node.params = []
      return;
    }

    for (const segment of pathSegments) {
      let key = segment;
      let isDynamic = false;

      if (segment.startsWith(":")) {
        isDynamic = true;
        key = ":";
      }

      if (segment === "*") key = "*";

      if (!node.children[key]) node.children[key] = new TrieNode();
      node = node.children[key];
      node.isDynamic = isDynamic;
      node.pattern = segment;
    }

    node.params = pathSegments
      .filter(s => s.startsWith(':'))
      .map(s => s.slice(1))

    node.isEndOfWord = true;
    node.path = path;
    node.segmentCount = pathSegments.length;
    node.methodMap.set(route.method!, route.handler);
    node.handler = route.handler; // first handler reference
  }

  search(path: string, method: HttpMethod) {
    let node = this.root;
    const pathSegments = this.cachedSegments.get(path) || path.split("/").filter(Boolean);
    let collected: middlewareFunc[] = [...this.globalMiddlewares];

    for (const segment of pathSegments) {
      let key = segment;

      if (node.children[key]) {
        node = node.children[key];
      } else if (node.children[":"]) {
        node = node.children[":"];
      } else if (node.children["*"]) {
        node = node.children["*"];
        break;
      } else {
        return { handler: collected };;
      }

      if (node.middlewares.length > 0) {
        collected.push(...node.middlewares);
      }
    }

    if (!node.isEndOfWord || node.segmentCount !== pathSegments.length) return { handler: collected };;

    const handler = node.methodMap.get(method);
    if (handler) collected.push(handler)

    return {
      params: node.params,
      handler: collected,
      // path: node.path,x
      // pattern: node.pattern,
    };
  }
}

// Implementation
export class TrieRouter implements Router {
  private trie = new Trie();
  private cache = new Map<string, NormalizedRoute>();

  add(method: string, path: string, handler: handlerFunction) {
    this.trie.insert(path, { method, handler });
  }

  addMiddleware(path: string, ...handlers: middlewareFunc[] | any): void {
    this.trie.pushMidl(path, ...handlers)
  }

  find(method: string, path: string): NormalizedRoute | null {
    return this.trie.search(path, method as HttpMethod)

    // const cacheKey = `${method}:${path}`;
    // const cached = this.cache.get(cacheKey);
    // if (cached) return cached;

    // const result = this.trie.search(path, method as HttpMethod);
    // if (result) this.cache.set(cacheKey, result);
    // return result;
  }
}

// const t = new TrieRouter()
// t.add('GET', '/user/:id/:name', () => 'root')
// t.add('GET', '/user/:id/pk', () => 'root /user/:id/pk')

// const m1 = t.find('GET', '/user/3/pradeep')
// const m2 = t.find("GET", "/user/3/pk")

// console.log(m1)

// console.log(m2?.handler())
// console.log(m1?.handler())

// const p = extractParam(m1?.params as string[], '/user/3/pk/')
// console.log(p)
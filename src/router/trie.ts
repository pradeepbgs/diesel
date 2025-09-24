import { NormalizedRoute, Router } from "./router/interface";
import type {
  handlerFunction,
  HttpMethod,
  middlewareFunc,
  RouteHandlerT,
} from "./types";

class TrieNode {
  children: Record<string, TrieNode>;
  isEndOfWord: boolean;
  handler: handlerFunction | null;
  isDynamic: boolean;
  pattern: string;
  path: string;
  methodMap: Map<string, handlerFunction>; // O(1) method lookup
  segmentCount: number; // cached number of segments

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = null;
    this.isDynamic = false;
    this.pattern = "";
    this.path = "";
    this.methodMap = new Map();
    this.segmentCount = 0;
  }
}

export default class Trie {
  root: TrieNode;
  cachedSegments: Map<string, string[]>;

  constructor() {
    this.root = new TrieNode();
    this.cachedSegments = new Map();
  }

  pushMidl(path: string, ...middlewares: middlewareFunc[]) {
    let node = this.root;
    const segments = path.split("/").filter(Boolean);

    if (path === "/") {
      node.handler = middlewares[0]; // simple, only first middleware
      return;
    }

    for (const segment of segments) {
      let key = segment;
      if (segment.startsWith(":")) key = ":";
      if (!node.children[key]) node.children[key] = new TrieNode();
      node = node.children[key];
    }

    node.handler = middlewares[0]; // store first middleware
  }

  insert(path: string, route: RouteHandlerT): void {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);

    this.cachedSegments.set(path, pathSegments);

    if (path === "/") {
      node.isEndOfWord = true;
      node.handler = route.handler;
      node.path = path;
      node.methodMap.set(route.method, route.handler);
      node.segmentCount = 0;
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

    node.isEndOfWord = true;
    node.path = path;
    node.segmentCount = pathSegments.length;
    node.methodMap.set(route.method, route.handler);
    node.handler = route.handler; // first handler reference
  }

  search(path: string, method: HttpMethod) {
    let node = this.root;
    const pathSegments = this.cachedSegments.get(path) || path.split("/").filter(Boolean);

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
        return null;
      }
    }

    if (!node.isEndOfWord || node.segmentCount !== pathSegments.length) return null;

    const handler = node.methodMap.get(method);
    if (!handler) return null;

    return {
      path: node.path,
      handler,
      pattern: node.pattern,
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

  find(method: string, path: string): NormalizedRoute | null {
    const cacheKey = `${method}:${path}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const result = this.trie.search(path, method as HttpMethod);
    if (result) this.cache.set(cacheKey, result);
    return result;
  }
}

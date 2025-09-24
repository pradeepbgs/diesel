import { NormalizedRoute, Router } from "../router/interface"
import type { handlerFunction, HttpMethod, middlewareFunc, RouteHandlerT, } from "../types"


class TrieNode {

  children: Record<string, TrieNode>
  isEndOfWord: boolean
  handler: handlerFunction[] | middlewareFunc[] | any
  isDynamic: boolean
  pattern: string
  path: string
  method: string[]

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = [];
    this.isDynamic = false;
    this.pattern = '';
    this.path = "";
    this.method = []
  }
}

export default class Trie {
  root: TrieNode
  constructor() {
    this.root = new TrieNode();
  }

  pushMidl(path: string, ...middlewares: middlewareFunc[]) {
    let node = this.root;
    const segments = path.split('/').filter(Boolean);

    if (path === '/') {
      node.handler.push(...middlewares);
      return;
    }

    for (const segment of segments) {
      let key = segment;
      if (segment.startsWith(':')) key = ':';
      if (!node.children[key]) node.children[key] = new TrieNode();
      node = node.children[key];
    }

    node.handler.push(...middlewares);
  }

  insert(path: string, route: RouteHandlerT): void {
    let node = this.root;
    const pathSegments = path.split('/').filter(Boolean); // Split path by segments

    // If it's the root path '/', treat it separately
    if (path === '/') {
      node.isEndOfWord = true;
      node.handler.push(route.handler)
      node.path = path;
      node.method.push(route.method!)
      return;
    }

    for (const segment of pathSegments) {
      let isDynamic = false;
      let key = segment;

      if (segment.startsWith(':')) {
        isDynamic = true;
        key = ':';  // Store dynamic routes under the key ':'
      }

      if (segment === '*') {
        key = '*';
      }

      if (!node.children[key]) {
        node.children[key] = new TrieNode();
      }

      node = node.children[key];
      node.isDynamic = isDynamic;
      node.pattern = segment;
    }

    // Assign route details only after path traversal
    node.isEndOfWord = true;
    node.path = path;
    node.method.push(route.method!);
    node.handler.push(route.handler);

  }



  search(path: string, method: HttpMethod) {
    let node = this.root;
    const pathSegments = path.split('/').filter(Boolean);
  
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
  
      if (node.children[segment]) {
        // exact match
        node = node.children[segment];
      } else if (node.children[':']) {
        // dynamic match :
        node = node.children[':'];
      } else if (node.children['*']) {
        // Wildcard match → stop traversal here
        node = node.children['*'];
        break;
      } else {
        return null;
      }
    }
  
    const routeSegments = node.path.split('/').filter(Boolean);
  
    // skip strict length check if last segment is '*'
    const hasWildcard = routeSegments[routeSegments.length - 1] === '*';
    if (!hasWildcard && pathSegments.length !== routeSegments.length) {
      return null;
    }
  
    // Method check
    const routeMethodIndex = node.method.indexOf(method);
    if (routeMethodIndex !== -1) {
      return {
        path: node.path,
        handler: node.handler[0],
        pattern: node.pattern,
      };
    }
  
    return null;
  }
  


}


// Implementation

export class TrieRouter implements Router {
  private trie = new Trie();
  private cache = new Map()

  add(method: string, path: string, handler: handlerFunction) {
    this.trie.insert(path, { method, handler });
  }

  find(method: string, path: string): NormalizedRoute | null {
    // const cachedRoute = this.cache.get(`${method}:${path}`);

    // if (cachedRoute) {
    //   return cachedRoute;
    // }

    return this.trie.search(path, method as HttpMethod);
    // if (!r) return null;
    // // this.cache.set(`${method}:${path}`, r);
    // return r;
  }
}

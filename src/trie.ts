import type { handlerFunction, HttpMethod, RouteHandlerT, } from "./types"


class TrieNode {

    children: Record<string,TrieNode>
    isEndOfWord:boolean
    handler:handlerFunction[]
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
    root:TrieNode
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(path:string, route:RouteHandlerT) : void {
      let node = this.root;
      const pathSegments = path.split('/').filter(Boolean); // Split path by segments
    
      // If it's the root path '/', treat it separately
      if (path === '/') {
        node.isEndOfWord = true;
        node.handler.push(route.handler)
        node.path = path;
        node.method.push(route.method)
        return;
      }
    
      for (const segment of pathSegments) {
        let isDynamic = false;
        let key = segment;
    
        if (segment.startsWith(':')) {
            isDynamic = true;
            key = ':';  // Store dynamic routes under the key ':'
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
    node.method.push(route.method);
    node.handler.push(route.handler);
    
    }
    
    // insertMidl(midl:handlerFunction): void {
    //   if (!this.root.subMiddlewares.has(midl)) {
    //     this.root.subMiddlewares.set(midl)
    //   }
    // }
    
  
    search(path: string, method: HttpMethod) {
      let node = this.root;
      const pathSegments = path.split('/').filter(Boolean);
      const totalSegments = pathSegments.length;
    
      for (const segment of pathSegments) {
        let key = segment;
    
        // Check for exact match first (static)
        if (!node.children[key]) {
          // Try dynamic match (e.g., ':id')
          if (node.children[':']) {
            node = node.children[':'];
          } else {
            return null; // No match
          }
        } else {
          node = node.children[key];
        }
      }
    
      // Check if the number of segments matches the number of dynamic segments
      const routeSegments = node.path.split('/').filter(Boolean);
      if (totalSegments !== routeSegments.length) {
        return null; 
      }
    
      // Method matching
      const routeMethodIndex = node.method.indexOf(method);
      if (routeMethodIndex !== -1) {
        return {
          path: node.path,
          handler: node.handler[routeMethodIndex],
          pattern: node.pattern,
          // isDynamic: node.isDynamic,
          // method: node.method[routeMethodIndex]
        };
      }
      
      return null
      // return {
      //   path: node.path,
      //   handler: node.handler,
      //   isDynamic: node.isDynamic,
      //   pattern: node.pattern,
      //   method: node.method[routeMethodIndex]
      // };
    }
    
  }
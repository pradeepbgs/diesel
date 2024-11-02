import type { handlerFunction, HttpMethod, RouteT } from "./types"


class TrieNode {

    children: Record<string,TrieNode>
    isEndOfWord:boolean
    handler:handlerFunction[]
    isDynamic: boolean
    pattern: string
    path: string
    method: string[]
    subMiddlewares : Map<string,handlerFunction[]>

    constructor() {
      this.children = {};
      this.isEndOfWord = false;
      this.handler = [];
      this.isDynamic = false;
      this.pattern = '';
      this.path = "";
      this.method = []
      this.subMiddlewares= new Map()
    }
  }
  
  export default class Trie {
    root:TrieNode
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(path: string, route: RouteT): void {
      let node = this.root;
      const pathSegments = path.split('/').filter(Boolean);
    
      // Special handling for root path
      if (path === '/') {
        node.isEndOfWord = true;
        node.handler = [route.handler];
        node.path = path;
        node.method = [route.method];
        return;
      }
    
      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];
        let isDynamic = false;
        let key = segment;
    
        // Handle dynamic segments
        if (segment.startsWith(':')) {
          isDynamic = true;
          key = ':'; // Dynamic segments are stored under ':'
        }
    
        if (!node.children[key]) {
          node.children[key] = new TrieNode();
        }
    
        node = node.children[key];
        node.isDynamic = isDynamic;
        node.pattern = segment;
    
        // Only assign handlers and methods at the last segment
        if (i === pathSegments.length - 1) {
          node.handler = [route.handler];
          node.method = [route.method];
          node.isEndOfWord = true;
          node.path = path; // Store the full path at the endpoint
        }
      }
    }
    
    
    // insertMidl(midl:handlerFunction): void {
    //   if (!this.root.subMiddlewares.has(midl)) {
    //     this.root.subMiddlewares.set(midl)
    //   }
    // }
    
  
    search(path: string, method: HttpMethod) {
      let node = this.root;
      const pathSegments = path.split('/').filter(Boolean);
    
      for (const segment of pathSegments) {
        let key = segment;
    
        // Check for an exact match
        if (!node.children[key]) {
          // Attempt a dynamic match
          if (node.children[':']) {
            node = node.children[':'];
          } else {
            return null; // No match found
          }
        } else {
          node = node.children[key];
        }
      }
    
      // Verify the endpoint and method match
      const routeMethodIndex = node.method.indexOf(method);
      if (node.isEndOfWord && routeMethodIndex !== -1) {
        return {
          path: node.path,
          handler: node.handler[routeMethodIndex],
          isDynamic: node.isDynamic,
          pattern: node.pattern,
          method: node.method[routeMethodIndex]
        };
      }
    
      // No match found
      return null;
    }
    
    
    
  
      // New getAllRoutes method
  
    // getAllRoutes() {
    //   const routes = [];
    //   // Helper function to recursively collect all routes
    //   const traverse = (node, currentPath) => {
    //     if (node.isEndOfWord) {
    //       routes.push({
    //         path: currentPath,
    //         handler: node.handler,
    //         isImportant: node.isImportant,
    //         isDynamic: node.isDynamic,
    //         pattern: node.pattern,
    //       });
    //     }
    //     // Recursively traverse all children
    //     for (const key in node.children) {
    //       const child = node.children[key];
    //       const newPath = currentPath + (key === ':' ? '/:' + child.pattern : '/' + key); // Reconstruct the full path
    //       traverse(child, newPath);
    //     }
    //   };
    //   // Start traversal from the root
    //   traverse(this.root, "");
    //   return routes;
    // }
  }

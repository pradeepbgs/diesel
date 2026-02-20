import { EMPTY_OBJ } from "../main";
import { handlerFunction, middlewareFunc } from "../types";

class TrieNodes {
  children: Record<string, TrieNodes>;
  handlers: Record<string, Function>;
  middlewares: Function[];
  params: Record<string, number>;
  constructor() {
    this.children = {};
    this.handlers = {};
    this.middlewares = [];
    this.params = {}
  }
}

//
export class TrieRouterWithObject {
  root: TrieNodes;
  globalMiddlewares: Function[];
  constructor() {
    this.root = new TrieNodes();
    this.globalMiddlewares = [];
  }

  pushMiddleware(path: string, handlers: middlewareFunc | middlewareFunc[]) {
    if (!Array.isArray(handlers)) handlers = [handlers];
    if (path === "/") {
      this.globalMiddlewares.push(...handlers);
      return;
    }

    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);

    for (const element of pathSegments) {
      let key = element;
      if (element.startsWith(":")) {
        key = ":";
      } else if (element.startsWith("*")) {
        node.middlewares.push(...handlers);
      }

      if (!node.children[key]) node.children[key] = new TrieNodes();

      node = node.children[key];
    }

    node.middlewares.push(...handlers);

    // node.isEndOfWord = true
  }

 insert(method: string, path: string, handler: handlerFunction) {
    let node = this.root;

    const pathSegments = path.split("/").filter(Boolean);

    // handle if path is /
    if (path === "/") {
      node.handlers[method]=handler
      node.params=EMPTY_OBJ
      return;
    }
   let routeparams :Record<string,number>={}
    for (let i=0; i<pathSegments.length; i++) {
      const element = pathSegments[i];
      let key = element;
      let cleanParam = ''
      if (element.startsWith(":")) {
        key = ":";
        cleanParam = element.slice(1)
      }
      

      if (!node.children[key]) node.children[key] = new TrieNodes();

      node = node.children[key];
      if(cleanParam) {
        routeparams[cleanParam]=i
      }
    }
    node.params=routeparams
    node.handlers[method]=handler;
 }
  
  add(method: string, path: string, handler:handlerFunction) {
    return this.insert(method,path,handler)
  }

  search(method: string, path: string) {
    let node = this.root;

    const pathSegments = path.split("/")

    let collected = this.globalMiddlewares.slice();
    for (let i = 0; i < pathSegments.length; i++) {
      const element = pathSegments[i];
      if (element.length === 0) {
        continue;
      }

      if (node.children[element]) {
        node = node.children[element]!;
      } else if (node.children[":"]) {
        node = node.children[":"];
      } else if (node.children["*"]) {
        node = node.children["*"];
        break;
      } else {
        return { params: node.params, handler: collected };
      }

      if (node.middlewares.length > 0) {
        const mw = node.middlewares;
        for (let j = 0; j < mw.length; j++) {
          collected.push(mw[j]);
        }
      }
    }
    const methodHandler = node.handlers[method]
    if (methodHandler) collected.push(methodHandler);
    return {
      params: node.params,
      handler: collected,
    };
  }
  
  find(method: string, path: string) {
    return this.search(method,path)
  }

}
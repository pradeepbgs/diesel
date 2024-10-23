import Diesel from "./main";
import type { handlerFunction, HttpMethod } from "./types";

class Router extends Diesel {
  constructor() {
    super();
  }
  
  // #addRoute(method:HttpMethod, path:string, handlers:handlerFunction[]) {
  //     if (!this.trie.root.subMiddlewares.has(path)) {
  //         this.trie.root.subMiddlewares.set(path,[])
  //       }  
  //       const middlewareHandlers : handlerFunction[]= handlers.slice(0, -1);

  //       const currentMiddlewares = this.trie.root.subMiddlewares.get(path)
        
  //       middlewareHandlers.forEach((midl:handlerFunction) => {
  //         if (!currentMiddlewares?.includes(midl)) {
  //           currentMiddlewares?.push(midl)
  //         }
  //       })

  //   // if (!this.trie.root.subMiddlewares.get(path).includes(...middlewareHandlers)) {
  //   //     this.trie.root.subMiddlewares.get(path).push(...middlewareHandlers)
  //   // }

  //   const handler : handlerFunction = handlers[handlers.length - 1];
  //   this.trie.insert(path, { handler, method });
  // }
  get(path:string, ...handlers:handlerFunction[]) {
    this.addRoute("GET", path, handlers);
    return this
  }

  post(path:string, ...handlers:handlerFunction[]) {
    this.addRoute("POST", path, handlers);
    return this;
  }

  put(path:string, ...handlers:handlerFunction[]) {
    this.addRoute("PUT", path, handlers);
    return this
  }

  patch(path:string, ...handlers:handlerFunction[]) {
      this.addRoute("PATCH", path, handlers);
      return this
  }

  delete(path:string, ...handlers:handlerFunction[]) {
    this.addRoute("DELETE", path, handlers);
    return this;
  }
}

export default Router;

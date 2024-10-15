import diesel from "./main";

class Router extends diesel {
  constructor() {
    super();
  }
  #addRoute(method, path, handlers) {
      if (!this.trie.root.subMiddlewares.has(path)) {
          this.trie.root.subMiddlewares.set(path,[])
        }  
        const middlewareHandlers = handlers.slice(0, -1);

    if (!this.trie.root.subMiddlewares.get(path).includes(...middlewareHandlers)) {
        this.trie.root.subMiddlewares.get(path).push(...middlewareHandlers)
    }

    const handler = handlers[handlers.length - 1];
    this.trie.insert(path, { handler, method });
  }
  get(path, ...handlers) {
    return this.#addRoute("GET", path, handlers);
  }

  post(path, ...handlers) {
    return this.#addRoute("POST", path, handlers);
  }

  put(path, ...handlers) {
    return this.#addRoute("PUT", path, handlers);
  }

  patch(path, ...handlers) {
    if (handlers.length > 0) {
      return this.#addRoute("PATCH", path, handlers);
    }
  }

  delete(path, ...handlers) {
    return this.#addRoute("DELETE", path, handlers);
  }
}

export default Router;

import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";

class diesel {
  constructor() {
    this.routes = new Map();
    this.globalMiddlewares = [];
    this.middlewares = new Map();
    this.trie = new Trie();
    this.hasMiddleware = false;
    this.hasOnReqHook=false;
    this.hasPreHandlerHook=false;
    this.hasPostHandlerHook=false;
    this.hasOnSendHook=false;
    this.hooks = {
      onRequest: [],
      preHandler: [],
      postHandler: [],
      onSend: [],
      onError: [],
      onClose: []
    }
  }

  addHooks(typeOfHook,fnc){
    if (this.hooks[typeOfHook]) {
      this.hooks[typeOfHook].push(fnc)
    }else{
      throw new Error(`Unknown hook type: ${type}`);
    }
  }

  compile() {
    if (this.globalMiddlewares.length > 0) {
      this.hasMiddleware = true;
    }
    for (const [path, middlewares] of this.middlewares.entries()) {
      if (middlewares.length > 0) {
        this.hasMiddleware = true;
        break;
      }
    } 

    // check if hook is present or not

    if (this.hooks.onRequest.length>0) this.hasOnReqHook=true;
    if(this.hooks.preHandler.length>0) this.hasPreHandlerHook=true;
    if(this.hooks.postHandler.length>0) this.hasPostHandlerHook=true;
    if(this.hooks.onSend.length>0) this.hasOnSendHook=true;
    
  }

  listen(port, { sslCert = null, sslKey = null } = {}, callback) {
    this.compile();
    const options = {
      port,
      fetch: async (req) => {
        const url = new URL(req.url);
        try {
          return await handleRequest(req, url, this);
        } catch (error) {
          return new Response("Internal Server Error", { status: 500 });
        }
      },
      onClose() {
        console.log("Server is shutting down...");
      },
    };

    if (sslCert && sslKey) {
      options.certFile = sslCert;
      options.keyFile = sslKey;
    } 
    const server = Bun.serve(options);

    if (typeof callback === "function") {
      return callback();
    }
    
    if (sslCert && sslKey) {
        console.log(`HTTPS server is running on https://localhost:${port}`);
    } else {
        console.log(`HTTP server is running on http://localhost:${port}`);
    }

    return server;
  }

  register(pathPrefix, handlerInstance) {
    const routeEntries = Object.entries(handlerInstance.trie.root.children);
    // console.log(handlerInstance.trie.root);
    handlerInstance.trie.root.subMiddlewares.forEach((middleware, path) => {
      if (!this.middlewares.has(pathPrefix + path)) {
        this.middlewares.set(pathPrefix + path, []);
      }
      if (!this.middlewares.get(pathPrefix + path).includes(...middleware)) {
        this.middlewares.get(pathPrefix + path).push(...middleware);
      }
    });
    for (const [routeKey, routeNode] of routeEntries) {
      const fullpath = pathPrefix + routeNode?.path;
      const routeHandler = routeNode.handler[0];
      const httpMethod = routeNode.method[0];
      this.trie.insert(fullpath, { handler: routeHandler, method: httpMethod });
    }
    handlerInstance.trie = new Trie();
  }

  #addRoute(method, path, handlers) {
    const middlewareHandlers = handlers.slice(0, -1);

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
    if (path === "/") {
      middlewareHandlers.forEach((midlleware) => {
        if (!this.globalMiddlewares.includes(midlleware)) {
          this.globalMiddlewares.push(midlleware);
        }
      });
    } else {
      if (!this.middlewares.get(path).includes(...middlewareHandlers)) {
        this.middlewares.get(path).push(...middlewareHandlers);
      }
    }

    const handler = handlers[handlers.length - 1];
    this.trie.insert(path, { handler, method });
  }

  use(pathORHandler, handler) {
    if (typeof pathORHandler === "function") {
      if (!this.globalMiddlewares.includes(pathORHandler)) {
        return this.globalMiddlewares.push(pathORHandler);
      }
    }
    // now it means it is path midl
    const path = pathORHandler;
    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }

    if (!this.middlewares.get(path).includes(handler)) {
      this.middlewares.get(path).push(handler);
    }
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

export default diesel;

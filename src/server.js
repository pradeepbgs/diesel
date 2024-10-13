import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";

class Diesel {
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
      onRequest: null,
      preHandler: null,
      postHandler: null,
      onSend: null,
      onError: null,
      onClose: null
    }
  }

  addHooks(typeOfHook,fnc){
    if (this.hooks.hasOwnProperty(typeOfHook)) {
      this.hooks[typeOfHook] = fnc;  // Overwrite or set the hook
    } else {
      throw new Error(`Unknown hook type: ${typeOfHook}`);  // Throw an error for invalid hook types
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
    if (this.hooks.onRequest) this.hasOnReqHook=true;
    if(this.hooks.preHandler) this.hasPreHandlerHook=true;
    if(this.hooks.postHandler) this.hasPostHandlerHook=true;
    if(this.hooks.onSend) this.hasOnSendHook=true;
    
  }

  listen(port, { sslCert = null, sslKey = null } = {}, callback) {
    if (typeof Bun === 'undefined')
      throw new Error(
          '.listen() is designed to run on Bun only...'
      )
      
    if (typeof port !== "number") {
      throw new Error('Port must be a numeric value')
    }

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

    Bun?.gc(false)

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
    if(typeof path !== "string"){
      throw new Error("Path must be a string type");
    }
    if(typeof method !== "string"){
      throw new Error("method must be a string type");
    }
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
     this.#addRoute("GET", path, handlers);
     return this
  }

  post(path, ...handlers) {
    this.#addRoute("POST", path, handlers);
    return this
  }

  put(path, ...handlers) {
    this.#addRoute("PUT", path, handlers);
    return this
  }

  patch(path, ...handlers) {
    if(typeof path !== "string"){
      throw new Error("Path must be a string type");
    }
    this.#addRoute("PATCH", path, handlers);
    return this
  }

  delete(path, ...handlers) {
     this.#addRoute("DELETE", path, handlers);
     return this;
  }
}

export default Diesel

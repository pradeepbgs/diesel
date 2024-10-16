import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";
import { 
  HookType, 
  type handlerFunction, 
  type Hooks, 
  type HttpMethod, 
  type listenCalllBackType, 
  type RouteNodeType 
} from "./types.js";

class Diesel {
  routes : Map<String,any>;
  globalMiddlewares : handlerFunction[] 
  middlewares: Map<string,handlerFunction[]>;
  trie :Trie
  hasOnReqHook: boolean;
  hasMiddleware: boolean;
  hasPreHandlerHook: boolean;
  hasPostHandlerHook: boolean;
  hasOnSendHook: boolean;
  hooks : Hooks

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

  addHooks(typeOfHook:HookType,fnc:handlerFunction) :void {
    if(typeof typeOfHook !== 'string'){
      throw new Error("hookName must be a string")
    }
    if(typeof fnc !== 'function'){
      throw new Error("callback must be a instance of function")
    }
    if (this.hooks.hasOwnProperty(typeOfHook)) {
      this.hooks[typeOfHook] = fnc;  // Overwrite or set the hook
    } else {
      throw new Error(`Unknown hook type: ${typeOfHook}`);  // Throw an error for invalid hook types
    }
  }

  compile():void {
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

  listen(port:number, callback?:listenCalllBackType,{ sslCert = null, sslKey = null }:any = {}) {
    if (typeof Bun === 'undefined')
      throw new Error(
          '.listen() is designed to run on Bun only...'
      )
      
    if (typeof port !== "number") {
      throw new Error('Port must be a numeric value')
    }

    this.compile();
    const dieselInstance = this as Diesel
    const options:any = {
      port,
      fetch: async (req:Request) => {
        const url = new URL(req.url);
        try {
          return await handleRequest(req, url,this);
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

    // Bun?.gc(false)

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

  register(pathPrefix:string, handlerInstance:any) {
    if (typeof pathPrefix !== 'string') {
      throw new Error("path must be a string")
    }
   if(typeof handlerInstance !== 'object'){
    throw new Error("handler parameter should be a instance of router object",handlerInstance)
   }
    const routeEntries:[string,RouteNodeType][] = Object.entries(handlerInstance.trie.root.children) as [string,RouteNodeType][];

    handlerInstance.trie.root.subMiddlewares.forEach((middleware:handlerFunction[], path:string) => {
      if (!this.middlewares.has(pathPrefix + path)) {
        this.middlewares.set(pathPrefix + path, []);
      }

      middleware?.forEach((midl:handlerFunction)=>{
        if(!this.middlewares.get(pathPrefix+path)?.includes(midl)){
          this.middlewares.get(pathPrefix+path)?.push(midl)
        }
      })

    });
    for (const [routeKey, routeNode] of routeEntries) {
      const fullpath = pathPrefix + routeNode?.path;
      const routeHandler = routeNode.handler[0];
      const httpMethod = routeNode.method[0];
      this.trie.insert(fullpath, { handler: routeHandler as handlerFunction, method: httpMethod });
    }
    handlerInstance.trie = new Trie();
  }

  #addRoute(method:HttpMethod, path:string, handlers:handlerFunction[]) {
    if(typeof path !== "string"){
      throw new Error("Path must be a string type");
    }
    if(typeof method !== "string"){
      throw new Error("method must be a string type");
    }
    const middlewareHandlers:handlerFunction[] = handlers.slice(0, -1);
    const handler = handlers[handlers.length - 1];
    
    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
      middlewareHandlers.forEach((middleware:handlerFunction) => {
        if (path ==='/') {
          if (!this.globalMiddlewares.includes(middleware)) {
            this.globalMiddlewares.push(middleware);
          }
        } else {
          if(!this.middlewares.get(path)?.includes(middleware)){
            this.middlewares.get(path)?.push(middleware)
          }
        }
      });

    this.trie.insert(path, { handler, method });
  }

  use(pathORHandler:string | handlerFunction, handler:handlerFunction) {
    if (typeof pathORHandler === "function") {
      if (!this.globalMiddlewares.includes(pathORHandler)) {
        return this.globalMiddlewares.push(pathORHandler);
      }
    }
    // now it means it is path midl
    const path: string = pathORHandler as string;

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }

    if (!this.middlewares.get(path)?.includes(handler)) {
      this.middlewares.get(path)?.push(handler);
    }
  }

  get(path:string, ...handlers:handlerFunction[]) {
     this.#addRoute("GET", path, handlers);
     return this
  }

  post(path:string, ...handlers:handlerFunction[]) {
    this.#addRoute("POST", path, handlers);
    return this
  }

  put(path:string, ...handlers:handlerFunction[]) {
    this.#addRoute("PUT", path, handlers);
    return this
  }

  patch(path:string, ...handlers:handlerFunction[]) {
    this.#addRoute("PATCH", path, handlers);
    return this
  }

  delete(path:any, ...handlers:handlerFunction[]) {
     this.#addRoute("DELETE", path, handlers);
     return this;
  }
}

export default Diesel

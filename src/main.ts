import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";
import rateLimit from "./utils.js";
import {
  corsT,
  FilterMethods,
  HookFunction,
  HookType,
  middlewareFunc,
  type handlerFunction,
  type Hooks,
  type HttpMethod,
  type listenCalllBackType,
  type RouteNodeType
} from "./types.js";
import { Server } from "bun";


export default class Diesel {
  routes : string[] | undefined
  globalMiddlewares: middlewareFunc[]
  middlewares: Map<string, middlewareFunc[]>;
  trie: Trie
  hasOnReqHook: boolean;
  hasMiddleware: boolean;
  hasPreHandlerHook: boolean;
  hasPostHandlerHook: boolean;
  hasOnSendHook: boolean;
  hooks: Hooks
  corsConfig: corsT
  filters: string[]
  filterFunction : middlewareFunc | null

  constructor() {
    this.routes = []
    this.filters = []
    this.filterFunction = null
    this.globalMiddlewares = [];
    this.middlewares = new Map();
    this.trie = new Trie();
    this.corsConfig = null;
    this.hasMiddleware = false;
    this.hasOnReqHook = false;
    this.hasPreHandlerHook = false;
    this.hasPostHandlerHook = false;
    this.hasOnSendHook = false;
    this.hooks = {
      onRequest: null,
      preHandler: null,
      postHandler: null,
      onSend: null,
      onError: null,
      onClose: null
    }
  }

  
  filter() :FilterMethods {

    return {
      routeMatcher: (...routes:string[]) => {
        this.routes = routes.sort()
        return this.filter();
      },

      permitAll: () => {
        for(const route of this?.routes!){
          this.filters.push(route)
        }
        // this.routes = []
        return this.filter()
      },

      require: (fnc?:middlewareFunc) => {
        if(!fnc || typeof fnc !== 'function' ){
          return new Response(JSON.stringify({
            message:"Authentication required"
          }),{status:400})
        }
        this.filterFunction = fnc
      }
    };
  }

  cors(corsConfig: corsT) {
    this.corsConfig = corsConfig
  }

  addHooks(
    typeOfHook: HookType, 
    fnc: HookFunction
  ): void {
    if (typeof typeOfHook !== 'string') {
      throw new Error("hookName must be a string")
    }
    if (typeof fnc !== 'function') {
      throw new Error("callback must be a instance of function")
    }
    if (this.hooks.hasOwnProperty(typeOfHook)) {
      this.hooks[typeOfHook] = fnc;  // Overwrite or set the hook
    } else {
      throw new Error(`Unknown hook type: ${typeOfHook}`);  // Throw an error for invalid hook types
    }
  }

  compile(): void {
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
    if (this.hooks.onRequest) this.hasOnReqHook = true;
    if (this.hooks.preHandler) this.hasPreHandlerHook = true;
    if (this.hooks.postHandler) this.hasPostHandlerHook = true;
    if (this.hooks.onSend) this.hasOnSendHook = true;

  }

  listen(
    port: number, 
    callback?: listenCalllBackType, 
    { sslCert = null, sslKey = null }: any = {}
  ) : Server | void {

    if (typeof Bun === 'undefined')
      throw new Error(
        '.listen() is designed to run on Bun only...'
      )

    if (typeof port !== "number") {
      throw new Error('Port must be a numeric value')
    }

    this.compile();
    const dieselInstance = this as Diesel
    const options: any = {
      port,
      fetch: async (req: Request, server: Server) => {
        const url = new URL(req.url);
        try {
          return await handleRequest(req, server, url, this);
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

  register(
    pathPrefix: string, 
    handlerInstance: any
  ) : void {
    if (typeof pathPrefix !== 'string') {
      throw new Error("path must be a string")
    }
    if (typeof handlerInstance !== 'object') {
      throw new Error("handler parameter should be a instance of router object", handlerInstance)
    }
    const routeEntries: [string, RouteNodeType][] = Object.entries(handlerInstance.trie.root.children) as [string, RouteNodeType][];

    handlerInstance.trie.root.subMiddlewares.forEach((middleware: middlewareFunc[], path: string) => {
      if (!this.middlewares.has(pathPrefix + path)) {
        this.middlewares.set(pathPrefix + path, []);
      }

      middleware?.forEach((midl: middlewareFunc) => {
        if (!this.middlewares.get(pathPrefix + path)?.includes(midl)) {
          this.middlewares.get(pathPrefix + path)?.push(midl)
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

  #addRoute(
    method: HttpMethod, 
    path: string, 
    handlers: handlerFunction[]
  ) : void {

    if (typeof path !== "string") {
      throw new Error("Path must be a string type");
    }
    if (typeof method !== "string") {
      throw new Error("method must be a string type");
    }
    const middlewareHandlers = handlers.slice(0, -1) as middlewareFunc[]
    const handler = handlers[handlers.length - 1];

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
    middlewareHandlers.forEach((middleware: middlewareFunc) => {
      if (path === '/') {
        if (!this.globalMiddlewares.includes(middleware)) {
          this.globalMiddlewares.push(middleware);
        }
      } else {
        if (!this.middlewares.get(path)?.includes(middleware)) {
          this.middlewares.get(path)?.push(middleware)
        }
      }
    });

    this.trie.insert(path, { handler, method });
  }

  use(
    pathORHandler?: string | middlewareFunc, 
    handler?: middlewareFunc
  ) : void {

    if (typeof pathORHandler === "function") {
      if (!this.globalMiddlewares.includes(pathORHandler)) {
        this.globalMiddlewares.push(pathORHandler);
      }
      return
    }
    // now it means it is path midl
    const path: string = pathORHandler as string;

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }

    if (handler) {
      if (!this.middlewares.get(path)?.includes(handler)) {
        this.middlewares.get(path)?.push(handler);
      }
    }
  }

  get(
    path: string, 
    ...handlers: handlerFunction[]
  ) : this {
    this.#addRoute("GET", path, handlers);
    return this
  }

  post(
    path: string, 
    ...handlers: handlerFunction[]
  ): this {
    this.#addRoute("POST", path, handlers);
    return this
  }

  put(path: string, ...handlers: handlerFunction[]) : this{
    this.#addRoute("PUT", path, handlers);
    return this
  }

  patch(
    path: string, 
    ...handlers: handlerFunction[]
  ) : this {
    this.#addRoute("PATCH", path, handlers);
    return this
  }

  delete(
    path: any, 
    ...handlers: handlerFunction[]
  ) : this {
    this.#addRoute("DELETE", path, handlers);
    return this;
  }
}


export {
  rateLimit,
}

import Trie from "./trie.js";
import handleRequest from "./handleRequest.js";
import {
  corsT,
  DieselT,
  FilterMethods,
  HookFunction,
  HookType,
  middlewareFunc,
  onError,
  onRequest,
  type handlerFunction,
  type Hooks,
  type HttpMethod,
  type listenCalllBackType,
  type RouteNodeType
} from "./types.js";
import { Server } from "bun";


export default class Diesel {
  // tempRoutes is just used for so we can implement route method. 
  // although we have router class and register method for subrouting still i wanna add a route method
  // in future we can also remove it, well see
  tempRoutes:Map<string,any>
  globalMiddlewares: middlewareFunc[]
  middlewares: Map<string, middlewareFunc[]>;
  trie: Trie
  hasOnReqHook: boolean;
  hasMiddleware: boolean;
  hasPreHandlerHook: boolean;
  hasPostHandlerHook: boolean;
  hasOnSendHook: boolean;
  hasOnError: boolean;
  hooks: Hooks
  corsConfig: corsT
  FilterRoutes: string[] | null | undefined
  filters: Set<string>
  filterFunction: middlewareFunc | null
  hasFilterEnabled: boolean

  constructor() {
    this.tempRoutes = new Map
    this.globalMiddlewares = [];
    this.middlewares = new Map();
    this.trie = new Trie();
    this.corsConfig = null;
    this.hasMiddleware = false;
    this.hasOnReqHook = false;
    this.hasPreHandlerHook = false;
    this.hasPostHandlerHook = false;
    this.hasOnSendHook = false;
    this.hasOnError = false;
    this.hooks = {
      onRequest: null,
      preHandler: null,
      postHandler: null,
      onSend: null,
      onError: null,
      onClose: null
    }
    this.FilterRoutes = []
    this.filters = new Set<string>
    this.filterFunction = null
    this.hasFilterEnabled = false
  }


  filter(): FilterMethods {
    this.hasFilterEnabled = true

    return {
      routeMatcher: (...routes: string[]) => {
        this.FilterRoutes = routes
        return this.filter();
      },

      permitAll: () => {
        for (const route of this?.FilterRoutes!) {
          this.filters.add(route)
        }
        this.FilterRoutes = null
        return this.filter()
      },

      require: (fnc?: middlewareFunc) => {
        if (fnc) {
          this.filterFunction = fnc
        }
      }
    };
  }

  cors(corsConfig: corsT) {
    this.corsConfig = corsConfig
  }

  addHooks(
    typeOfHook: HookType,
    fnc: HookFunction | onError | onRequest
  ): void {
    if (typeof typeOfHook !== 'string') {
      throw new Error("hookName must be a string")
    }
    if (typeof fnc !== 'function') {
      throw new Error("callback must be a instance of function")
    }

    switch (typeOfHook) {
      case 'onRequest':
        this.hooks.onRequest = fnc as onRequest;
        this.hasOnReqHook = true;
        break;
      case 'preHandler':
        this.hooks.preHandler = fnc as HookFunction;
        this.hasPreHandlerHook = true;
        break;
      case 'postHandler':
        this.hooks.postHandler = fnc as HookFunction;
        this.hasPostHandlerHook = true;
        break;
      case 'onSend':
        this.hooks.onSend = fnc as HookFunction;
        this.hasOnSendHook = true;
        break;
      case 'onError':
        this.hooks.onError = fnc as onError;
        this.hasOnError = true;
        break;
      case 'onClose':
        this.hooks.onClose = fnc as HookFunction;
        break;
      default:
        throw new Error(`Unknown hook type: ${typeOfHook}`);
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
    if (this.hooks.onError) this.hasOnError = true;
    this.tempRoutes = new Map()
  }

  listen(
    port: number,
    callback?: listenCalllBackType,
    { sslCert = null, sslKey = null }: any = {}
  ): Server | void {

    if (typeof Bun === 'undefined')
      throw new Error(
        '.listen() is designed to run on Bun only...'
      )

    if (typeof port !== "number") {
      throw new Error('Port must be a numeric value')
    }

    this.compile();

    const options: any = {
      port,
      fetch: async (req: Request, server: Server) => {
        const url: URL = new URL(req.url);
        try {
          return await handleRequest(req, server, url, this as DieselT);
        } catch (error: any) {
          if (this.hasOnError && this.hooks.onError) {
            const onErrResponse = await this.hooks.onError(
              error,
              req,
              url,
              server
            );

            if (onErrResponse) return onErrResponse;
          }
          return new Response(JSON.stringify({
            message: "Internal Server Error",
            error: error.message
          }), { status: 500 });
        }
      },
    };

    if (sslCert && sslKey) {
      options.certFile = sslCert;
      options.keyFile = sslKey;
    }
    const server = Bun?.serve(options);

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

  route(basePath:string,routerInstance:any): void {
    if (!basePath || typeof basePath !== 'string') throw new Error("Path must be a string");

    const routes = Object.fromEntries(routerInstance.tempRoutes)
    const routesArray = Object.entries(routes)
    for(let i =0; i<routesArray.length;i++){
      const [path,args] = routesArray[i] as [string,any]
      const fullpath = basePath+path

      if (!this.middlewares.has(fullpath)) {
        this.middlewares.set(fullpath, []);
      }
      const middlewareHandlers = args.handlers.slice(0, -1) as middlewareFunc[]
      middlewareHandlers.forEach((middleware: middlewareFunc) => {
          if (!this.middlewares.get(fullpath)?.includes(middleware)) {
            this.middlewares.get(fullpath)?.push(middleware)
          }
      });
      
      const handlers = args.handlers[args.handlers.length-1]
      const method = args.method
      try {
        this.trie.insert(fullpath, { handler: handlers as handlerFunction, method: method })
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);      
      }
    }
    routerInstance = null
  }

  register(
    pathPrefix: string,
    handlerInstance: any
  ): void {

    if (typeof pathPrefix !== 'string') throw new Error("Path prefix must be a string");
    if (typeof handlerInstance !== 'object') throw new Error("Handler must be an object");

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
      try {
        this.trie.insert(fullpath, { handler: routeHandler as handlerFunction, method: httpMethod });
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);      
      }
    }
    handlerInstance = null
  }

  addRoute(
    method: HttpMethod,
    path: string,
    handlers: handlerFunction[]
  ): void {

    if (typeof path !== 'string') throw new Error("Path must be a string");
    if (typeof method !== 'string') throw new Error("Method must be a string");

    this.tempRoutes.set(path,{method,handlers})
    const middlewareHandlers = handlers.slice(0, -1) as middlewareFunc[]
    const handler = handlers[handlers.length - 1];

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
    middlewareHandlers.forEach((middleware: middlewareFunc) => {
      if (path === '/') {
        this.globalMiddlewares = [...new Set([...this.globalMiddlewares, ...middlewareHandlers])];
      } else {
        if (!this.middlewares.get(path)?.includes(middleware)) {
          this.middlewares.get(path)?.push(middleware)
        }
      }
    });

    try {
      this.trie.insert(path, { handler, method });
    } catch (error) {
      console.error(`Error inserting ${path}:`, error);
    }
  }

  use(
    pathORHandler?: string | middlewareFunc,
    handler?: middlewareFunc
  ): void {

    if (typeof pathORHandler === "function") {
      if (!this.globalMiddlewares.includes(pathORHandler)) {
        this.globalMiddlewares.push(pathORHandler);
      }
      return
    }

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
  ): this {
    this.addRoute("GET", path, handlers);
    return this
  }

  post(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("POST", path, handlers);
    return this
  }

  put(path: string, ...handlers: handlerFunction[]): this {
    this.addRoute("PUT", path, handlers);
    return this
  }

  patch(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("PATCH", path, handlers);
    return this
  }

  delete(
    path: any,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("DELETE", path, handlers);
    return this;
  }
}

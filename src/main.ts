import Trie from "./trie.js";
import handleRequest, { executeBunMiddlewares} from "./handleRequest.js";
import path from 'path'
import fs from 'fs'

import {
  corsT,
  DieselT,
  FilterMethods,
  HookFunction,
  HookType,
  listenArgsT,
  middlewareFunc,
  onError,
  onRequest,
  type handlerFunction,
  type Hooks,
  type HttpMethod,
} from "./types.js";
import { BunRequest, Server } from "bun";
import { advancedLogger, logger } from "./middlewares/logger/logger.js";
import { authenticateJwtDbMiddleware, authenticateJwtMiddleware } from "./utils/jwt.js";

export default class Diesel {

  routes: Record<string, Function>
  private tempRoutes: Map<string, any> | null;
  globalMiddlewares: middlewareFunc[];
  middlewares: Map<string, middlewareFunc[]>;
  trie: Trie;
  hasOnReqHook: boolean;
  hasMiddleware: boolean;
  hasPreHandlerHook: boolean;
  hasPostHandlerHook: boolean;
  hasOnSendHook: boolean;
  hasOnError: boolean;
  hooks: Hooks;
  corsConfig: corsT;
  FilterRoutes: string[] | null | undefined;
  filters: Set<string>;
  filterFunction: middlewareFunc[];
  hasFilterEnabled: boolean;
  private serverInstance: Server | null;
  staticPath: any;
  staticFiles: any
  user_jwt_secret: string
  private baseApiUrl: string
  private enableFileRouter: boolean
  idleTimeOut: number

  constructor(
    {
      jwtSecret,
      baseApiUrl,
      enableFileRouting,
      idleTimeOut,
    }
      : {
        jwtSecret?: string,
        baseApiUrl?: string,
        enableFileRouting?: boolean,
        idleTimeOut?: number
      } = {}
  ) {

    this.routes = {}
    this.idleTimeOut = idleTimeOut ?? 10
    this.enableFileRouter = enableFileRouting ?? false
    this.baseApiUrl = baseApiUrl || ''
    this.user_jwt_secret = jwtSecret || process.env.DIESEL_JWT_SECRET || 'feault_diesel_secret_for_jwt'
    this.tempRoutes = new Map();
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
      onRequest: [],
      preHandler: [],
      postHandler: [],
      onSend: [],
      onError: [],
      onClose: [],
      routeNotFound: [],
    };
    this.FilterRoutes = [];
    this.filters = new Set<string>();
    this.filterFunction = [];
    this.hasFilterEnabled = false;
    this.serverInstance = null;
    this.staticPath = null;
    this.staticFiles = {};

  }

  setupFilter(): FilterMethods {
    this.hasFilterEnabled = true;

    return {
      routeMatcher: (
        ...routes: string[]
      ) => {
        this.FilterRoutes = routes;
        return this.setupFilter();
      },

      permitAll: () => {
        for (const route of this?.FilterRoutes!) {
          this.filters.add(route);
        }
        this.FilterRoutes = null;
        return this.setupFilter();
      },

      authenticate: (
        fnc?: middlewareFunc[]
      ) => {
        if (fnc?.length) {
          for (const fn of fnc) {
            this.filterFunction.push(fn);
          }
        }
      },
      authenticateJwt: (jwt: any) => {
        this.filterFunction
          .push(
            authenticateJwtMiddleware(jwt, this.user_jwt_secret) as middlewareFunc
          );
      },
      authenticateJwtDB: (jwt: any, User: any) => {
        this.filterFunction
          .push(
            authenticateJwtDbMiddleware(jwt, User, this.user_jwt_secret) as middlewareFunc
          );
      }
    };
  }

  redirect(
    incomingPath: string,
    redirectPath: string,
    statusCode?: 302
  ): this {
    this.any(incomingPath, (ctx) => {

      const params = ctx.params
      let finalPathToRedirect = redirectPath

      if (params) {
        for (const key in params) {
          finalPathToRedirect = finalPathToRedirect.replace(`:${key}`, params[key])
        }
      }
      // const query = ctx?.query
      // if(query){
      //   finalPathToRedirect = finalPathToRedirect+"?"
      //   for (const key in query){
      //     finalPathToRedirect = `${finalPathToRedirect}${key}=${query[key]}&`
      //   }
      // }

      const queryParams = ctx.url.search;
      if (queryParams)
        finalPathToRedirect += queryParams;

      return ctx.redirect(finalPathToRedirect, statusCode)
    })
    return this
  }

  serveStatic(
    filePath: string
  ) {
    this.staticPath = filePath;
    return this;
  }


  static(
    args: Record<string, string>
  ): this {
    this.staticFiles = { ...this.staticFiles, ...args };
    return this;
  }

  addHooks(
    typeOfHook: HookType,
    fnc: HookFunction | onError | onRequest
  ): this {

    if (typeof typeOfHook !== "string") {
      throw new Error("hookName must be a string");
    }

    if (typeof fnc !== "function") {
      throw new Error("callback must be a instance of function");
    }

    switch (typeOfHook) {
      case "onRequest":
        this.hooks.onRequest?.push(fnc as onRequest)
        break;
      case "preHandler":
        this.hooks.preHandler?.push(fnc as HookFunction)
        break;
      case "postHandler":
        this.hooks.postHandler?.push(fnc as HookFunction)
        break;
      case "onSend":
        this.hooks.onSend?.push(fnc as HookFunction)
        break;
      case "onError":
        this.hooks.onError?.push(fnc as onError)
        break;
      case "onClose":
        this.hooks.onClose?.push(fnc as HookFunction)
        break;
      case "routeNotFound":
        this.hooks.routeNotFound?.push(fnc as HookFunction)
        break;
      default:
        throw new Error(`Unknown hook type: ${typeOfHook}`);
    }
    return this;
  }

  private compile(): void {

    if (this.globalMiddlewares.length > 0) {
      this.hasMiddleware = true;
    }

    for (const [_, middlewares] of this.middlewares.entries()) {
      if (middlewares.length > 0) {
        this.hasMiddleware = true;
        break;
      }
    }

    if (this.enableFileRouter) {
      const projectRoot = process.cwd();
      const routesPath = path.join(projectRoot, 'src', 'routes');
      if (fs?.existsSync(routesPath)) {
        this.loadRoutes(routesPath, '');
      }
    }

    setTimeout(() => {
      this.tempRoutes = null
    }, 2000);

  }

  private async registerFileRoutes(
    filePath: string,
    baseRoute: string,
    extension: string
  ) {

    const module = await import(filePath);

    let pathRoute;
    if (extension === '.ts') {
      pathRoute = path.basename(filePath, '.ts');
    }
    else if (extension === '.js') {
      pathRoute = path.basename(filePath, '.js');
    }

    let routePath = baseRoute + '/' + pathRoute;

    if (routePath.endsWith('/index')) {
      routePath = baseRoute
    }
    else if (routePath.endsWith('/api')) {
      routePath = baseRoute
    }
    // here we can check if routePath include [] like - user/[id] if yes then remove [] and add user:id
    routePath = routePath.replace(/\[(.*?)\]/g, ':$1');

    const supportedMethods: HttpMethod[] = [
      'GET', 'POST', 'PUT', 'PATCH',
      'DELETE', 'ANY', 'HEAD', 'OPTIONS', 'PROPFIND'
    ];

    for (const method of supportedMethods) {
      if (module[method]) {
        const lowerMethod = method.toLowerCase() as HttpMethod;
        const handler = module[method] as handlerFunction;
        this[lowerMethod](`${this.baseApiUrl}${routePath}`, handler)
      }
    }
  }


  private async loadRoutes(
    dirPath: string,
    baseRoute: string
  ) {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        this.loadRoutes(filePath, baseRoute + '/' + file);
      }
      else if (file.endsWith('.ts')) {
        this.registerFileRoutes(filePath, baseRoute, '.ts');
      }
      else if (file.endsWith('.js')) {
        this.registerFileRoutes(filePath, baseRoute, '.js');
      }
    }
  }

  useLogger(app: any) {
    logger(app)
    return this
  }

  useAdvancedLogger(app: any) {
    advancedLogger(app)
    return this
  }


  BunRoute(method: string, path: string, ...handlers: any[]) {
    if (!path || typeof path !== 'string') throw new Error("give a path in string format")

    if (handlers.length === 1) 
    {
      const singleHandler = handlers[0];
      this.routes[path] = async (req: BunRequest, server: Server) => {
      
        // if (this.hasFilterEnabled) {
        //   const url = new URL(req.url)
        //   const _path = req.routePattern ?? url.pathname;
        //   const filterResponse = await handleBunFilterRequest(this as DieselT,_path,req,server);
        //   if (filterResponse) return filterResponse;
        // }

        if (this.hasMiddleware) {
          if (this.globalMiddlewares.length) {
            const globalMiddlewareResponse = await executeBunMiddlewares(
              this.globalMiddlewares,
              req,
              server
            );
            if (globalMiddlewareResponse) return globalMiddlewareResponse;
          }
    
          const pathMiddlewares = this.middlewares.get(path) || [];
          if (pathMiddlewares?.length) {
            const pathMiddlewareResponse = await executeBunMiddlewares(
              pathMiddlewares,
              req,
              server
            );
            if (pathMiddlewareResponse) return pathMiddlewareResponse;
          }
        }

        if (method !== req.method) return new Response("Method Not Allowed", { status: 405 });

        const response = await singleHandler(req,server)
        if (response instanceof Promise) {
          const resolved = await response;
          return resolved ?? new Response("Not Found", { status: 404 });
        }
        return response ?? new Response("Not Found", { status: 404 });

      }
    } 
    
    else {
      this.routes[path] = async (req: BunRequest, server: Server) => {

        if (this.hasMiddleware) {
          if (this.globalMiddlewares.length) {
            const globalMiddlewareResponse = await executeBunMiddlewares(
              this.globalMiddlewares,
              req,
              server
            );
            if (globalMiddlewareResponse) return globalMiddlewareResponse;
          }
    
          const pathMiddlewares = this.middlewares.get(path) || [];
          if (pathMiddlewares?.length) {
            const pathMiddlewareResponse = await executeBunMiddlewares(
              pathMiddlewares,
              req,
              server
            );
            if (pathMiddlewareResponse) return pathMiddlewareResponse;
          }
        }

        if (method !== req.method) return new Response("Method Not Allowed", { status: 405 });

        for (let i = 0; i < handlers.length; i++) {
          const response = handlers[i](req, server)
          if (response instanceof Promise) {
            const resolved = await response;
            return resolved ?? new Response("Not Found", { status: 404 });
          }
          return response ?? new Response("Not Found", { status: 404 });
        }
      }
    }

  }

  listen(
    port: any,
    ...args: listenArgsT[]
  ): Server | void {
    if (typeof Bun === "undefined")
      throw new Error(".listen() is designed to run on Bun only...");

    let hostname = "0.0.0.0";
    let callback: (() => void) | undefined = undefined;
    let options: { sslCert?: string; sslKey?: string } = {};

    for (const arg of args) {
      if (typeof arg === "string") {
        hostname = arg;
      } else if (typeof arg === "function") {
        callback = arg;
      } else if (typeof arg === "object" && arg !== null) {
        options = arg;
      }
    }

    this.compile();

    const ServerOptions: any = {
      port,
      hostname,
      idleTimeOut: this.idleTimeOut,

      fetch: async (req: BunRequest, server: Server) => {
        const url: URL = new URL(req.url);

        if (this.hooks.onRequest) {
          const handlers = this.hooks.onRequest;
          for (let i = 0; i < handlers.length; i++) {
            await handlers[i](req, url, server);
          }
        }

        return handleRequest(req, server, url, this as DieselT)
      },

      static: this.staticFiles,
      routes: this.routes,

    };

    if (options.sslCert && options.sslKey) {
      ServerOptions.certFile = options.sslCert;
      ServerOptions.keyFile = options.sslKey;
    }

    this.serverInstance = Bun?.serve(ServerOptions);

    if (options.sslCert && options.sslKey) {
      console.log(`HTTPS server is running on https://localhost:${port}`);
    }
    if (callback) {
      return callback();
    }

    return this.serverInstance;
  }

  close(
    callback?: () => void
  ): void {
    if (this.serverInstance) {
      this.serverInstance.stop(true);
      this.serverInstance = null;
      callback ? callback() : console.log("Server has been stopped")
    } else {
      console.warn("Server is not running.");
    }
  }

  /**
   * Registers a router instance for subrouting.
   * Allows defining subroutes like:
   *   const userRoute = new Diesel();
   *   app.route("/api/v1/user", userRoute);
   */
  route(
    basePath: string,
    routerInstance: any
  ): this {
    if (!basePath || typeof basePath !== "string")
      throw new Error("Path must be a string");

    // Extract routes and convert them into an array of entries.
    const routes = Object.fromEntries(routerInstance.tempRoutes);
    const routesArray = Object.entries(routes);

    routesArray.forEach(([path, args]) => {
      const cleanedPath = path.replace(/::\w+$/, "")
      const fullpath = `${basePath}${cleanedPath}`; // Construct the full path.

      // Ensure the middleware array is initialized for the path.
      if (!this.middlewares.has(fullpath)) {
        this.middlewares.set(fullpath, []);
      }

      // Add all middleware functions for the route, preserving user-defined order.
      const middlewareHandlers: middlewareFunc[] = args.handlers.slice(0, -1);
      middlewareHandlers.forEach((middleware: middlewareFunc) => {
        if (!this.middlewares.get(fullpath)?.includes(middleware)) {
          this.middlewares.get(fullpath)?.push(middleware);
        }
      });

      // Retrieve the final handler for the route (last in the array).
      const handler = args.handlers[args.handlers.length - 1];
      // Register the handler and method in the trie.
      const method = args.method;
      try {
        this.trie.insert(fullpath, {
          handler: handler as handlerFunction,
          method,
        });
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);
      }
    });
    // Nullify the router instance to prevent accidental reuse.
    // and to prevent memory leak
    routerInstance = null;
    return this;
  }
  /**
   * Registers a router instance for subrouting.
   * Allows defining subroutes like:
   *   const userRoute = new Diesel();
   *   userRoute.post("/login",handlerFunction)
   *   userRoute.post("/register", handlerFunction)
   *   app.register("/api/v1/user", userRoute);
   */
  register(
    basePath: string,
    routerInstance: any
  ): this {
    // Simply delegate to the `route` method.
    return this.route(basePath, routerInstance);
  }


  private addRoute(
    method: HttpMethod,
    path: string,
    handlers: handlerFunction[]
  ): void {
    if (typeof path !== "string")
      throw new Error(
        `Error in ${handlers[handlers.length - 1]
        }: Path must be a string. Received: ${typeof path}`
      );
    if (typeof method !== "string")
      throw new Error(
        `Error in addRoute: Method must be a string. Received: ${typeof method}`
      );

    this.tempRoutes?.set(path + "::" + method, { method, handlers });
    const middlewareHandlers = handlers.slice(0, -1) as middlewareFunc[];
    const handler = handlers[handlers.length - 1];

    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
    middlewareHandlers.forEach((middleware: middlewareFunc) => {
      if (path === "/") {
        this.globalMiddlewares = [
          ...new Set([...this.globalMiddlewares, ...middlewareHandlers]),
        ];
      } else {
        if (!this.middlewares.get(path)?.includes(middleware)) {
          this.middlewares.get(path)?.push(middleware);
        }
      }
    });

    try {
      if (method === "ANY") {
        const allMethods: HttpMethod[] = [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "PATCH",
          "OPTIONS",
          "HEAD",
          "PROPFIND",
        ];
        for (const m of allMethods) {
          this.trie.insert(path, { handler, method: m });
        }
      }
      this.trie.insert(path, { handler, method });
    } catch (error) {
      console.error(`Error inserting ${path}:`, error);
    }
  }

  /**
   * Adds middleware to the application.
   * - Middlewares are executed in the order they are added.
   * - Duplicate middleware functions will run multiple times if explicitly included.
   *
   * Examples:
   * - app.use(h1) -> Adds a single global middleware.
   * - app.use([h1, h2]) -> Adds multiple global middlewares.
   * - app.use("/home", h1) -> Adds `h1` middleware to the `/home` path.
   * - app.use(["/home", "/user"], [h1, h2]) -> Adds `h1` and `h2` to `/home` and `/user`.
   * - app.use(h1, [h2, h1]) -> Runs `h1`, then `h2`, and `h1` again as specified.
   */

  use(
    pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[],
    handlers?: middlewareFunc | middlewareFunc[]
  ): this | void {
    /**
     * First, we check if the user has passed an array of global middlewares.
     * Example: app.use([h1, h2])
     */
    if (Array.isArray(pathORHandler)) {
      pathORHandler.forEach((handler) => {
        /**
         * Check if the array contains middleware functions (e.g., app.use([h1, h2]))
         * and ensure they are not already added to globalMiddlewares.
         */
        if (typeof handler === "function") {
          /**
           * this algorithm was for removing duplicates midl but now user has freedom...
           * if thet wanna run same middleware multilple times
           * if (!this.globalMiddlewares.includes(handler as middlewareFunc)) {
           * this.globalMiddlewares.push(handler as middlewareFunc) }
           */

          this.globalMiddlewares.push(handler);
        }
      });
    }

    /**
     *  Next, check if the user has passed a single middleware function as a global middleware.
     * Example: app.use(h1)
     */
    if (typeof pathORHandler === "function") {
      /**
       * this algorithm was for removing duplicates midl but now user has freedom...
       * if thet wanna run same middleware multilple times
       * if (!this.globalMiddlewares.includes(handler as middlewareFunc)) {
       * this.globalMiddlewares.push(handler as middlewareFunc) }
       */
      this.globalMiddlewares.push(pathORHandler);

      /**
       * Additionally, check if there are multiple handlers passed as the second parameter.
       * Example: app.use(h1, [h2, h3])
       */

      if (Array.isArray(handlers)) {
        handlers.forEach((handler: middlewareFunc) => {
          // if (!this.globalMiddlewares.includes(handler)) {
          this.globalMiddlewares.push(handler);
          // }
        });
      }
      return;
    }

    /**
     * If the user has passed one or more paths along with a middleware or multiple middlewares:
     * Example 1: app.use("/home", h1) - single path with a single middleware.
     * Example 2: app.use(["/home", "/user"], [h1, h2]) - multiple paths with multiple middlewares.
     */
    const paths: string[] = Array.isArray(pathORHandler)
      ? pathORHandler.filter((path): path is string => typeof path === "string")
      : [pathORHandler].filter(
        (path): path is string => typeof path === "string"
      );

    paths.forEach((path: string) => {
      // Initialize the middleware array for the given path if it doesn't already exist.
      if (!this.middlewares.has(path)) {
        this.middlewares.set(path, []);
      }
      if (handlers) {
        // Convert a single middleware into an array for consistency.
        // Example: app.use('/home', h1) -> handlers becomes [h1].
        const handlerArray = Array.isArray(handlers) ? handlers : [handlers];

        // Add each handler to the middleware list for the path.
        handlerArray.forEach((handler: middlewareFunc) => {
          // if (!this.middlewares.get(path)?.includes(handler)) {
          this.middlewares.get(path)?.push(handler);
          // }
        });
      }
    });

    // Finally, return `this` to allow method chaining.
    return this;
  }

  get(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("GET", path, handlers);
    return this;
  }

  post(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("POST", path, handlers);
    return this;
  }

  put(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("PUT", path, handlers);
    return this;
  }

  patch(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("PATCH", path, handlers);
    return this;
  }

  delete(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("DELETE", path, handlers);
    return this;
  }

  any(
    path: string,
    ...handlers: handlerFunction[]
  ) {
    this.addRoute("ANY", path, handlers);
    return this;
  }

  head(
    path: string,
    ...handlers: handlerFunction[]
  ) {
    this.addRoute("HEAD", path, handlers);
    return this;
  }

  options(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("OPTIONS", path, handlers);
    return this;
  }

  propfind(
    path: string,
    ...handlers: handlerFunction[]
  ): this {
    this.addRoute("PROPFIND", path, handlers);
    return this;
  }
}

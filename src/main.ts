import Trie from "./trie.js";
import path from 'path'
import fs from 'fs'
import {
  CompileConfig,
  ContextType,
  corsT,
  FilterMethods,
  HookFunction,
  HookType,
  HttpMethodOfApp,
  listenArgsT,
  middlewareFunc,
  onError,
  onRequest,
  onSend,
  RouteNotFoundHandler,
  TempRouteEntry,
  type handlerFunction,
  type Hooks,
  type HttpMethod,
} from "./types.js";

import {
  Server
} from "bun";

import {
  advancedLogger,
  AdvancedLoggerOptions,
  logger,
  LoggerOptions
} from "./middlewares/logger/logger.js";

import {
  authenticateJwtDbMiddleware,
  authenticateJwtMiddleware
} from "./utils/jwt.js";

import {
  buildRequestPipeline,
  BunRequestPipline
} from "./request_pipeline.js";

import {
  getPath,
  tryDecodeURI
} from "./utils/urls.js";

import { EventEmitter } from 'events';
import { Context } from "./ctx.js";

import {
  generateErrorResponse,
  handleRouteNotFound,
  runFilter,
  runHooks,
  runMiddlewares
} from "./utils/request.util.js";
import { HTTPException } from "./http-exception.js";


export default class Diesel {
  private static instance: Diesel
  fecth: any // ServerOptions['fetch']
  routes: Record<string, Function>
  private tempRoutes: Map<string, TempRouteEntry> | null;
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
  filterFunction: Function[];
  private hasFilterEnabled: boolean;
  private serverInstance: Server | null;
  staticPath: any;
  staticFiles: any
  user_jwt_secret: string
  private baseApiUrl: string
  private enableFileRouter: boolean
  idleTimeOut: number
  routeNotFoundFunc: (c: ContextType) => void | Promise<void> | Promise<Response> | Response;
  private prefixApiUrl: string | null
  compileConfig: CompileConfig | null
  private newPipelineArchitecture: boolean = false
  emitter: EventEmitter
  errorFormat: string;

  constructor(
    {
      jwtSecret,
      baseApiUrl,
      enableFileRouting,
      idleTimeOut,
      prefixApiUrl,
      onError,
      logger,
      pipelineArchitecture
    }
      : {
        jwtSecret?: string,
        baseApiUrl?: string,
        enableFileRouting?: boolean,
        idleTimeOut?: number,
        prefixApiUrl?: string,
        onError?: boolean,
        logger?: boolean,
        pipelineArchitecture?: boolean
      } = {}
  ) {

    if (!Diesel.instance) {
      Diesel.instance = this
    }
    if (pipelineArchitecture) {
      this.newPipelineArchitecture = true
    }
    this.errorFormat = 'json'
    this.emitter = new EventEmitter()

    this.prefixApiUrl = prefixApiUrl ?? ''
    this.fetch = this.fetch.bind(this);
    this.routes = {}
    this.idleTimeOut = idleTimeOut ?? 10
    this.enableFileRouter = enableFileRouting ?? false
    this.baseApiUrl = baseApiUrl || ''
    this.user_jwt_secret = jwtSecret || process.env.DIESEL_JWT_SECRET || 'feault_diesel_secret_for_jwt'
    this.tempRoutes = new Map<string, TempRouteEntry>();
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
    };

    // if user wants to log Error and respective Res
    if (onError) this.addHooks('onError', (err: ErrnoException, _, path) => {
      console.log('Got an exception:', err);
      console.log('Request Path:', path);
    });

    // if user wants to log
    if (logger) this.useLogger({
      app: this,
      onError(err) {
        console.error('Got an exception:', err);
      },
    })


    this.FilterRoutes = [];
    this.filters = new Set<string>();
    this.filterFunction = [];
    this.hasFilterEnabled = false;
    this.serverInstance = null;
    this.staticPath = null;
    this.staticFiles = {};
    this.routeNotFoundFunc = () => { }

    this.compileConfig = null

  }

  // experimental for sub routing using single ton
  static router(prefix: string) {
    // this.instance.prefixApiUrl = apiPath;
    if (!this.instance) {
      this.instance = new Diesel()
    }

    // creating proxy to intercept router and add prefix url only for this
    return new Proxy(this.instance, {
      get(target, prop, reciever) {
        return (path: string, handler: any) => {
          const fullPath = prefix + path
          return (target as any)[prop](fullPath, handler)
          // if (typeof path === 'string') return (target as any)[prop](fullPath, handler)
          // else if (typeof path === 'function') return (target as any)[prop](path)

        }
      }
    })

  }

  /**
   this filter is like user once specify which routes needs to be public and for rest routes use a global
    auth middleware .

    and this provides built in middleware to authenticate using jwt
  */
  setupFilter(): FilterMethods {
    this.hasFilterEnabled = true;

    return {
      publicRoutes: (
        ...routes: string[]
      ) => {
        this.FilterRoutes = routes;
        return this.setupFilter();
      },

      permitAll: () => {
        for (let route of this?.FilterRoutes!) {
          if (route.endsWith("/")) {
            route = route.slice(0, -1);
          }
          this.filters.add(route);
        }
        this.FilterRoutes = null;
        return this.setupFilter();
      },

      authenticate: (
        fnc?: Function[] | middlewareFunc[]
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
            authenticateJwtMiddleware(jwt, this.user_jwt_secret)
          );
      },

      authenticateJwtDB: (jwt: any, User: any) => {
        this.filterFunction
          .push(
            authenticateJwtDbMiddleware(jwt, User, this.user_jwt_secret)
          );
      }

    };
  }

  // for redirect on a specific path
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
    path: string
  ) {
    this.staticPath = path;
    return this;
  }

  staticHtml(
    args: Record<string, string>
  ): this {
    this.staticFiles = { ...this.staticFiles, ...args };
    return this;
  }


  addHooks<T extends HookType>(
    typeOfHook: T,
    fnc: NonNullable<Hooks[T]>[number]
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
        this.hooks.onSend?.push(fnc as onSend)
        break;
      case "onError":
        this.hooks.onError?.push(fnc as onError)
        break;
      case "onClose":
        this.hooks.onClose?.push(fnc as HookFunction)
        break;
      default:
        throw new Error(`Unknown hook type: ${typeOfHook}`);
    }
    return this;
  }

  private compile() {

    let config: CompileConfig = {
      hasMiddleware: false,
      hasOnReqHook: false,
      hasPreHandlerHook: false,
      hasOnError: false,
      hasPostHandlerHook: false,
      hasOnSendHook: false,
      hasFilterEnabled: false
    }

    if (this.hasFilterEnabled) {
      config.hasFilterEnabled = true
      this.hasFilterEnabled = true
    }

    if (this?.globalMiddlewares?.length > 0) {
      config.hasMiddleware = true;
      this.hasMiddleware = true
    }

    for (const [_, middlewares] of this?.middlewares?.entries()) {
      if (middlewares.length > 0) {
        config.hasMiddleware = true;
        this.hasMiddleware = true
        break;
      }
    }

    if (this?.enableFileRouter) {
      const projectRoot = process.cwd();
      const routesPath = path.join(projectRoot, 'src', 'routes');
      if (fs?.existsSync(routesPath)) {
        this.loadRoutes(routesPath, '');
      }
    }

    // check hooks enables
    if (this?.hooks?.onRequest && this.hooks.onRequest.length > 0) {
      config.hasOnReqHook = true;
      this.hasOnReqHook = true
    }
    if (this?.hooks?.preHandler && this.hooks.preHandler.length > 0) {
      config.hasPreHandlerHook = true;
      this.hasPreHandlerHook = true
    }
    if (this?.hooks?.postHandler && this.hooks.postHandler?.length > 0) {
      config.hasPostHandlerHook = true;
      this.hasPostHandlerHook = true
    }
    if (this?.hooks?.onSend && this.hooks.onSend?.length > 0) {
      config.hasOnSendHook = true;
      this.hasOnSendHook = true
    }
    if (this?.hooks?.onError && this.hooks.onError?.length > 0) {
      config.hasOnError = true;
      this.hasOnError = true
    }
    // console.log('this.hooks', this.hasOnReqHook)
    setTimeout(() => {
      this.tempRoutes = null
    }, 2000);
    this.compileConfig = config
    return config;
  }

  // this func gives us power to do file based routing similar to Next.js
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
    } else if (routePath.endsWith('/api')) {
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
        const lowerMethod = method.toLowerCase() as HttpMethodOfApp;
        const handler = module[method] as handlerFunction;
        this[lowerMethod](`${this.baseApiUrl}${routePath}`, handler)
      }
    }
  }

  // part of load Routes func family
  private async loadRoutes(
    dirPath: string,
    baseRoute: string
  ) {
    const files = await fs.promises.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        await this.loadRoutes(filePath, baseRoute + '/' + file);
      } else if (file.endsWith('.ts')) {
        await this.registerFileRoutes(filePath, baseRoute, '.ts');
      } else if (file.endsWith('.js')) {
        await this.registerFileRoutes(filePath, baseRoute, '.js');
      }

    }
  }

  // For logging incoming requests
  useLogger(options: LoggerOptions) {
    logger(options)
    return this
  }

  useAdvancedLogger(options: AdvancedLoggerOptions) {
    advancedLogger(options)
    return this
  }


  // this is for high performance api endpoint and when u use this no app.use midl works here
  // when you use this , it will override existing endpoint with same path
  BunRoute(method: string, path: string, ...handlersOrResponse: any[]): this {
    if (!path || typeof path !== 'string') throw new Error("give a path in string format")
    if (!this.compileConfig) {
      this.compile();
    }

    // Direct response send
    let response_data: string | object | undefined;
    if (typeof handlersOrResponse[0] === "string" || typeof handlersOrResponse[0] === "object") {
      response_data = handlersOrResponse[0];
    }
    if (typeof response_data !== "undefined") {
      const data = typeof response_data === "string"
        ? response_data
        : JSON.stringify(response_data)
    }

    const handlerFunction = BunRequestPipline(this.compileConfig!, this as any, method.toUpperCase(), path, ...handlersOrResponse)
    this.routes[path] = handlerFunction
    return this
  }

  listen(
    port: any,
    ...args: listenArgsT[]
  ): Server | void {
    if (typeof Bun === "undefined")
      throw new Error(".listen() is designed to run on Bun only...");

    let hostname = "0.0.0.0";
    let callback: (() => void) | undefined = undefined;
    let options: { cert?: string; key?: string } = {};

    for (const arg of args) {
      if (typeof arg === "string") {
        hostname = arg;
      } else if (typeof arg === "function") {
        callback = arg;
      } else if (typeof arg === "object" && arg !== null) {
        options = arg;
      }
    }

    const ServerOptions: any = {
      port,
      hostname,
      idleTimeOut: this.idleTimeOut,

      fetch: this.fetch(),
      static: this.staticFiles,
    };

    if (this.routes && Object.keys(this.routes).length > 0) {
      ServerOptions.routes = this.routes;
    }

    if (options.cert && options.key) {
      ServerOptions.certFile = options.cert;
      ServerOptions.keyFile = options.key;
    }

    this.serverInstance = Bun?.serve(ServerOptions);

    if (callback) {
      callback();
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

  fetch() {
    const config: CompileConfig = this.compile();

    if (this.newPipelineArchitecture) {
      // New way
      const pipeline = buildRequestPipeline(config, this as any)
      return (req: Request, server: Server) => {
        return pipeline(req, server, this)
          .catch(async (error: any) => {
            console.error("Unhandled handler error:", error);
            const errorResult = await runHooks(
              "onError",
              this.hooks.onError,
              [error, req, getPath(req.url), server]
            );
            return errorResult || generateErrorResponse(500, "Internal Server Error");
          });
      };
    }

    // old with bind
    return this.handleRequests.bind(this)

    // old method which is default
    return (req: Request, server: Server) => {
      return this.handleRequests(req, server)
        .catch(async (err: ErrnoException) => {
          console.log("error ", err)
          const errorResult = await runHooks("onError", this.hooks.onError, [err, req, getPath(req.url), server]);
          return errorResult || generateErrorResponse(500, "Internal Server Error");
        })
    }

  }

  // Function where our request comes if new architecture is disabled.
  private async handleRequests(req: Request, server: Server) {
    let pathname;
    const start = req.url.indexOf('/', req.url.indexOf(':') + 4);
    let i = start;
    for (; i < req.url.length; i++) {
      const charCode = req.url.charCodeAt(i);
      if (charCode === 37) {
        const queryIndex = req.url.indexOf('?', i);
        const path = req.url.slice(start, queryIndex === -1 ? undefined : queryIndex);
        pathname = tryDecodeURI(path.includes('%25') ? path.replace(/%25/g, '%2525') : path);
        break;
      } else if (charCode === 63) {
        break;
      }
    }
    if (!pathname) {
      pathname = req.url.slice(start, i);
    }

    const routeHandler = this.trie.search(pathname, req.method as HttpMethod);
    // console.log('routeHanlder',routeHandler)
    const ctx = new Context(req, server, pathname, routeHandler?.path)

    try {
      if (this.hasOnReqHook)
        await runHooks('onRequest', this.hooks.onRequest, [req, pathname, server])

      // middleware execution
      if (this.hasMiddleware) {
        const mwResult = await runMiddlewares(this as any, pathname, ctx);
        if (mwResult) return mwResult;
      }

      // filter execution
      if (this.hasFilterEnabled) {
        const filterResponse = await runFilter(this as any, pathname, ctx);
        if (filterResponse) return filterResponse;
      }

      // if route not found
      if (!routeHandler) return await handleRouteNotFound(this as any, ctx, pathname)

      // pre-handler
      if (this.hasPreHandlerHook) {
        const result = await runHooks('preHandler', this.hooks.preHandler, [ctx]);
        if (result) return result;
      }

      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;

      // onSend
      if (this.hasOnSendHook) {
        const response = await runHooks('onSend', this.hooks.onSend, [ctx, finalResult]);
        if (response) return response;
      }

      if (finalResult instanceof Response) {
        return finalResult;
      }
    } catch (err: any) {
      return this.handleError(err, req, server)
    }

    // if we dont return a response then by default Bun shows a err 
    return generateErrorResponse(500, "No response returned from handler.");

  }

  // HandleError
  private async handleError(err: ErrnoException, req: Request, server: Server) {
    const isDev = process.env.NODE_ENV === "developement";
    const format = this.errorFormat || "json";
    const path = getPath(req.url)
    // 1. user defined hooks
    const hookResult = await runHooks("onError", this.hooks.onError, [
      err,
      req,
      path,
      server,
    ]);
    if (hookResult) return hookResult;

    // 2. HTTPException
    if (err instanceof HTTPException) {
      // If a custom Response was provided, use it
      if (err.res) return err.res

      return format === "json"
        ? Response.json({ error: err.message }, { status: err.status })
        : new Response(err.message, { status: err.status });
    }

    // 3. Default fallback
    if (format === 'json') {
      const body = {
        error: err?.message ?? "Internal Server Error",
        ...(isDev && { stack: err.stack }),
        path
      }
      return Response.json(body, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    else {
      const message = isDev
        ? `Error: ${err?.message ?? "Internal Server Error"}\nStack: ${err.stack}`
        : `Error: ${err?.message ?? "Internal Server Error"}`;

      return new Response(message, {
        headers: { "Content-Type": "text/plain" },
        status: 500,
      });
    }
  }

  /**
   * Registers a router instance for subrouting.
   * Allows defining subroutes like:
   *   const userRoute = new Diesel();
   *   app.route("/api/v1/user", userRoute);
   */
  route(
    basePath: string | undefined,
    routerInstance: Diesel | null
  ): this {

    basePath = (basePath && basePath.length > 0)
      ? basePath
      : routerInstance?.prefixApiUrl as string | undefined;

    const tempRoutes = routerInstance?.tempRoutes ?? new Map<string, TempRouteEntry>()

    for (const [path, args] of tempRoutes.entries()) {
      const cleanedPath = path.replace(/::\w+$/, "")
      const fullpath = `${basePath}${cleanedPath}`;

      if (!this.middlewares.has(fullpath)) {
        this.middlewares.set(fullpath, []);
      }

      // Add all middleware functions for the route, preserving user-defined order.
      const middlewareHandlers = args.handlers.slice(0, -1) as middlewareFunc[];

      middlewareHandlers.forEach((middleware: middlewareFunc) => {
        const arr = this.middlewares.get(fullpath)!;
        if (!arr.includes(middleware)) {
          arr.push(middleware);
        }
      });

      // final handler
      const handler = args.handlers[args.handlers.length - 1];
      const method = args.method;
      try {
        this.trie.insert(fullpath, {
          handler: handler as handlerFunction,
          method,
        });
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);
      }
    }
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
    basePath: string | undefined,
    routerInstance: Diesel
  ): this {
    return this.route(basePath, routerInstance);
  }


  private addRoute(
    method: HttpMethod,
    path: string,
    handlers: handlerFunction[]
  ): void {
    // path = this.prefixApiUrl ? this.prefixApiUrl + path : path;

    if (typeof path !== "string")
      throw new Error(`Error in ${handlers[handlers.length - 1]}: Path must be a string. Received: ${typeof path}`);
    if (typeof method !== "string")
      throw new Error(`Error in addRoute: Method must be a string. Received: ${typeof method}`);

    this.tempRoutes?.set(path + "::" + method, { method, handlers });
    const middlewareHandlers = handlers.slice(0, -1) as middlewareFunc[];
    const handler = handlers[handlers.length - 1];

    if (middlewareHandlers.length > 0) {
      if (!this.middlewares.has(path)) this.middlewares.set(path, []);

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
    }

    try {
      if (method === "ANY") {
        const allMethods: HttpMethod[] = [
          "GET", "POST", "PUT", "DELETE",
          "PATCH", "OPTIONS", "HEAD", "PROPFIND",
        ];
        for (const method of allMethods) this.trie.insert(path, { handler, method: method });
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
    pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[] | Function | Function[],
    handlers?: middlewareFunc | middlewareFunc[] | Function | Function[]
  ): this {
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
          this.globalMiddlewares.push(handler as middlewareFunc);
        }
      });
    }

    /**
     *  Next, check if the user has passed a single middleware function as a global middleware.
     * Example: app.use(h1)
     */
    if (typeof pathORHandler === "function") {

      this.globalMiddlewares.push(pathORHandler as middlewareFunc);

      /**
       * Additionally, check if there are multiple handlers passed as the second parameter.
       * Example: app.use(h1, [h2, h3])
       */

      if (Array.isArray(handlers)) {
        handlers.forEach((handler: Function) => {
          this.globalMiddlewares.push(handler as middlewareFunc);
        });
      }
      return this;
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
        // Example: app.use('/home', h1) -> handlers becomes [h1].
        const handlerArray = Array.isArray(handlers) ? handlers : [handlers];

        handlerArray.forEach((handler: Function) => {
          // if (!this.middlewares.get(path)?.includes(handler)) {
          this.middlewares.get(path)?.push(handler as middlewareFunc);
          // }
        });
      }
    });

    // new try experimental
    // paths.forEach((path: string) => {
    //   console.log('midl',path, handlers)
    //   this.trie.pushMidl(path, handlers as any)
    // })

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



  routeNotFound(
    handler: RouteNotFoundHandler
  ) {
    this.routeNotFoundFunc = handler;
    return this;
  }


  // on(methods: string | (HttpMethod | string)[], path: string, ...handlers: handlerFunction[]) {
  //   const methodArray = Array.isArray(methods) ? methods : [methods]

  //   for (const method of methodArray) {
  //     const methodNormalized = method.toUpperCase();
  //     if (methodNormalized.toLocaleLowerCase() in this) {
  //       this[methodNormalized.toLocaleLowerCase() as HttpMethodLower](path, ...handlers)
  //     }
  //     else {
  //       this.addRoute(methodNormalized as HttpMethod, path, handlers)
  //     }
  //   }

  // }
  on(event: string | symbol, listener: EventListener) {
    this.emitter.on(event, listener);
  }

  emit(event: string | symbol, ...args: any) {
    this.emitter.emit(event, ...args);
  }
}


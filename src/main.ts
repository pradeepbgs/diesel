import {
  CompileConfig,
  ContextType,
  corsT,
  DieselOptions,
  errorFormat,
  FilterMethods,
  HookFunction,
  HookType,
  listenArgsT,
  middlewareFunc,
  onError,
  onRequest,
  onSend,
  RouteHandler,
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
} from "./utils/urls.js";

import { EventEmitter } from 'events';
import { Context } from "./ctx.js";

import {
  handleRouteNotFound,
  runFilter,
  runHooks,
} from "./utils/request.util.js";

import { HTTPException } from "./http-exception";
import { Router, RouterFactory } from "./router/interface.js";
import { supportedMethods } from './constant.js';
import { isPromise } from "./utils/promise.js";



export default class Diesel {
  private static instance: Diesel
  routes: Record<string, Function>
  private tempRoutes: Map<string, TempRouteEntry> | null;
  tempMiddlewares: Map<string, middlewareFunc[]> | null = new Map()

  router: Router
  hasOnReqHook: boolean;
  hasPreHandlerHook: boolean;
  hasPostHandlerHook: boolean;
  hasOnSendHook: boolean;
  hasOnError: boolean;
  hooks: Hooks;
  corsConfig: corsT;
  FilterRoutes: string[] | null | undefined;
  filters: Set<string>;
  filterFunction: Function[];
  hasFilterEnabled: boolean;
  private serverInstance: Server | null;
  staticFiles: any
  user_jwt_secret: string
  baseApiUrl: string
  private enableFileRouter: boolean
  idleTimeOut: number
  routeNotFoundFunc: (c: ContextType) => void | Promise<void> | Promise<Response> | Response;
  private prefixApiUrl: string | null
  compileConfig: CompileConfig | null
  #newPipelineArchitecture: boolean = false
  emitter: EventEmitter
  errorFormat: errorFormat;
  platform: string = 'bun'
  // tha path of static files
  staticPath: any;
  // the request path where user wants static files should be server
  staticRequestPath: string | undefined = undefined;


  get!: RouteHandler;
  post!: RouteHandler;
  put!: RouteHandler;
  patch!: RouteHandler;
  delete!: RouteHandler;
  any!: RouteHandler;
  head!: RouteHandler;
  options!: RouteHandler;
  propfind!: RouteHandler;

  constructor(options: DieselOptions = {}) {

    supportedMethods.forEach((method) => {
      (this as any)[method.toLocaleLowerCase()] = (
        path: string,
        ...handlers: any
      ): this => {
        this.addRoute(method as HttpMethod, path, handlers)
        return this;
      }
    })

    const {
      router = 't2',
      routerInstance,
      errorFormat = 'json',
      platform = 'bun',
      enableFileRouting = false,
      prefixApiUrl = '',
      baseApiUrl = '',
      jwtSecret,
      idleTimeOut = 10,
      pipelineArchitecture = false,
      logger,
      onError
    } = options;

    if (routerInstance) this.router = routerInstance
    else this.router = RouterFactory.create(router);

    this.errorFormat = errorFormat
    this.platform = platform

    if (!Diesel.instance) {
      Diesel.instance = this
    }
    if (pipelineArchitecture) {
      this.#newPipelineArchitecture = true
    }

    this.errorFormat = errorFormat
    this.emitter = new EventEmitter()

    this.prefixApiUrl = prefixApiUrl ?? ''
    this.fetch = this.fetch.bind(this);
    this.routes = {}
    this.idleTimeOut = idleTimeOut ?? 10
    this.enableFileRouter = enableFileRouting ?? false
    this.baseApiUrl = baseApiUrl || ''
    this.user_jwt_secret = jwtSecret || process.env.DIESEL_JWT_SECRET || 'default_diesel_secret_for_jwt'
    this.tempRoutes = new Map<string, TempRouteEntry>();
    this.corsConfig = null;
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
    if (onError) this.addHooks('onError', (err: ErrnoException, path: string,) => {
      console.log('Got an exception:', err);
      console.log('Request Path:', path);
    });

    // if user wants to log
    if (logger) this.useLogger({
      app: this,
      // onError(err) {
      //   console.error('Got an exception:', err?.message ?? err?.cause);
      // },
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
          let givenHandler = handler
          let givenPath = ''

          if (typeof path === 'string') givenPath = path;
          else if (typeof path === 'function') givenHandler = path;
          else if (typeof path !== 'string') givenPath = '';

          const fullPath = prefix + givenPath
          // console.log(fullPath)
          return (target as any)[prop](fullPath, givenHandler)
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

    this.any(incomingPath, (ctx: Context) => {

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


  static(
    path: string,
    requestPath?: string
  ) {
    this.staticPath = path;
    this.staticRequestPath = requestPath
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
    fnc: Hooks[T][number]
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
        this.hasOnReqHook = true
        break;
      case "preHandler":
        this.hooks.preHandler?.push(fnc as HookFunction)
        this.hasPreHandlerHook = true
        break;
      case "postHandler":
        this.hooks.postHandler?.push(fnc as HookFunction)
        this.hasPostHandlerHook = true
        break;
      case "onSend":
        this.hooks.onSend?.push(fnc as onSend)
        this.hasOnSendHook = true
        break;
      case "onError":
        this.hooks.onError?.push(fnc as onError)
        this.hasOnError = true
        break;
      case "onClose":
        this.hooks.onClose?.push(fnc as HookFunction)
        break;
      default:
        throw new Error(`Unknown hook type: ${typeOfHook}`);
    }
    return this;
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

    const handlerFunction = BunRequestPipline(this as any, method.toUpperCase(), path, ...handlersOrResponse)
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

    callback && callback()

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

  // for cloudflare fetch
  cfFetch() {
    this.tempRoutes = null
    this.tempMiddlewares = null

    return (request: Request, env: Record<string, any>, executionCtx: any) => {
      return this.#handleRequests(request, undefined, env, executionCtx)
    }
  }

  fetch() {
    this.tempRoutes = null
    this.tempMiddlewares = null
    // if user is using for cloudflare workers
    if (this.platform === 'cf' || this.platform === 'cloudflare') {
      if (this.#newPipelineArchitecture) {
        const pipeline = buildRequestPipeline(this as any)
        return (req: Request, env: Record<string, string>, executionContext: any) => {
          return pipeline(req, this, undefined, env, executionContext)
            .catch(async (error: any) => {
              return this.handleError(error, getPath(req.url), req)
            });
        };
      }

      // cloudflare handler
      return (request: Request, env?: Record<string, any>, executionContext?: any) => {
        return this.#handleRequests(request, undefined, env, executionContext)
      }

    }

    // NORMAL WAY WITH BUN/NODE/DENO

    if (this.#newPipelineArchitecture) {
      // New way
      const pipeline = buildRequestPipeline(this as any)
      return (req: Request, server: Server) => {
        return pipeline(req, this, server, undefined, undefined)
          .catch(async (error: any) => {
            return this.handleError(error, getPath(req.url), req)
          });
      };
    }

    // Default
    return this.#handleRequests.bind(this)

  }

  // Function where our request comes if new architecture is disabled.
  async #handleRequests(
    req: Request,
    server?: Server,
    env?: Record<string, any>,
    executionContext?: any): Promise<Response | undefined> {

    const pathname = getPath(req.url);
    const matchedRouteHandler = this.router.find(req.method as HttpMethod, pathname);
    const ctx = new Context(
      req,
      server,
      pathname,
      matchedRouteHandler?.path as string,
      matchedRouteHandler?.params,
      env,
      executionContext
    );

    try {

      if (this.hasOnReqHook)
        await runHooks('onRequest', this.hooks.onRequest, [ctx])

      // filter execution
      if (this.hasFilterEnabled) {
        const filterResponse = await runFilter(this as any, pathname, ctx);
        if (filterResponse) return filterResponse;
      }

      // pre-handler
      if (this.hasPreHandlerHook) {
        const result = await runHooks('preHandler', this.hooks.preHandler, [ctx]);
        if (result) return result;
      }

      let finalResult
      const handlers: any = matchedRouteHandler?.handler;

      if (handlers.length === 1) {
        const result = handlers[0](ctx);
        finalResult = isPromise(result) ? await result : result;
      }
      else {
        for (let i = 0; i < handlers.length; i++) {
          const result = handlers[i](ctx);
          finalResult = isPromise(result) ? await result : result;
          if (finalResult) break;
        }
      }

      // onSend
      if (this.hasOnSendHook) {
        const response = await runHooks('onSend', this.hooks.onSend, [ctx, finalResult]);
        if (response) return response;
      }

      if (finalResult) return finalResult
      // if (isResponse(finalResult)) {
      //   return finalResult;
      // }

      return await handleRouteNotFound(this as any, ctx, pathname)
    } catch (err: any) {
      return this.handleError(err, pathname, req)
    }

  }

  // HandleError
  private async handleError(err: unknown, path: string, req: Request) {
    const isDev = process.env.NODE_ENV === "developement";

    const format = this.errorFormat

    // 1. user defined hooks
    const hookResult = await runHooks("onError", this.hooks.onError, [err, path, req]);
    if (hookResult) return hookResult;

    // 2. HTTPException
    if (err && typeof err === 'object' && (err as any).name === 'HTTPException') {
      // If a custom Response was provided, use it
      const httpErr = err as HTTPException;
      console.error(`HTTPException on path: ${path}`, {
        status: httpErr.status,
        message: httpErr.message,
        cause: httpErr.cause,
        res: httpErr.res,
        stack: httpErr.stack,
      });


      if (httpErr.res) return httpErr.res

      return format === "json"
        ? Response.json({ error: httpErr.message }, { status: httpErr.status })
        : new Response(httpErr.message, { status: httpErr.status });
    }

    // 3. Default fallback
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    const errorStack = err instanceof Error ? err.stack : undefined;

    console.error(`Error on path: ${path}`, { message: errorMessage, stack: errorStack });

    if (format === 'json') {
      const body: Record<string, any> = {
        error: errorMessage,
        ...(isDev && { stack: errorStack }),
        path
      }
      return Response.json(body, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    else {
      const message: string = isDev
        ? `Error: ${errorMessage}\nStack: ${errorStack}`
        : `Error: ${errorMessage}`;

      return new Response(message, {
        headers: { "Content-Type": "text/plain" },
        status: 500,
      });
    }
  }

  /**
   * Mount method
   */

  mount(
    prefix: string,
    fetch: (request: Request, ...args: any) => Response | Promise<Response>,
  ) {
    const cleanPrefix = prefix.endsWith("/*") ? prefix.slice(0, -1) : prefix;
    const prefixLength = cleanPrefix === '/' ? 0 : cleanPrefix.length;
    this.use(prefix, (ctx: Context) => {
      // build new url for fetch
      const url = new URL(ctx.req.url);
      // here we slice orgininal coming url like /hono/hello so we have to slice /hono
      // and only /hello should become new url
      url.pathname = url.pathname.slice(prefixLength) || '/';
      // create new Request with that url 
      const newRequest = new Request(url.toString(), ctx.req);
      // call fetch 
      return fetch(newRequest, ctx.env, ctx.executionContext);
    });
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

      // Add all middleware functions for the route, preserving user-defined order.
      const middlewareHandlers = args.handlers.slice(0, -1) as middlewareFunc[];
      this.router.addMiddleware(fullpath, ...middlewareHandlers)

      const handler = args.handlers[args.handlers.length - 1];
      const method = args.method;
      try {
        this.router.add(method, fullpath, handler as handlerFunction)
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);
      }
    }

    // Middleware assigning
    for (const [path, handlers] of routerInstance?.tempMiddlewares?.entries() as any) {
      const fullPath = path === "/" ? basePath || "/" : `${basePath}${path}`;
      this.router.addMiddleware(fullPath, ...handlers);
    }


    // Nullify the router instance to prevent accidental reuse.
    // and to prevent memory leak
    routerInstance = null;
    return this;
  }

  /**
   same as Route
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
      // if (!this.middlewares.has(path)) this.middlewares.set(path, []);

      middlewareHandlers.forEach((middleware: middlewareFunc) => {
        this.router.addMiddleware(path, middleware)
        return

        // if (path === "/") {
        //   this.globalMiddlewares = [
        //     ...new Set([...this.globalMiddlewares, ...middlewareHandlers]),
        //   ];
        // } else {
        //   if (!this.middlewares.get(path)?.includes(middleware)) {
        //     this.middlewares.get(path)?.push(middleware);
        //   }
        // }

      });
    }

    try {
      if (method === "ANY") {
        const allMethods: HttpMethod[] = [
          "GET", "POST", "PUT", "DELETE",
          "PATCH", "OPTIONS", "HEAD", "PROPFIND",
        ];
        for (const method of allMethods) {
          try {
            this.router.add(method, path, handler);
          } catch (error) {

          }
        }
      }
      else {
        this.router.add(method, path, handler);
      }
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
   * - app.use("/home", h1) -> Adds `h1` middleware to the `/home` path.
   */

  use(
    pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[] | Function | Function[],
    ...handlers: middlewareFunc | middlewareFunc[] | Function | Function[] | any
  ): this {
    if (typeof pathORHandler === 'string') {
      let path = pathORHandler === "/" ? "/" : pathORHandler;
      if (!this.tempMiddlewares?.has(path)) {
        this.tempMiddlewares?.set(path, []);
      }
      this.tempMiddlewares?.get(path)!.push(...handlers);

      this.router.addMiddleware(path, ...handlers)
    }

    else if (typeof pathORHandler === 'function') {
      const arrs = [pathORHandler, ...handlers]
      if (!this.tempMiddlewares?.has('/')) {
        this.tempMiddlewares?.set('/', []);
      }
      this.tempMiddlewares?.get('/')!.push(...handlers)

      for (const r of arrs) {
        this.router.addMiddleware('/', r)
      }

    }

    return this;

    /**
     * First, we check if the user has passed an array of global middlewares.
     * Example: app.use([h1, h2])
     */
    // if (Array.isArray(pathORHandler)) {
    //   pathORHandler?.forEach((handler) => {
    //     /**
    //      * Check if the array contains middleware functions (e.g., app.use([h1, h2]))
    //      * and ensure they are not already added to globalMiddlewares.
    //      */
    //     if (typeof handler === "function") {
    //       this.globalMiddlewares.push(handler as middlewareFunc);
    //       // this.trie.pushMidl('/', handler as middlewareFunc)
    //     }
    //   });
    // }

    /**
     *  Next, check if the user has passed a single middleware function as a global middleware.
     * Example: app.use(h1)
     */
    // if (typeof pathORHandler === "function") {

    //   this.globalMiddlewares.push(pathORHandler as middlewareFunc);
    //   // this.trie.pushMidl('/', pathORHandler as middlewareFunc)
    //   // this.router.addMiddleware('/', pathORHandler)

    //   /**
    //    * Additionally, check if there are multiple handlers passed as the second parameter.
    //    * Example: app.use(h1, h2,h3,h4..)
    //    */
    //   if (Array.isArray(handlers)) {
    //     handlers.forEach((handler: Function) => {
    //       this.globalMiddlewares.push(handler as middlewareFunc);
    //       // this.trie.pushMidl('/', handler as middlewareFunc)
    //     });
    //   }
    //   return this;
    // }

    /**
     * If the user has passed one or more paths along with a middleware or multiple middlewares:
     * Example 1: app.use("/home", h1) - single path with a single middleware.
     * Example 2: app.use(["/home", "/user"], [h1, h2]) - multiple paths with multiple middlewares.
     */
    // const paths: string[] = Array.isArray(pathORHandler)
    //   ? pathORHandler.filter((path): path is string => typeof path === "string")
    //   : [pathORHandler].filter(
    //     (path): path is string => typeof path === "string"
    //   );


    // paths.forEach((path: string) => {
    //   // Initialize the middleware array for the given path if it doesn't already exist.
    //   if (!this.middlewares.has(path)) {
    //     this.middlewares.set(path, []);
    //   }
    //   if (handlers) {
    //     // Example: app.use('/home', h1) -> handlers becomes [h1].
    //     const handlerArray = Array.isArray(handlers) ? handlers : [handlers];

    //     handlerArray.forEach((handler: Function) => {
    //       // if (!this.middlewares.get(path)?.includes(handler)) {
    //       this.middlewares.get(path)?.push(handler as middlewareFunc);
    //       // }
    //     });
    //   }
    // });


    // return this;

    // // new try experimental
    // paths.forEach((path: string) => {
    //   // console.log('midl', path, handlers)
    //   // this.trie.pushMidl(path, handlers as any)
    // })
    // return this
  }


  routeNotFound(
    handler: RouteNotFoundHandler
  ) {
    this.routeNotFoundFunc = handler;
    return this;
  }


  onMethod(
    methods: string | (HttpMethod | string)[],
    path: string,
    ...handlers: handlerFunction[]
  ) {
    const methodArray = Array.isArray(methods) ? methods : [methods]

    for (const method of methodArray) {
      const httpMethod = method.toLowerCase()

      if (httpMethod in this) {
        (this as any)[httpMethod](path, ...handlers)
      } else {
        this.addRoute(method.toUpperCase() as HttpMethod, path, handlers)
      }
    }

    return this
  }


  on(event: string | symbol, listener: EventListener) {
    this.emitter.on(event, listener);
    return this;
  }

  emit(event: string | symbol, ...args: any) {
    this.emitter.emit(event, ...args);
    return this;
  }
}

import { CompileConfig, ContextType, corsT, DieselOptions, errorFormat, FilterMethods, HookType, listenArgsT, middlewareFunc, RouteHandler, RouteNotFoundHandler, type Hooks } from "./types.js";
import { Server } from "bun";
import { AdvancedLoggerOptions, LoggerOptions } from "./middlewares/logger/logger.js";
import { EventEmitter } from 'events';
import { Router } from "./router/interface.js";
export default class Diesel {
    #private;
    private static instance;
    routes: Record<string, Function>;
    private tempRoutes;
    tempMiddlewares: Map<string, middlewareFunc[]> | null;
    router: Router;
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
    private hasFilterEnabled;
    private serverInstance;
    staticFiles: any;
    user_jwt_secret: string;
    baseApiUrl: string;
    private enableFileRouter;
    idleTimeOut: number;
    routeNotFoundFunc: (c: ContextType) => void | Promise<void> | Promise<Response> | Response;
    private prefixApiUrl;
    compileConfig: CompileConfig | null;
    emitter: EventEmitter;
    errorFormat: errorFormat;
    platform: string;
    staticPath: any;
    staticRequestPath: string | undefined;
    get: RouteHandler;
    post: RouteHandler;
    put: RouteHandler;
    patch: RouteHandler;
    delete: RouteHandler;
    any: RouteHandler;
    head: RouteHandler;
    options: RouteHandler;
    propfind: RouteHandler;
    constructor(options?: DieselOptions);
    static router(prefix: string): Diesel;
    /**
     this filter is like user once specify which routes needs to be public and for rest routes use a global
      auth middleware .
  
      and this provides built in middleware to authenticate using jwt
    */
    setupFilter(): FilterMethods;
    redirect(incomingPath: string, redirectPath: string, statusCode?: 302): this;
    serveStatic(filePath: string, requestPath?: string): this;
    static(path: string, requestPath?: string): this;
    staticHtml(args: Record<string, string>): this;
    addHooks<T extends HookType>(typeOfHook: T, fnc: Hooks[T][number]): this;
    useLogger(options: LoggerOptions): this;
    useAdvancedLogger(options: AdvancedLoggerOptions): this;
    BunRoute(method: string, path: string, ...handlersOrResponse: any[]): this;
    listen(port: any, ...args: listenArgsT[]): Server | void;
    close(callback?: () => void): void;
    cfFetch(): (request: Request, env: Record<string, any>, executionCtx: any) => Promise<Response | undefined>;
    fetch(): ((req: Request, env: Record<string, string>, executionContext: any) => any) | ((request: Request, env?: Record<string, any>, executionContext?: any) => Promise<Response | undefined>) | ((req: Request, server: Server) => any) | ((req: Request, server?: Server, env?: Record<string, any>, executionContext?: any) => Promise<Response | undefined>);
    private handleError;
    /**
     * Mount method
     */
    mount(prefix: string, fetch: (request: Request, ...args: any) => Response | Promise<Response>): void;
    /**
     * Registers a router instance for subrouting.
     * Allows defining subroutes like:
     *   const userRoute = new Diesel();
     *   app.route("/api/v1/user", userRoute);
     */
    route(basePath: string | undefined, routerInstance: Diesel | null): this;
    /**
     same as Route
     */
    register(basePath: string | undefined, routerInstance: Diesel): this;
    private addRoute;
    /**
     * Adds middleware to the application.
     * - Middlewares are executed in the order they are added.
     * - Duplicate middleware functions will run multiple times if explicitly included.
     *
     * Examples:
     * - app.use(h1) -> Adds a single global middleware.
     * - app.use("/home", h1) -> Adds `h1` middleware to the `/home` path.
     */
    use(pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[] | Function | Function[], ...handlers: middlewareFunc | middlewareFunc[] | Function | Function[] | any): this;
    routeNotFound(handler: RouteNotFoundHandler): this;
    on(event: string | symbol, listener: EventListener): void;
    emit(event: string | symbol, ...args: any): void;
}

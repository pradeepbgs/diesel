import Trie from "./trie.js";
import { ContextType, corsT, FilterMethods, HookFunction, HookType, listenArgsT, middlewareFunc, onError, onRequest, RouteNotFoundHandler, type handlerFunction, type Hooks, type HttpMethod } from "./types.js";
import { BunRequest, Server } from "bun";
import { AdvancedLoggerOptions, LoggerOptions } from "./middlewares/logger/logger.js";
import { ServerOptions } from "http";
export default class Diesel {
    private static instance;
    fecth: ServerOptions['fetch'];
    routes: Record<string, Function>;
    private tempRoutes;
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
    private serverInstance;
    staticPath: any;
    staticFiles: any;
    user_jwt_secret: string;
    private baseApiUrl;
    private enableFileRouter;
    idleTimeOut: number;
    routeNotFoundFunc: (c: ContextType) => void | Promise<void> | Promise<Response> | Response;
    private prefixApiUrl;
    constructor({ jwtSecret, baseApiUrl, enableFileRouting, idleTimeOut, prefixApiUrl, }?: {
        jwtSecret?: string;
        baseApiUrl?: string;
        enableFileRouting?: boolean;
        idleTimeOut?: number;
        prefixApiUrl?: string;
    });
    static router(apiPath: string): Diesel;
    /**
     this filter is like user once specify which routes needs to be public and for rest routes use a global
      auth middleware .
  
      and this provides built in middleware to authenticate using jwt
    */
    setupFilter(): FilterMethods;
    redirect(incomingPath: string, redirectPath: string, statusCode?: 302): this;
    serveStatic(filePath: string): this;
    static(path: string): this;
    staticHtml(args: Record<string, string>): this;
    addHooks(typeOfHook: HookType, fnc: HookFunction | onError | onRequest): this;
    private compile;
    private registerFileRoutes;
    private loadRoutes;
    useLogger(options: LoggerOptions): this;
    useAdvancedLogger(options: AdvancedLoggerOptions): this;
    BunRoute(method: string, path: string, ...handlers: any[]): void;
    listen(port: any, ...args: listenArgsT[]): Server | void;
    fetch(): (req: BunRequest, server: Server) => Promise<any>;
    close(callback?: () => void): void;
    /**
     * Registers a router instance for subrouting.
     * Allows defining subroutes like:
     *   const userRoute = new Diesel();
     *   app.route("/api/v1/user", userRoute);
     */
    route(basePath: string | undefined, routerInstance: Diesel | null): this;
    /**
     * Registers a router instance for subrouting.
     * Allows defining subroutes like:
     *   const userRoute = new Diesel();
     *   userRoute.post("/login",handlerFunction)
     *   userRoute.post("/register", handlerFunction)
     *   app.register("/api/v1/user", userRoute);
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
     * - app.use([h1, h2]) -> Adds multiple global middlewares.
     * - app.use("/home", h1) -> Adds `h1` middleware to the `/home` path.
     * - app.use(["/home", "/user"], [h1, h2]) -> Adds `h1` and `h2` to `/home` and `/user`.
     * - app.use(h1, [h2, h1]) -> Runs `h1`, then `h2`, and `h1` again as specified.
     */
    use(pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[], handlers?: middlewareFunc | middlewareFunc[]): this;
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: string, ...handlers: handlerFunction[]): this;
    any(path: string, ...handlers: handlerFunction[]): this;
    head(path: string, ...handlers: handlerFunction[]): this;
    options(path: string, ...handlers: handlerFunction[]): this;
    propfind(path: string, ...handlers: handlerFunction[]): this;
    routeNotFound(handler: RouteNotFoundHandler): this;
    on(methods: string | (HttpMethod | string)[], path: string, ...handlers: handlerFunction[]): void;
}

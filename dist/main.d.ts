import Trie from "./trie.js";
import { corsT, FilterMethods, HookFunction, HookType, listenArgsT, middlewareFunc, onError, onRequest, type handlerFunction, type Hooks } from "./types.js";
import { Server } from "bun";
export default class Diesel {
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
    private user_jwt_secret;
    private baseApiUrl;
    private enableFileRouter;
    constructor({ jwtSecret, baseApiUrl, enableFileRouting }?: {
        jwtSecret?: string;
        baseApiUrl?: string;
        enableFileRouting?: boolean;
    });
    setupFilter(): FilterMethods;
    redirect(incomingPath: string, redirectPath: string, statusCode?: 302): this;
    serveStatic(filePath: string): this;
    static(args: Record<string, string>): this;
    addHooks(typeOfHook: HookType, fnc: HookFunction | onError | onRequest): this;
    private compile;
    private registerFileRoutes;
    private loadRoutes;
    useLogger(app: any): this;
    useAdvancedLogger(app: any): this;
    listen(port: any, ...args: listenArgsT[]): Server | void;
    close(callback?: () => void): void;
    /**
     * Registers a router instance for subrouting.
     * Allows defining subroutes like:
     *   const userRoute = new Diesel();
     *   app.route("/api/v1/user", userRoute);
     */
    route(basePath: string, routerInstance: any): this;
    /**
     * Registers a router instance for subrouting.
     * Allows defining subroutes like:
     *   const userRoute = new Diesel();
     *   userRoute.post("/login",handlerFunction)
     *   userRoute.post("/register", handlerFunction)
     *   app.register("/api/v1/user", userRoute);
     */
    register(basePath: string, routerInstance: any): this;
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
    use(pathORHandler?: string | string[] | middlewareFunc | middlewareFunc[], handlers?: middlewareFunc | middlewareFunc[]): this | void;
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: string, ...handlers: handlerFunction[]): this;
    any(path: string, ...handlers: handlerFunction[]): this;
    head(path: string, ...handlers: handlerFunction[]): this;
    options(path: string, ...handlers: handlerFunction[]): this;
    propfind(path: string, ...handlers: handlerFunction[]): this;
}

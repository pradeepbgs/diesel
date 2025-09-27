import { Server } from "bun";
import { Router } from "./router/interface";
import Diesel from "./main";
export type listenCalllBackType = () => void;
export type handlerFunction = (ctx: ContextType) => Response | Promise<Response | undefined>;
export type RouteHandler = (path: string, ...handlers: handlerFunction[] | middlewareFunc[]) => Diesel;
export type middlewareFunc = (ctx: ContextType | Request | any, server: Server) => void | Response | Promise<undefined | Response>;
export type HookFunction = (ctx: ContextType, result?: Response | null, server?: Server) => undefined | void | null | Response | Promise<void | null | undefined | Response>;
export type RouteNotFoundHandler = (ctx: ContextType) => Response | Promise<Response>;
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD" | "ANY" | "PROPFIND";
export type HttpMethodOfApp = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'any' | 'propfind';
export type HttpMethodLower = Lowercase<HttpMethod>;
export type HookType = "onRequest" | "preHandler" | "postHandler" | "onSend" | "onError" | "onClose";
export interface onError {
    (error: Error, path: string, req: Request): void | null | Response | Promise<void | null | undefined | Response>;
}
export interface onRequest {
    (ctx: ContextType): void;
}
export interface onSend {
    (ctx: ContextType, finalResult: Response): Promise<Response | undefined>;
}
export interface Hooks {
    onRequest: onRequest[];
    preHandler: HookFunction[];
    postHandler: HookFunction[];
    onSend: onSend[];
    onError: onError[];
    onClose: HookFunction[];
}
export interface ContextType {
    req: Request;
    server?: Server;
    path?: string | undefined;
    routePattern?: string | undefined;
    env?: Record<string, any>;
    executionContext?: any | undefined;
    headers: Headers;
    setHeader: (key: string, value: string) => this;
    json: (data: object, status?: number) => Response;
    text: (data: string, status?: number) => Response;
    send: <T>(data: T, status?: number) => Response;
    file: (filePath: string, mimeType?: string, status?: number) => Response;
    redirect: (path: string, status?: number) => Response;
    setCookie: (name: string, value: string, options?: CookieOptions) => this;
    ip: string | null;
    url: URL;
    query: Record<string, string>;
    params: Record<string, string>;
    set<T>(key: string, value: T): this;
    get<T>(key: string): T | undefined;
    body: Promise<any>;
    cookies: Record<string, string>;
    removeHeader: (key: string) => this;
    ejs: (viewPath: string, data: object) => Response | Promise<Response>;
    stream: (callback: () => void) => Response;
    yieldStream: (callback: () => AsyncIterable<any>) => Response;
}
export interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
}
export interface RouteHandlerT {
    method?: string;
    handler: handlerFunction;
    isDynamic?: boolean;
    path?: string;
}
export interface TempRouteEntry {
    method: string;
    handlers: handlerFunction[];
}
export interface DieselT {
    hasOnReqHook: boolean;
    hasMiddleware: boolean;
    hasPreHandlerHook: boolean;
    hasPostHandlerHook: boolean;
    hasOnSendHook: boolean;
    hasFilterEnabled: boolean;
    hooks: {
        onRequest: ((req: Request, url: URL, server: Server) => void) | null;
        preHandler: ((ctx: ContextType, server?: Server) => Response | Promise<Response>) | null;
        postHandler: ((ctx: ContextType, server?: Server) => Response | Promise<Response>) | null;
        onSend: ((ctx: ContextType, result?: Response | null, server?: Server) => Response | Promise<Response>) | null;
        onError: ((error: Error, req: Request, url: URL, server?: Server) => void | Response | Promise<Response>) | null;
        routeNotFound: ((ctx: ContextType) => Response | Promise<Response>) | null;
    };
    filters: Set<string>;
    filterFunction: Array<(ctx: ContextType, server?: Server) => void | Response | Promise<void | Response>>;
    corsConfig: corsT | null;
    globalMiddlewares: Array<(ctx: ContextType, server?: Server) => void | Promise<void | Response>>;
    middlewares: Map<string, Array<(ctx: ContextType, server?: Server) => void | Promise<void | Response>>>;
    router: Router;
    staticPath: string | null;
    staticRequestPath: string | null;
    staticFiles: Record<string, string>;
    routeNotFoundFunc: RouteNotFoundHandler;
    routerInstance: DieselT;
    tempRoutes: Map<string, TempRouteEntry>;
    routes: Record<string, Function>;
    on: () => void;
    emit: () => void;
}
export type corsT = {
    origin?: string | string[] | null;
    methods?: string | string[] | null;
    allowedHeaders?: string | string[] | null;
    exposedHeaders?: string | string[] | null;
    credentials?: boolean | null;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
} | null;
export interface FilterMethods {
    publicRoutes: (...routes: string[]) => FilterMethods;
    permitAll: () => FilterMethods;
    authenticate: (fnc?: middlewareFunc[]) => Response | Promise<Response | null> | void;
    authenticateJwt: (jwt: any) => Response | Promise<Response | null> | void;
    authenticateJwtDB: (jwt: any, UserModel: any) => Response | Promise<Response | null> | void;
}
export type listenArgsT = string | (() => void) | {
    cert?: string;
    key?: string;
};
export interface ParseBodyResult {
    error?: string;
    data?: any;
}
declare global {
    interface Request {
        [key: string]: any;
    }
}
export interface CompileConfig {
    hasMiddleware: boolean;
    hasOnReqHook: boolean;
    hasPreHandlerHook: boolean;
    hasOnError: boolean;
    hasPostHandlerHook: boolean;
    hasOnSendHook: boolean;
    hasFilterEnabled: boolean;
}
export type errorFormat = 'json' | 'text' | 'html' | string;
export interface DieselOptions {
    jwtSecret?: string;
    baseApiUrl?: string;
    enableFileRouting?: boolean;
    idleTimeOut?: number;
    prefixApiUrl?: string;
    onError?: boolean;
    logger?: boolean;
    pipelineArchitecture?: boolean;
    errorFormat?: errorFormat;
    platform?: string;
    router?: string;
    routerInstance?: Router;
}

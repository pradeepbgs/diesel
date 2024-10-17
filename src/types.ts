
export type listenCalllBackType = () => void;
export type handlerFunction = (ctx: ContextType) => Response | Promise<Response | null | void>;
export type HookFunction = (ctx:ContextType ,result?: Response | null | void,) => Response | Promise<Response | null | void>
export type onSendHookFunc = (result?: Response | null | void, ctx?:ContextType) => Response | Promise<Response | null | void>
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

export enum HookType {
    onRequest = "onRequest",
    preHandler = "preHandler",
    postHandler = "postHandler",
    onSend = "onSend",
    onError = "onError",
    onClose = "onClose",
}

export interface Hooks {
    onRequest: HookFunction | null;
    preHandler: HookFunction | null;
    postHandler: HookFunction | null;
    onSend: HookFunction | null;
    onError: HookFunction | null;
    onClose: HookFunction | null;
}

export interface ContextType {
    req: Request;
    url: URL;
    next: () => void;
    status: (status: number) => this;
    body: () => Promise<any>;
    setHeader: (key: string, value: any) => this;
    set: (key: string, value: any) => this;
    get: (key: string) => any
    setAuth: (authStatus: boolean) => this;
    getAuth: () => boolean;
    json: (data: Object, status?: number) => Response;
    text: (data: string, status?: number) => Response;
    html: (filePath: string, status?: number) => Response;
    file: (filePath: string, status?: number) => Response;
    redirect: (path: string, status?: number) => Response;
    getParams: (props?: any) => any;
    getQuery: (props?: any) => any;
    cookie: (name: string, value: string, options?: CookieOptions) => Promise<this>;
    getCookie: (cookieName?: string) => Promise<any>;
}

export interface CookieOptions { 
    maxAge?:number
    expires?:Date
    path?:string
    domain?:string
    secure?:boolean
    httpOnly?:boolean
    sameSite?: "Strict" | "Lax" | "None";
}

export interface RouteNodeType {
    path: string;
    handler: Function[]; 
    method: string[];
}

export interface RouteHandlerT{
    method:string;
    handler: (ctx:ContextType) => Promise<Response | null | void>;
    isDynamic?: boolean;
    path?:string;
}


export interface DieselT {
    hasOnReqHook: boolean;
    hasMiddleware: boolean;
    hasPreHandlerHook: boolean;
    hasPostHandlerHook: boolean;
    hasOnSendHook: boolean;
    hooks:{
        onRequest: ((ctx:ContextType) =>void) | null
        preHandler:( (ctx:ContextType) => Promise<Response | void | null>) | null
        postHandler: ((ctx: ContextType) => Promise<Response | void | null>) | null; // Updated to include Response | null
        onSend: ((ctx?: ContextType, result?: Response | null | void) => Promise<Response | void | null>) | null;
    };
    corsConfig : corsT | null
    globalMiddlewares: Array<(ctx:ContextType) => Promise<Response | null | void >>
    middlewares: Map< string , Array<(ctx:ContextType) => Promise<Response | null | void >>>
    trie: {
        search: (pathname: string, method: string) => RouteHandlerT | undefined;
    };
} 

export interface RouteCache {
    [key: string]: RouteHandlerT | undefined;
}

declare global {
    interface Request {
      routePattern?: string; // Add the custom property
    }
  }
  
export interface ParseBodyResult {
    error?: string; // Optional error field
    data?: any; // The parsed data field
    
}

export interface RouteT{
    method: string
    handler: handlerFunction
}

export type corsT = {
    origin?: string | string[] | null
    methods?: string | string[] | null
    allowedHeaders?: string | string[] | null
    exposedHeaders?: string | string[] | null
    credentials?: boolean | null;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
} | null
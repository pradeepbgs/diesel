import Diesel from "../../main";
import { ContextType } from "../../types";
type LogLevel = 'info' | 'warn' | 'error';
export type AdvancedLoggerOptions = {
    app: Diesel;
    logger?: () => void;
    logLevel?: LogLevel;
    onRequest?: (req: Request, url: URL) => void;
    onSend?: (ctx: ContextType) => Response | void | Promise<Response | void>;
    onError?: (error: Error, req: Request, url: URL) => Response | void | Promise<Response | void>;
    routeNotFound?: (ctx: ContextType) => Response | void | Promise<Response | void>;
};
export declare const advancedLogger: (options?: AdvancedLoggerOptions) => void;
export type LoggerOptions = {
    app: Diesel;
    log?: () => void;
    onRequest?: (req: Request, url: URL) => void;
    onSend?: (ctx: ContextType) => Response | Promise<Response> | void;
    onError?: (error: Error, req: Request, url: URL) => Response | Promise<Response> | void;
    routeNotFound?: (ctx: ContextType) => Response | Promise<Response> | void;
};
export declare const logger: (options: LoggerOptions) => void;
export {};

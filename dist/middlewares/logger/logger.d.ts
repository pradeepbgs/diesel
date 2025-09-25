import Diesel from "../../main";
import { ContextType } from "../../types";
type LogLevel = 'info' | 'warn' | 'error';
export type AdvancedLoggerOptions = {
    app: Diesel;
    logger?: () => void;
    logLevel?: LogLevel;
    onRequest?: (ctx: ContextType) => void;
    onSend?: (ctx: ContextType) => Response | void | Promise<Response | void>;
    onError?: (error: Error, ctx: ContextType) => Response | void | Promise<Response | void>;
};
export declare const advancedLogger: (options?: AdvancedLoggerOptions) => void;
export type LoggerOptions = {
    app: Diesel;
    log?: () => void;
    onRequest?: (req: Request, pathname: string) => void;
    onSend?: (ctx: ContextType) => Response | Promise<Response> | void;
    onError?: (error: Error, req: Request, pathname: string) => Response | Promise<Response> | void;
};
export declare const logger: (options: LoggerOptions) => void;
export {};

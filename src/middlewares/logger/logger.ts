import Diesel from "../../main";
import { ContextType } from "../../types";

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
    Error = "xxx",
}

type LogLevel = 'info' | 'warn' | 'error'

type LogMeta = {
    method?: string
    url?: string
    status?: number
    duration?: string
    error?: string
    headers?: Record<string, string | null>
}

const COLORS = {
    reset: "\x1b[0m",
    info: "\x1b[36m",   // Cyan
    warn: "\x1b[33m",   // Yellow
    error: "\x1b[31m",  // Red
    method: {
      GET: "\x1b[32m",     // Green
      POST: "\x1b[34m",    // Blue
      PUT: "\x1b[35m",     // Magenta
      DELETE: "\x1b[31m",  // Red
      PATCH: "\x1b[36m",   // Cyan
    },
  };
  


const log = (level: LogLevel, message: string, meta?: LogMeta) => {
    const color = COLORS[level] || COLORS.reset;
    const methodColor = meta?.method
        ? COLORS.method[meta.method as keyof typeof COLORS.method] || COLORS.reset
        : COLORS.reset;
    const statusColor = meta?.status
        ? meta.status >= 500
            ? COLORS.error
            : meta.status >= 400
                ? COLORS.warn
                : COLORS.info
        : COLORS.reset;

    console.log(
        `\n${color}[${level.toUpperCase()}]${COLORS.reset
        } ${message} - ${methodColor}${meta?.method || ""}${COLORS.reset}`
    );

    const formattedMeta = {
        timestamp: new Date().toISOString(),
        ...meta,
        status: meta?.status
            ? `${statusColor}${meta.status}${COLORS.reset}`
            : undefined,
        method: meta?.method
            ? `${methodColor}${meta.method}${COLORS.reset}`
            : undefined,
    };

    console.log(JSON.stringify(formattedMeta, null, 2) + "\n");
};

export type AdvancedLoggerOptions = {
    app: Diesel
    logger?: () => void;
    logLevel?: LogLevel
    onRequest?: (req: Request, url: URL) => void
    onSend?: (ctx: ContextType) => Response | void | Promise<Response | void>
    onError?: (error: Error, req: Request, url: URL) => Response | void | Promise<Response | void>
    routeNotFound?: (ctx: ContextType) => Response | void | Promise<Response | void>
}

export const advancedLogger = (options?: AdvancedLoggerOptions) => {
    const {
        app,
        logger,
        logLevel = 'info',
        onRequest,
        onSend,
        onError,
        routeNotFound,
    } = options || {};

    app?.addHooks('onRequest',(req: Request, url: URL) => {
        req.startTime = Date.now();

        logger?.() ?? log(logLevel, 'Incoming Request', {
            method: req.method,
            url: url.toString(),
            headers: {
                'user-agent': req.headers.get('user-agent'),
                'content-type': req.headers.get('content-type'),
            },
        });

        onRequest?.(req, url);
    });

    app?.addHooks('onSend', async (ctx: ContextType) => {
        const duration = `${Date.now() - ctx.req.startTime}ms`;

        logger?.() ?? log(logLevel, 'Response Sent', {
            method: ctx.req.method,
            url: ctx.url.toString(),
            status: ctx.status,
            duration,
            headers: {
                'content-type': ctx.headers.get('content-type'),
            },
        });

        const res = await onSend?.(ctx);
        if (res instanceof Response) return res;
    });

    // app?.addHooks('routeNotFound', async (ctx: ContextType) => {
    //     logger?.() ?? log('warn', 'Route Not Found', {
    //         method: ctx.req.method,
    //         url: ctx.url.toString(),
    //         status: 404,
    //     });

    //     const res = await routeNotFound?.(ctx);
    //     if (res instanceof Response) return res;
    // });

    app?.addHooks('onError', async (error: Error, req: Request, url: URL) => {
        logger?.() ?? log('error', 'Unhandled Error', {
            method: req.method,
            url: url.toString(),
            status: 500,
            error: error.message,
        });

        const res = await onError?.(error, req, url);
        if (res instanceof Response) return res;
    });
};



const logFormatted = (
    prefix: LogPrefix,
    method: string,
    path: string,
    status: number = 0,
    elapsed?: string
) => {
    const methodColor =
        COLORS.method[method as keyof typeof COLORS.method] || COLORS.reset;
    const statusColor =
        status >= 500 ? COLORS.error : status >= 400 ? COLORS.warn : COLORS.info;

    const message =
        prefix === LogPrefix.Incoming
            ? `${prefix} ${methodColor}${method}${COLORS.reset} ${path}`
            : `${prefix} ${methodColor}${method}${COLORS.reset
            } ${path} ${statusColor}${status}${COLORS.reset} ${elapsed || ""}`;
    console.log(message);
};

const timeElapsed = (start: number) => {
    const delta = Date.now() - start;
    return delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`;
};

export type LoggerOptions = {
    app: Diesel;
    log?: () => void;
    onRequest?: (req: Request, url: URL) => void;
    onSend?: (ctx: ContextType) => Response | Promise<Response> | void;
    onError?: (
        error: Error,
        req: Request,
        url: URL
    ) => Response | Promise<Response> | void;
    routeNotFound?: (ctx: ContextType) => Response | Promise<Response> | void;
};

export const logger = (options: LoggerOptions) => {
    const { app, log, onRequest, onSend, onError, routeNotFound } = options;

    app.addHooks("onRequest", (req: Request, url: URL) => {
        req.startTime = Date.now();
        log?.() ?? logFormatted(LogPrefix.Incoming, req.method, url.pathname);

        onRequest?.(req, url);
    });

    app.addHooks("onSend", async (ctx: ContextType) => {
        const { method, url } = ctx.req;
        const path = new URL(url).pathname;
        log?.() ??
            logFormatted(
                LogPrefix.Outgoing,
                method,
                path,
                ctx.status,
                timeElapsed(ctx.req.startTime)
            );

        const res = await onSend?.(ctx);
        if (res instanceof Response) return res;
    });

    // app.addHooks("routeNotFound", async (ctx: ContextType) => {
    //     log?.() ??
    //         logFormatted(
    //             "[routeNotFound]" as LogPrefix,
    //             ctx.req.method,
    //             ctx.url.pathname,
    //             404
    //         );

    //     const res = await routeNotFound?.(ctx);
    //     if (res instanceof Response) return res;
    // });

    app.addHooks("onError", async (error: Error, req: Request, url: URL) => {
        log?.() ??
            logFormatted(error.message as LogPrefix, req.method, url.toString(), 500);

        const res = await onError?.(error, req, url);
        if (res instanceof Response) return res;
    });
};

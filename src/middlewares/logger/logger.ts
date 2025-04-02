import { ContextType } from "../../types";

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
    Error = "xxx",
}

const COLORS = {
    reset: "\x1b[0m",
    info: "\x1b[34m", // Blue
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    method: {
        GET: "\x1b[32m",    // Green
        POST: "\x1b[36m",   // Cyan
        PUT: "\x1b[35m",    // Magenta
        DELETE: "\x1b[31m", // Red
    },
};

type LogLevel = "info" | "warn" | "error";

interface LogMeta {
    method?: string;
    url?: string;
    status?: number;
    duration?: string;
    headers?: Record<string, string | null>;
}

const log = (level: LogLevel, message: string, meta?: LogMeta) => {
    const color = COLORS[level] || COLORS.reset;
    const methodColor = meta?.method ? COLORS.method[meta.method as keyof typeof COLORS.method] || COLORS.reset : COLORS.reset;
    const statusColor = meta?.status 
        ? (meta.status >= 500 
            ? COLORS.error 
            : meta.status >= 400 
            ? COLORS.warn 
            : COLORS.info)
        : COLORS.reset;

    console.log(
        `\n${color}[${level.toUpperCase()}]${COLORS.reset} ${message} - ${methodColor}${meta?.method || ""}${COLORS.reset}`
    );

    const formattedMeta = {
        timestamp: new Date().toISOString(),
        ...meta,
        status: meta?.status ? `${statusColor}${meta.status}${COLORS.reset}` : undefined,
        method: meta?.method ? `${methodColor}${meta.method}${COLORS.reset}` : undefined,
    };

    console.log(JSON.stringify(formattedMeta, null, 2) + "\n");
};

export const advancedLogger = (app: any) => {
    app.addHooks("onRequest", async (req: Request, url: URL) => {
        req.startTime = Date.now();

        log("info", "Incoming Request", {
            method: req.method,
            url: url.toString(),
            headers: {
                "user-agent": req.headers.get("user-agent"),
                "content-type": req.headers.get("Content-Type"),
            },
        });
    });

    app.addHooks("onSend", (ctx: any) => {
        const duration = `${Date.now() - ctx.req.startTime}ms`;
        log("info", "Response Sent", {
            method: ctx.req.method,
            url: ctx.url,
            status: ctx.status,
            duration,
            headers: {
                "content-type": ctx.headers.get("Content-Type"),
            },
        });
    });
};

type PrintFunc = (str: string, ...rest: string[]) => void;

const logFormatted = (
    prefix: LogPrefix,
    method: string,
    path: string,
    status: number = 0,
    elapsed?: string
) => {
    const methodColor = COLORS.method[method as keyof typeof COLORS.method] || COLORS.reset;
    const statusColor = status >= 500 
        ? COLORS.error 
        : status >= 400 
        ? COLORS.warn 
        : COLORS.info;

    const message =
        prefix === LogPrefix.Incoming
            ? `${prefix} ${methodColor}${method}${COLORS.reset} ${path}`
            : `${prefix} ${methodColor}${method}${COLORS.reset} ${path} ${statusColor}${status}${COLORS.reset} ${elapsed || ""}`;
    console.log(message);
};

const timeElapsed = (start: number) => {
    const delta = Date.now() - start;
    return delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`;
};

export const logger = (app:any) => {
    
    app.addHooks('onRequest', (req: Request, url: URL) => {
        req.startTime = Date.now();
        logFormatted( LogPrefix.Incoming, req.method, new URL(url).pathname);
    })
    app.addHooks('onSend', async (ctx: ContextType) => {
        const { method, url } = ctx.req;
        const path = new URL(url).pathname;
        logFormatted( LogPrefix.Outgoing, method, path, ctx.status, timeElapsed(ctx.req.startTime));
    });
    app.addHooks('routeNotFound', (ctx: ContextType) => {
        logFormatted('[routeNotFound]' as LogPrefix, ctx.req.method, ctx.url.pathname, 404);
    })
    app.addHooks('onError', (error: any, req: Request, url: URL) => {
        logFormatted(error?.message as LogPrefix,
            req.method,
            url.toString(),
            500
        );
    });
};

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

    console.log(
        `\n${color}[${level.toUpperCase()}]${COLORS.reset} ${message} - ${methodColor}${meta?.method || ""}${COLORS.reset}`
    );

    console.log(JSON.stringify({ timestamp: new Date().toISOString(), ...meta }, null, 2) + "\n");
};

export const advancedLogger = (app: any) => {
    app.addHooks("onRequest", async (req: Request, url: URL) => {
        req.startTime = Date.now();

        log("info", "Incoming Request", {
            method: req.method,
            url: url.toString(),
            headers: {
                "user-agent": req.headers.get("user-agent"),
                "content-type": req.headers.get("content-type"),
            },
        });
    });

    app.addHooks("postHandler", (ctx: any) => {
        const duration = `${Date.now() - ctx.req.startTime}ms`;

        log("info", "Response Sent", {
            method: ctx.req.method,
            url: ctx.url,
            status: ctx.status,
            duration,
        });
    });
};

type PrintFunc = (str: string, ...rest: string[]) => void;

const logFormatted = (
    // fn: PrintFunc,
    prefix: LogPrefix,
    method: string,
    path: string,
    status: number = 0,
    elapsed?: string
) => {
    const message =
        prefix === LogPrefix.Incoming
            ? `${prefix} ${method} ${path}`
            : `${prefix} ${method} ${path} ${status} ${elapsed || ""}`;
    console.log(message);
};

const timeElapsed = (start: number) => {
    const delta = Date.now() - start;
    return delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`;
};

export const logger = (app:any) => {
    // app.addHooks('preHandler', async (ctx: ContextType) => {
    //     const { method, url } = ctx.req;
    //     const path = new URL(url).pathname;
    //     logFormatted( LogPrefix.Incoming, method, path);
    //     ctx.req.startTime = Date.now();
    // });
    app.addHooks('onRequest', (req: Request, url: URL) => {
        req.startTime = Date.now();
        logFormatted( LogPrefix.Incoming, req.method, new URL(url).pathname);
    })
    app.addHooks('postHandler', async (ctx: ContextType) => {
        const { method, url } = ctx.req;
        const path = new URL(url).pathname;
        logFormatted( LogPrefix.Outgoing, method, path, ctx.status, timeElapsed(ctx.req.startTime));
    });

    app.addHooks('onError', (error: any, req: Request, url: URL) => {
        log("error", "Error occurred", {
            method: req.method,
            url: url.toString(),
            error: error.message,
        });
    });
};

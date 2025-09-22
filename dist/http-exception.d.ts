type HTTPExceptionOptions = {
    res?: Response;
    message?: string;
    cause?: unknown;
};
export declare class HTTPException extends Error {
    readonly res?: Response;
    readonly status: number;
    constructor(status?: number, options?: HTTPExceptionOptions);
    getResponse(): Response;
}
export {};

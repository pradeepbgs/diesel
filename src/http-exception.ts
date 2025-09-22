
type HTTPExceptionOptions = {
    res?: Response
    message?: string
    cause?: unknown
}

export class HTTPException extends Error {
    readonly res?: Response
    readonly status: number

    constructor(status: number = 500, options?: HTTPExceptionOptions) {
        super(options?.message, { cause: options?.cause })
        this.name = 'HTTPException'
        this.res = options?.res
        this.status = status
    }

}
/**
 * @module
 * Request ID Middleware for Diesel.
 */

import { ContextType, middlewareFunc } from "../../types"


export type RequestIdVariables = {
  requestId: string
}

export type RequestIdOptions = {
  limitLength?: number
  headerName?: string
  generator?: (c: ContextType) => string
}

/**
 * Request ID Middleware for Diesel.
 *
 * @param {object} options - Options for Request ID middleware.
 * @param {number} [options.limitLength=255] - The maximum length of request id.
 * @param {string} [options.headerName=X-Request-Id] - The header name used in request id.
 * @param {generator} [options.generator=() => crypto.randomUUID()] - The request id generation function.
 *
 * @returns {MiddlewareHandler} The middleware handler function.
 *
 * @example
 * ```ts
 * type Variables = RequestIdVariables
 * const app = new Hono<{Variables: Variables}>()
 *
 * app.use(requestId())
 * app.get('/', (c) => {
 *   console.log(c.get('requestId')) // Debug
 *   return c.text('Hello World!')
 * })
 * ```
 */
export const requestId = ({
  limitLength = 255,
  headerName = 'X-Request-Id',
  generator = () => crypto.randomUUID(),
}: RequestIdOptions = {}): middlewareFunc => {
  return async function requestId(c:ContextType) {
    // If `headerName` is empty string, req.header will return the object
    let reqId = headerName ? c.req.headers.get(headerName) : undefined
    if (!reqId || reqId.length > limitLength || /[^\w\-]/.test(reqId)) {
      reqId = generator(c)
    }

    c.set('requestId', reqId)
    if (headerName) {
      c.setHeader(headerName, reqId)
    }
  } as middlewareFunc
}
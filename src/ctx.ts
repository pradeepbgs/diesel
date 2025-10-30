import { Server } from "bun";

import type { CookieOptions, ParseBodyResult } from "./types";
import { getMimeType } from "./utils/mimeType";

let ejsInstance: any = null;

async function getEjs() {
  if (!ejsInstance) {
    const mod = await import("ejs");
    ejsInstance = mod.default || mod;
  }
  return ejsInstance;
}

const typeMap: any = {
  string: "text/plain; charset=utf-8",
  object: "application/json; charset=utf-8",
  Uint8Array: "application/octet-stream",
  ArrayBuffer: "application/octet-stream",
};

export class Context {
  req: Request;
  server?: Server | undefined;
  path?: string | undefined;
  routePattern?: string;
  paramNames?: string[] | Record<string, string>
  env?: Record<string, any>;
  executionContext?: any | undefined;
  headers = new Headers();

  // Lazily initialized
  private parsedQuery: Record<string, string> | null = null;
  private parsedParams: Record<string, string> | null = null;
  private parsedCookies: Record<string, string> | null = null;
  private parsedBody: Promise<any> | null = null;
  private contextData: Record<string, any> = {};
  private urlObject: URL | null = null;


  constructor(
    req: Request,
    server?: Server,
    path?: string,
    routePattern?: string,
    paramNames?: string[] | Record<string, string>,
    env?: Record<string, any>,
    executionContext?: any
  ) {
    this.req = req;
    this.server = server;
    this.path = path;
    this.routePattern = routePattern;
    this.executionContext = executionContext;
    this.env = env;
    this.paramNames = paramNames
  }

  // Methods
  setHeader(key: string, value: string): this {
    this.headers.set(key, value);
    return this
  }

  removeHeader(key: string): this {
    this.headers.delete(key)
    return this
  }

  set<T>(key: string, value: T): this {
    this.contextData[key] = value;
    return this;
  }

  get<T>(key: string): T | undefined {
    return this.contextData[key];
  }

  get ip(): string | null {
    if (this.server) return this.server.requestIP(this.req)?.address ?? null;
    return this.req.headers.get("CF-Connecting-IP") || null;
  }

  get url(): URL {
    if (!this.urlObject) {
      this.urlObject = new URL(this.req.url);
    }
    return this.urlObject;
  }

  get query(): Record<string, string> {
    if (!this.parsedQuery) {
      this.parsedQuery = this.url.search ? Object.fromEntries(this.url.searchParams) : {};
    }
    return this.parsedQuery;
  }

  get params(): Record<string, string> {

    if (!Array.isArray(this.paramNames)) {
      return this.paramNames as Record<string, string>
    }
    if (!this.parsedParams) {
      try {
        this.parsedParams = extractParam(this.paramNames as any, this.path!);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Failed to extract route parameters: ${message}`);
      }
    }
    return this.parsedParams ?? {};
  }

  get body(): Promise<any> {
    if (this.req.method === "GET") {
      console.error(`you are trying to access body in GET method ${this.path}`)
      return Promise.resolve({});
    }

    if (!this.parsedBody) {
      this.parsedBody = (async () => {
        try {
          const result = await parseBody(this.req);
          if (result.error) {
            throw new Error(result.error);
          }
          return Object.keys(result).length === 0 ? null : result;
        } catch (error) {
          throw new Error("Invalid request body format");
          // const message = error instanceof Error ? error.message : String(error);
          // throw new Error(`Failed to parse request body: ${message}`);
        }
      })();
    }
    return this.parsedBody;
  }

  text(data: string, status: number = 200, customHeaders?: HeadersInit): Response {
    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        this.headers.set(key, value);
      }
    }

    if (!this.headers.has("Content-Type")) {
      this.headers.set("Content-Type", "text/plain; charset=utf-8");
    }

    return new Response(data, { status, headers: this.headers });
  }

  send<T>(data: T, status: number = 200, customHeaders?: HeadersInit): Response {
    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        this.headers.set(key, value);
      }
    }

    let dataType: string;
    if (data instanceof Uint8Array) dataType = "Uint8Array";
    else if (data instanceof ArrayBuffer) dataType = "ArrayBuffer";
    else dataType = typeof data;

    if (!this.headers.has("Content-Type")) {
      this.headers.set("Content-Type", typeMap[dataType] ?? "text/plain; charset=utf-8");
    }

    const responseData =
      dataType === "object" && data !== null
        ? JSON.stringify(data)
        : (data as any);

    return new Response(responseData, { status, headers: this.headers });
  }

  json<T>(object: T, status: number = 200, customHeaders?: HeadersInit): Response {
    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        this.headers.set(key, value);
      }
    }

    if (!this.headers.has("Content-Type")) {
      this.headers.set("Content-Type", "application/json; charset=utf-8");
    }

    return new Response(JSON.stringify(object), { status, headers: this.headers });
  }

  file(filePath: string, mimeType?: string, status: number = 200, customHeaders?: HeadersInit): Response {
    if (customHeaders) {
      for (const [key, value] of Object.entries(customHeaders)) {
        this.headers.set(key, value);
      }
    }

    if (!this.headers.has("Content-Type")) {
      this.headers.set("Content-Type", mimeType ?? getMimeType(filePath));
    }

    const file = Bun.file(filePath);
    return new Response(file, { status, headers: this.headers });
  }


  async ejs(viewPath: string, data = {}, status: number = 200): Promise<Response> {
    // this.status = status;
    const ejs = await getEjs();
    try {
      const template = await Bun.file(viewPath).text()
      const rendered = ejs.render(template, data)
      const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
      return new Response(rendered, { status, headers });
    } catch (error) {
      console.error("EJS Rendering Error:", error);
      return new Response("Error rendering template", { status: 500 });
    }
  }

  redirect(path: string, status: number = 302): Response {
    this.headers.set("Location", path);
    return new Response(null, { status, headers: this.headers });
  }

  setCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): this {

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}`;

    if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
    if (options.expires)
      cookieString += `; Expires=${options.expires.toUTCString()}`;
    if (options.path) cookieString += `; Path=${options.path}`;
    if (options.domain) cookieString += `; Domain=${options.domain}`;
    if (options.secure) cookieString += `; Secure`;
    if (options.httpOnly) cookieString += `; HttpOnly`;
    if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

    this.headers.append("Set-Cookie", cookieString);

    return this;
  }


  get cookies(): Record<string, string> {
    if (!this.parsedCookies) {
      const cookieHeader = this.req.headers.get("cookie");
      this.parsedCookies = cookieHeader ? parseCookie(cookieHeader) : {};
    }
    return this.parsedCookies;
  }

  // Streams
  stream(callback: (controller: ReadableStreamDefaultController) => void): Response {
    const headers = new Headers(this.headers);
    const stream = new ReadableStream({
      async start(controller) {
        await callback(controller);
        controller.close();
      },
    });
    return new Response(stream, { headers });
  }

  yieldStream(callback: () => AsyncIterable<any>): Response {
    return new Response(
      // {
      //   async *[Symbol.asyncIterator]() {
      //     yield* callback();
      //   },
      // },
      // { headers: this.headers }
    );
  }
}

// function parseCookie(cookieHeader: string | undefined): Record<string, string> {
//   const cookies: Record<string, string> = {};

//   const cookiesArray = cookieHeader?.split(";")!;

//   for (let i = 0; i < cookiesArray?.length!; i++) {
//     const [cookieName, ...cookieValeParts] = cookiesArray[i].trim().split("=");
//     const cookieVale = cookieValeParts?.join("=").trim();
//     if (cookieName) {
//       cookies[cookieName.trim()] = decodeURIComponent(cookieVale);
//     }
//   }

//   return cookies;
// }

function parseCookie(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader.split(";").map((cookie) => {
      const [name, ...valueParts] = cookie.trim().split("=");
      return [name, decodeURIComponent(valueParts.join("="))];
    })
  );
}

export function extractParam(paramNames: string[], incomingPath: string) {
  // ["id","name"]
  const param: Record<string, string> = {}
  // inComingpath = /user/2/pradeep
  const [pathWithoutQuery] = incomingPath.split("?");
  const pathSegments = pathWithoutQuery.split("/").filter(s => s !== '')

  // let segmentStart = 0
  // let segmentIndex = 0
  // const segments: string[] = []

  // for (let i = 0; i <= pathWithoutQuery.length; i++) {
  //   if (i === pathWithoutQuery.length || pathWithoutQuery.charCodeAt(i) === 47) { // '/'
  //     if (i > segmentStart) {
  //       segments[segmentIndex++] = pathWithoutQuery.slice(segmentStart, i)
  //     }
  //     segmentStart = i + 1
  //   }
  // }

  const start = pathSegments.length - paramNames.length

  for (let i = 0; i < paramNames.length; i++) {
    param[paramNames[i]] = pathSegments[start + i]
  }
  return param
}

export function extractDynamicParams(
  originalPath: string,
  incomingPath: string
): Record<string, string> | null {
  const params: Record<string, string> = {};
  const routeSegments = originalPath.split("/");
  const [pathWithoutQuery] = incomingPath.split("?");
  const pathSegments = pathWithoutQuery.split("/");

  if (routeSegments.length !== pathSegments.length) return null;

  for (let i = 0; i < routeSegments.length; i++) {
    const segment = routeSegments[i];
    if (segment.charCodeAt(0) === 58) {
      params[segment.slice(1)] = pathSegments[i];
    }
  }
  return params;
}

async function parseBody(req: Request): Promise<ParseBodyResult> {
  const contentType: string = req.headers.get("Content-Type") || ''
  if (!contentType) return {};

  const contentLength = req.headers.get("Content-Length");
  if (contentLength === "0" || !req.body) {
    return {};
  }

  if (contentType.startsWith("application/json")) {
    return await req.json();
  }

  if (contentType.startsWith("application/x-www-form-urlencoded")) {
    const body = await req.text();
    return Object.fromEntries(new URLSearchParams(body));
  }

  if (contentType.startsWith("multipart/form-data")) {
    const formData: any = await req.formData();
    const obj: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  return { error: "Unknown request body type" };
}
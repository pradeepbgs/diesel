import { Server } from "bun";

import type { ContextType, CookieOptions, ParseBodyResult } from "./types";
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




export default function createCtx(
  req: Request,
  server: Server,
  pathname: string,
  // onn: (event: string | symbol, listener: EventListener) => void,
  // emitter: (event: string | symbol, ...args: any) => void,
  routePattern: string | undefined
): ContextType {
  let parsedQuery: Record<string, string> | null = null;
  let parsedParams: Record<string, string> | null = null;
  let parsedCookies: Record<string, string> | null = null;
  let parsedBody: Promise<any> | null = null;
  let contextData: Record<string, any> = {};
  let urlObject: URL | null = null

  return {
    req,
    server,
    pathname,
    status: 200,
    headers: new Headers(),

    // on(event: string | symbol, listener: EventListener) {
    //   onn(event, listener)
    // },

    // emit(event: string | symbol, ...args: any) {
    //   emitter(event, ...args)
    // },

    setHeader(key: string, value: string): ContextType {
      this.headers.set(key, value);
      return this;
    },

    removeHeader(key: string): ContextType {
      this.headers.delete(key)
      return this
    },

    set<T>(key: string, value: T): ContextType {
      contextData[key] = value;
      return this;
    },

    get<T>(key: string): T | undefined {
      return contextData[key];
    },

    get ip(): string | null {
      return this.server.requestIP(req)?.address ?? null;
    },

    get url(): URL {
      if (!urlObject) {
        urlObject = new URL(req.url)
      }
      return urlObject
    },

    get query(): Record<string, string> {
      if (!parsedQuery) {
        if (!this.url.search) return {};
        parsedQuery = Object.fromEntries(this.url.searchParams);
      }
      return parsedQuery;
    },

    get params(): Record<string, string> {
      if (!parsedParams && routePattern) {
        try {
          parsedParams = extractDynamicParams(routePattern, pathname);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          throw new Error(`Failed to extract route parameters: ${message}`);
        }
      }
      return parsedParams ?? {};
    },

    get body(): Promise<any> {
      if (req.method === "GET") {
        return Promise.resolve({});
      }

      if (!parsedBody) {
        parsedBody = (async () => {
          try {
            const result = await parseBody(req);
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
      return parsedBody;
    },

    text(data: string, status: number = 200) {
      return new Response(data, {
        status,
        headers: this.headers
      });
    },

    send<T>(data: T, status: number = 200): Response {
      // this.status = status;

      // const dataType = data instanceof Uint8Array ? "Uint8Array"
      //   : data instanceof ArrayBuffer ? "ArrayBuffer"
      //     : typeof data;

      let dataType: string

      if (data instanceof Uint8Array) dataType = "Uint8Array"
      else if (data instanceof ArrayBuffer) dataType = 'ArrayBuffer'
      else dataType = typeof data

      // if (!this.headers.has("Content-Type")) {
      //   this.headers.set("Content-Type", typeMap[dataType] ?? "text/plain; charset=utf-8");
      // }

      const responseData =
        dataType === "object" && data !== null ? JSON.stringify(data) : (data as any);
      return new Response(responseData, { status, headers: this.headers });
    },

    json<T>(object: T, status: number = 200): Response {
      // this.status = status;
      // if (!this.headers.has("Content-Type")) {
      //   this.headers.set("Content-Type", "application/json; charset=utf-8");
      // }
      return Response.json(object, { status, headers: this.headers })
    },

    file(filePath: string, mime_Type?: string, status: number = 200): Response {
      // this.status = status;
      const file = Bun.file(filePath);
      if (!this.headers.has("Content-Type")) {
        this.headers.set("Content-Type", mime_Type ?? getMimeType(filePath));
      }
      return new Response(file, { status, headers: this.headers });
    },

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
    },

    redirect(path: string, status: number = 302): Response {
      // this.status = status
      this.headers.set("Location", path);
      return new Response(null, { status, headers: this.headers });
    },

    stream(callback: (controller: ReadableStreamDefaultController) => void) {
      const headers = new Headers(this.headers)
      const stream = new ReadableStream({
        async start(controller) {
          await callback(controller);
          controller.close();
        },
      });

      return new Response(stream, {
        headers
      });
    },

    yieldStream(callback: () => AsyncIterable<any>): Response {
      return new Response("not working stream yet.")
      // return new Response(
      //   {
      //     async *[Symbol.asyncIterator ]() {
      //       yield* callback();
      //     },
      //   },
      //   { headers: this.headers }
      // );
    },


    setCookie(
      name: string,
      value: string,
      options: CookieOptions = {}
    ): ContextType {

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
    },


    get cookies(): Record<string, string> {
      if (!parsedCookies) {
        const cookieHeader = this.req.headers.get("cookie");
        parsedCookies = cookieHeader ? parseCookie(cookieHeader) : {};
      }
      return parsedCookies;
    },

  };
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



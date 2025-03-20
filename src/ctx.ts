import { Server } from "bun";

import type { ContextType, CookieOptions, ParseBodyResult } from "./types";
import { getMimeType } from "./utils";

export default function createCtx(req: Request, server: Server, url: URL): ContextType {
  const headers: Headers = new Headers({ "Cache-Control": "no-cache" });
  let parsedQuery: Record<string, string> | null = null;
  let parsedParams: Record<string, string> | null = null;
  let parsedCookies: Record<string, string> | null = null;
  let parsedBody: Promise<any> | null = null;
  let contextData: Record<string, any> = {};

  return {
    req,
    server,
    url,
    status: 200,
    setHeader(key: string, value: string): ContextType {
      headers.set(key, value);
      return this;
    },

    removeHeader(key: string): ContextType {
      headers.delete(key)
      return this
    },

    get ip(): string | null {
      return this.server.requestIP(this.req)?.address ?? null;
    },

    get query(): Record<string, string> {
      if (!parsedQuery) {
        try {
          parsedQuery = Object.fromEntries(this.url.searchParams);
        } catch (error) {
          throw new Error("Failed to parse query parameters");
        }
      }
      return parsedQuery;
    },

    get params(): Record<string, string> {
      if (!parsedParams && this.req.routePattern) {
        try {
          parsedParams = extractDynamicParams(this.req.routePattern, this.url.pathname);
        } catch (error) {
          throw new Error("Failed to extract route parameters");
        }
      }
      return parsedParams ?? {};
    },

    get body(): Promise<any> {
      if (this.req.method === "GET") {
        return Promise.resolve({});
      }
      if (!parsedBody) {
        parsedBody = (async () => {
          const result = await parseBody(this.req);
          if (result.error) {
            throw new Error(result.error);
          }
          return Object.keys(result).length === 0 ? null : result;
        })();
      }
      return parsedBody;
    },

    set<T>(key: string, value: T): ContextType {
      contextData[key] = value;
      return this;
    },

    get<T>(key: string): T | undefined {
      return contextData[key];
    },

    text(data: string, status?: number) {
      if(status) this.status = status
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "text/plain; charset=utf-8")
      }
      return new Response(data, {
        status: this.status,
        headers
      });
    },

    send<T>(data: T, status?: number): Response {
      if(status) this.status = status;
      const typeMap = new Map<string, string>([
        ["string", "text/plain; charset=utf-8"],
        ["object", "application/json; charset=utf-8"],
        ["Uint8Array", "application/octet-stream"],
        ["ArrayBuffer", "application/octet-stream"],
      ]);

      const dataType = data instanceof Uint8Array ? "Uint8Array"
        : data instanceof ArrayBuffer ? "ArrayBuffer"
          : typeof data;

      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", typeMap.get(dataType) ?? "text/plain; charset=utf-8");
      }

      const responseData = dataType === "object" && data !== null ? JSON.stringify(data) : (data as any);
      return new Response(responseData, { status: this.status, headers });
    },

    json<T>(data: T, status?:number): Response {
      if(status) this.status = status;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), { status: this.status, headers });
    },

    file(filePath: string, mime_Type?: string,status?: number): Response {
      if(status) this.status = status;
      const file = Bun.file(filePath);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", mime_Type ?? getMimeType(filePath));
      }
      return new Response(file, { status: this.status, headers });
    },

    async ejs(viewPath: string, data = {}, status?: number): Promise<Response> {
      if(status) this.status = status;
      let ejs;
      try {
        ejs = await import('ejs')
        ejs = ejs.default || ejs
      } catch (error) {
        console.error("EJS not installed! Please run `bun add ejs`");
        return new Response("EJS not installed! Please run `bun add ejs`", { status: 500 });
      }

      try {
        const template = await Bun.file(viewPath).text()
        const rendered = ejs.render(template, data)
        const headers = new Headers({ "Content-Type": "text/html; charset=utf-8" });
        return new Response(rendered, { status: this.status, headers });
      } catch (error) {
        console.error("EJS Rendering Error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    },

    redirect(path: string, status?: number): Response {
      if(status) this.status=status
      else this.status = 302;
      
      headers.set("Location", path);
      return new Response(null, { status: this.status, headers });
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

      headers.append("Set-Cookie", cookieString);

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

function extractDynamicParams(
  routePattern: any,
  path: string
): Record<string, string> | null {
  const params: Record<string, string> = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?");
  const pathSegments = pathWithoutQuery.split("/");

  if (routeSegments.length !== pathSegments.length) {
    return null;
  }

  for (let i = 0; i < routeSegments.length; i++) {
    if (routeSegments[i].startsWith(":")) {
      params[routeSegments[i].slice(1)] = pathSegments[i];
    }
  }

  return params;
}

async function parseBody(req: Request): Promise<ParseBodyResult> {
  const contentType: string = req.headers.get("Content-Type")!;
  if (!contentType) return {};

  const contentLength = req.headers.get("Content-Length");
  if (contentLength === "0" || !req.body) {
    return {};
  }

  try {
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
  } catch (error) {
    return { error: "Invalid request body format" };
  }
}

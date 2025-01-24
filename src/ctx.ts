import { Server } from "bun";

import type { ContextType, CookieOptions, ParseBodyResult } from "./types";
import { getMimeType } from "./utils";

export default function createCtx(req: Request, server: Server, url: URL): ContextType {
  const headers: Headers = new Headers({
    "X-Powered-By": "DieselJS", // Branding header
    "Cache-Control": "no-cache", // Prevent caching for dynamic responses
  });
  let parsedQuery: any = null;
  let parsedCookie: any = null;
  let parsedParams: any;
  let parsedBody: any
  let contextData: Record<string, any> = {};
  return {
    req,
    server,
    url,

    setHeader(key: string, value: any): ContextType {
      headers.set(key, value);
      return this;
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
      if (!parsedBody) {
        parsedBody = (async () => {
            const result = await parseBody(this.req);
            if (result.error) {
              throw new Error(result.error);
            }
            if (result.error) {
              throw new Error(result.error);
            }
            return result;
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
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "text/plain; charset=utf-8")
      }
      return new Response(data, {
        status,
        headers
      });
    },

    send(data: any, status?: number): Response {
      if (typeof data === "string") {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "text/plain; charset=utf-8");
        }
      } else if (typeof data === "object") {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/json; charset=utf-8");
        }
        data = JSON.stringify(data);
      } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
        if (!headers.has("Content-Type")) {
          headers.set("Content-Type", "application/octet-stream");
        }
      }
      return new Response(data, { status,headers,});
    },

    json(data: any, status?: number): Response {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), {status, headers });
    },

    file(filePath: string, status: number = 200, mime_Type?: string): Response {
      const mimeType = getMimeType(filePath);
      const file = Bun.file(filePath);

      const headers = new Headers();
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", mime_Type ?? mimeType);
      }

      return new Response(file, {status,headers,});
    },

    redirect(path: string, status?: number): Response {
      headers.set("Location", path);
      return new Response(null, {
        status: status ?? 302,
        headers,
      });
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

      headers?.append("Set-Cookie", cookieString);

      return this;
    },


    get cookies(): Record<string, string> | undefined {
      if (!parsedCookie) {
        const cookieHeader = this.req.headers.get("cookie");
        if (cookieHeader) {
          parsedCookie = parseCookie(cookieHeader);
        } else {
          return {};
        }
      }
      return parsedCookie;
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

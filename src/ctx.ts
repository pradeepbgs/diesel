import { Server } from "bun";
import type { ContextType, CookieOptions, ParseBodyResult } from "./types";

export default function createCtx(req: Request, server:Server ,url: URL): ContextType {
  let headers: Headers = new Headers()
  let settedValue: Record<string, string> = {};
  let isAuthenticated: boolean = false;
  let parsedQuery: any 
  let parsedCookie: any = null
  let parsedParams: any 
  let parsedBody: ParseBodyResult | null;
  let responseStatus: number = 200;
  let user : any = {}

  return {
    req,
    server,
    url,
   
    // all methods starts from here

    getUser () {
      return user;
    },

    setUser(data?:any){
     if (data) {
       user = data
     }
    },

    status(status: number): ContextType {
      responseStatus = status;
      return this;
    },

    getIP(){
      return this.server.requestIP(this.req)
    },

    async body(): Promise<any> {
      if (!parsedBody) {
        parsedBody = await parseBody(req);
      }
      if (parsedBody.error) {
        return new Response(JSON.stringify({ error: parsedBody.error }), {
          status: 400,
        });
      }
      return parsedBody;
    },

    setHeader(key: string, value: any): ContextType {
      headers.set(key, value)
      return this;
    },

    set(key: string, value: any): ContextType {
      settedValue[key] = value;
      return this;
    },

    get(key: string): any | null {
      return settedValue[key] || null;
    },

    setAuth(authStatus: boolean): ContextType {
      isAuthenticated = authStatus;
      return this;
    },

    getAuth(): boolean {
      return isAuthenticated;
    },

    // Response methods with optional status
    text(data: string, status?: number) {
      return new Response(data, {
        status: status ?? responseStatus,
        headers
      });
    },

    send(data: string, status?: number) {
      return new Response(data, {
        status: status ?? responseStatus,
        headers
      });
    },

    json(data: any, status?: number): Response {
      return new Response(JSON.stringify(data), {
        status: status ?? responseStatus,
        headers
      });
    },

    html(filepath: string, status?: number): Response {
      return new Response(Bun.file(filepath), {
        status: status ?? responseStatus,
        headers
      });
    },

    file(filePath: string, status?: number): Response {
      return new Response(Bun.file(filePath), {
        status: status ?? responseStatus,
        headers
      });
    },

    redirect(path: string, status?: number): Response {
      headers.set('Location', path);
      return new Response(null, {
        status: status ?? 302,
        headers
      });
    },

    getParams(props: string)
      : string | Record<string, string> | {} {
      if (!parsedParams) {
        parsedParams = extractDynamicParams(req?.routePattern, url?.pathname);
      }
      return props ? parsedParams[props] || {} : parsedParams;
    },

    getQuery(props?: any)
      : string | Record<string, string> | {} {
      try {
        if (!parsedQuery) {
          parsedQuery = Object.fromEntries(url.searchParams);
        }
        return props ? parsedQuery[props] || {} : parsedQuery;
      } catch (error) {
        return {}
      }
    },

    cookie(name: string, value: string, options: CookieOptions = {}) {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      // Add options to cookie string (e.g., expiration, path, HttpOnly, etc.)
      if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
      if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
      if (options.path) cookieString += `; Path=${options.path}`;
      if (options.domain) cookieString += `; Domain=${options.domain}`;
      if (options.secure) cookieString += `; Secure`;
      if (options.httpOnly) cookieString += `; HttpOnly`;
      if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

      headers?.append('Set-Cookie', cookieString)
      
      return this;
    },

    getCookie(cookieName?: string){
      if (!parsedCookie || Object.keys(parsedCookie).length === 0) {
        const cookieHeader = req.headers?.get("cookie")
        if (cookieHeader) {
          parsedCookie = parseCookie(cookieHeader);
        } else {
          return null
        }
      }
      if (!parsedCookie) {
        return null
      }
      return cookieName ? (parsedCookie[cookieName] !== undefined ? parsedCookie[cookieName] : null) : parsedCookie;
    },
  };
}


function parseCookie(header: string | undefined)
  : Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;

  const cookieArray = header.split(";");
  cookieArray.forEach((cookie) => {
    const [cookieName, cookieValue] = cookie?.trim()?.split("=");
    if (cookieName && cookieValue) {
      cookies[cookieName.trim()] = cookieValue.split(' ')[0].trim()
    }
  });
  return cookies;
}

function extractDynamicParams(routePattern: any, path: string)
  : Record<string, string> | null {
  const object: Record<string, string> = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?");
  const pathSegments = pathWithoutQuery.split("/");

  if (routeSegments.length !== pathSegments.length) {
    return null;
  }

  routeSegments.forEach((segment: string, index: number) => {
    if (segment.startsWith(":")) {
      const dynamicKey = segment.slice(1);
      object[dynamicKey] = pathSegments[index];
    }
  });

  return object;
}

async function parseBody(req: Request)
  : Promise<ParseBodyResult> {
  const contentType: string = req.headers.get("Content-Type") || "";

  if (!contentType) return {};

  try {
    if (contentType.startsWith("application/json")) {
      return await req.json();
    }

    if (contentType.startsWith("application/x-www-form-urlencoded")) {
      const body = await req.text();
      return Object.fromEntries(new URLSearchParams(body));
    }

    if (contentType.startsWith("multipart/form-data")) {
      const formData = await req.formData();
      return formDataToObject(formData);
    }

    return { error: "Unknown request body type" };
  } catch (error) {
    return { error: "Invalid request body format" };
  }
}


function formDataToObject(formData: any): Record<string, string> {
  const obj: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

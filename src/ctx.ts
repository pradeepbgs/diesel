import type { ContextType, CookieOptions, ParseBodyResult } from "./types";

export default function createCtx(req: Request, url: URL): ContextType {
  let headers: any = {};
  let settedValue: Record<string, string> = {};
  let isAuthenticated = false;
  let parsedQuery: any = null;
  let parsedCookie: any = null
  let parsedParams: any = null;
  let parsedBody: ParseBodyResult | null;
  let responseStatus = 200;

  return {
    req,
    url,
    next: () => { },

    // Set response status for chaining
    status(status: number) {
      responseStatus = status;
      return this;
    },

    async body(): Promise<any> {
      if (!parsedBody) {
        parsedBody = await parseBody(req);
      }
      if (parsedBody.error) {
        return new Response(JSON.stringify({ error: parsedBody.error }), {
          status: 400, // Bad Request
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      return parsedBody;
    },

    setHeader(key: string, value: any) {
      headers[key] = value;
      return this;
    },

    set(key: string, value: any) {
      settedValue[key] = value;
      return this;
    },

    get(key: string) {
      return settedValue[key] || null;
    },

    setAuth(authStatus: boolean) {
      isAuthenticated = authStatus;
      return this;
    },

    getAuth() {
      return isAuthenticated;
    },

    // Response methods with optional status
    text(data: string, status?: number) {
      if (status) {
        responseStatus = status;
      }
      return new Response(data, {
        status: responseStatus,
        headers: headers,
      });
    },

    json(data: any, status?: number) {
      if (status) {
        responseStatus = status;
      }
      return new Response(JSON.stringify(data), {
        status: responseStatus,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },

    html(filepath: string, status?: number) {
      if (status) {
        responseStatus = status;
      }
      return new Response(Bun.file(filepath), {
        status: responseStatus,
        headers: {
          ...headers,
        },
      });
    },

    file(filePath: string, status?: number) {
      if (status) {
        responseStatus = status;
      }
      return new Response(Bun.file(filePath), {
        status: responseStatus,
        headers: {
          ...headers,
        },
      });
    },

    redirect(path: string, status?: number) {
      if (status) {
        responseStatus = status;
      }
      return new Response(null, {
        status: responseStatus,
        headers: {
          Location: path,
          ...headers,
        },
      });
    },

    getParams(props: string)
      : string | Record<string, string> | null {
      if (!parsedParams) {
        parsedParams = extractDynamicParams(req?.routePattern, url?.pathname);
      }
      return props ? parsedParams[props] || null : parsedParams;
    },

    getQuery(props?: any)
      : string | Record<string, string> | null {
      if (!parsedQuery) {
        parsedQuery = Object.fromEntries(url.searchParams);
      }
      return props ? parsedQuery[props] || null : parsedQuery;
    },

    async cookie(name: string, value: string, options: CookieOptions = {}) {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      // Add options to cookie string (e.g., expiration, path, HttpOnly, etc.)
      if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
      if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
      if (options.path) cookieString += `; Path=${options.path}`;
      if (options.domain) cookieString += `; Domain=${options.domain}`;
      if (options.secure) cookieString += `; Secure`;
      if (options.httpOnly) cookieString += `; HttpOnly`;
      if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

      if (headers["Set-Cookie"]) {
        const existingCookies = Array.isArray(headers["Set-Cookie"]) ? headers["Set-Cookie"] : [headers["Set-Cookie"]];
        existingCookies.push(cookieString);
        headers["Set-Cookie"] = existingCookies;
      } else {
        headers["Set-Cookie"] = cookieString;
      }
      return this;
    },

    async getCookie(cookieName?: string)
      : Promise<string | Record<string, string> | null> {
      if (!parsedCookie) {
        const cookieHeader = req.headers.get("cookie")
        if (cookieHeader) {
          parsedCookie = await parseCookie(cookieHeader);
        }
      }
      return cookieName ? parsedCookie[cookieName] || null : parsedCookie;
    },
  };
}


async function parseCookie(header: string | undefined)
  : Promise<Record<string, string>> {
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

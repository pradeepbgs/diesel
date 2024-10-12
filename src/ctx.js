export default function createCtx(req, url) {
  let headers = {};
  let settedValue = {};
  let isAuthenticated = false;
  let parsedQuery = null;
  let parsedCookie = null;
  let parsedParams = null;
  let parsedBody = null;
  let responseStatus = 200; // Default status

  return {
    req,
    url,
    next: () => {},

    // Set response status for chaining
    status(status) {
      responseStatus = status; 
      return this; 
    },

    async body() {
      if (!parsedBody) {
        parsedBody = await parseBody(req);
      }
      return parsedBody;
    },

    setHeader(key, value) {
      headers[key] = value;
      return this; 
    },

    set(key, value) {
      settedValue[key] = value;
      return this; 
    },

    get(key) {
      return settedValue[key];
    },

    setAuth(authStatus) {
      isAuthenticated = authStatus;
      return this; 
    },

    getAuth() {
      return isAuthenticated;
    },

    // Response methods with optional status
    text(data, status) {
      if (status) {
        responseStatus = status; 
      }
      return new Response(data, {
        status: responseStatus,
        headers: headers,
      });
    },

    json(data, status) {
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

    html(filepath, status) {
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

    file(filePath, status) {
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

    redirect(path, status) {
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

     getParams(props) {
      if (!parsedParams) {
        parsedParams = extractDynamicParams(req.routePattern, url.pathname);
      }
      return props ? parsedParams[props] : parsedParams;
    },

    getQuery(props) {
      if (!parsedQuery) {
        parsedQuery = Object.fromEntries(url.searchParams);
      }
      return props ? parsedQuery[props] : parsedQuery;
    },

    async cookie(name, value, options = {}) {
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

    async getCookie(cookieName) {
      if (!parsedCookie) {
        parsedCookie = await parseCookie(req.headers.get("cookie"));
      }
      return cookieName ? parsedCookie[cookieName] : parsedCookie;
    },
  };
}


async function parseCookie(header) {
  const cookies = {};
  if (!header) return cookies;

  const cookieArray = header.split(";");
  cookieArray.forEach((cookie) => {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    cookies[cookieName] = cookieValue.split(" ")[0];
  });
  return cookies;
}

function extractDynamicParams(routePattern, path) {
  const object = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?"); 
  const pathSegments = pathWithoutQuery.split("/");

  if (routeSegments.length !== pathSegments.length) {
    return null; 
  }

  routeSegments.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      const dynamicKey = segment.slice(1); 
      object[dynamicKey] = pathSegments[index];
    }
  });

  return object;
}

async function parseBody(req) {
  const contentType = req.headers.get("Content-Type") || "";

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

    return new Response({ error: "Unknown request body type" });
  } catch (error) {
    return new Response({ error: "Invalid request body format" });
  }
}


function formDataToObject(formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

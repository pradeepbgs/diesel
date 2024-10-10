export default async function createCtx(req, url) {
  let headers = {};
  let settedValue = {};
  let isAuthenticated = false;
  let parsedQuery = null;
  let parsedCookie = null;
  let parsedParams = null;

  if (req.method !== "GET") {
    req.parsedBody = await parseBody(req);
  }
  return {
    req,
    url,
    next: () => {},

    body() {
      return req.parsedBody;
    },
    setHeader(key, value) {
      headers[key] = value;
    },

    set(key, value) {
      settedValue[key] = value;
    },

    get(key) {
      return settedValue[key];
    },

    setAuth(authStatus) {
      isAuthenticated = authStatus;
    },

    getAuth() {
      return isAuthenticated;
    },

    text(data, status = 200) {
      return new Response(data, {
        status,
        headers: headers,
      });
    },

    json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
    },

    html(filepath) {
      return new Response(Bun.file(filepath), {
        status: 200,
        headers: {
          ...headers,
        },
      });
    },
    file(filePath) {
      return new Response(Bun.file(filePath), {
        status: 200,
        headers: {
          ...headers,
        },
      });
    },

    redirect(path, status = 302) {
      return new Response(null, {
        status,
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
      return props ? req.params[props] : req.params;
    },

    getQuery(props) {
      if (!parsedQuery) {
        parsedQuery = Object.fromEntries(url.searchParams.entries());
      }
      return props ? parsedQuery[props] : parsedQuery;
    },

    cookie(name, value, options = {}) {
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
        // If it's already an array, push the new cookie, otherwise convert to array
        const existingCookies = Array.isArray(headers["Set-Cookie"]) ? headers["Set-Cookie"] : [headers["Set-Cookie"]];

        // Add the new cookie string to the array
        existingCookies.push(cookieString);

        // Update Set-Cookie header
        headers["Set-Cookie"] = existingCookies;
      } else {
        // If no cookies exist, initialize the header
        headers["Set-Cookie"] = cookieString;
      }
    },
    getCookie(cookieName) {
      if (!parsedCookie) {
        parsedCookie = parseCookie(req.headers.get("cookie"));
      }
      return cookieName ? parsedCookie[cookieName] : parsedCookie;
    },
  };
}

function parseCookie(header) {
  const cookies = {};
  if (!header) return cookies;

  const cookieArray = header.split(";");
  cookieArray.forEach((cookie) => {
    const [cookieName, cookievalue] = cookie.trim().split("=");
    cookies[cookieName] = cookievalue.split(" ")[0];
  });
  return cookies;
}

const extractDynamicParams = (routePattern, path) => {
  const object = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?"); // Ignore the query string in the path
  const pathSegments = pathWithoutQuery.split("/"); // Re-split after removing query

  if (routeSegments.length !== pathSegments.length) {
    return null; // Path doesn't match the pattern
  }

  routeSegments.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      const dynamicKey = segment.slice(1); // Remove ':' to get the key name
      object[dynamicKey] = pathSegments[index]; // Map the path segment to the key
    }
  });

  return object;
};

async function parseBody(req) {
  const contentType = req.headers.get("Content-Type");
  if (contentType.includes("application/json")) {
    try {
      return await req.json();
    } catch (error) {
      return new Response({ error: "Invalid JSON format" });
    }
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    const body = await req.text();
    return Object.fromEntries(new URLSearchParams(body));
  } else if (contentType.startsWith("multipart/form-data")) {
    const formData = await req.formData();
    return formDataToObject(formData);
  } else {
    return new Response({ error: "unknown request body" });
  }
}

function formDataToObject(formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

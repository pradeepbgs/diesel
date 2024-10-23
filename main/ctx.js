var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default function createCtx(req, server, url) {
    let headers = new Headers();
    let settedValue = {};
    let isAuthenticated = false;
    let parsedQuery = null;
    let parsedCookie = null;
    let parsedParams = null;
    let parsedBody;
    let responseStatus = 200;
    return {
        req,
        server,
        url,
        next: () => { },
        // Set response status for chaining
        status(status) {
            responseStatus = status;
            return this;
        },
        getIP() {
            return this.server.requestIP(this.req);
        },
        body() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!parsedBody) {
                    parsedBody = yield parseBody(req);
                }
                if (parsedBody.error) {
                    return new Response(JSON.stringify({ error: parsedBody.error }), {
                        status: 400, // Bad Request
                    });
                }
                return parsedBody;
            });
        },
        setHeader(key, value) {
            headers.set(key, value);
            return this;
        },
        set(key, value) {
            settedValue[key] = value;
            return this;
        },
        get(key) {
            return settedValue[key] || null;
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
            return new Response(data, {
                status: status !== null && status !== void 0 ? status : responseStatus,
                headers
            });
        },
        json(data, status) {
            return new Response(JSON.stringify(data), {
                status: status !== null && status !== void 0 ? status : responseStatus,
                headers
            });
        },
        html(filepath, status) {
            return new Response(Bun.file(filepath), {
                status: status !== null && status !== void 0 ? status : responseStatus,
                headers
            });
        },
        file(filePath, status) {
            return new Response(Bun.file(filePath), {
                status: status !== null && status !== void 0 ? status : responseStatus,
                headers
            });
        },
        redirect(path, status) {
            headers.set('Location', path);
            return new Response(null, {
                status: status !== null && status !== void 0 ? status : 302,
                headers
            });
        },
        getParams(props) {
            if (!parsedParams) {
                parsedParams = extractDynamicParams(req === null || req === void 0 ? void 0 : req.routePattern, url === null || url === void 0 ? void 0 : url.pathname);
            }
            return props ? parsedParams[props] || null : parsedParams;
        },
        getQuery(props) {
            if (!parsedQuery) {
                parsedQuery = Object.fromEntries(url.searchParams);
            }
            return props ? parsedQuery[props] || null : parsedQuery;
        },
        cookie(name_1, value_1) {
            return __awaiter(this, arguments, void 0, function* (name, value, options = {}) {
                let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
                // Add options to cookie string (e.g., expiration, path, HttpOnly, etc.)
                if (options.maxAge)
                    cookieString += `; Max-Age=${options.maxAge}`;
                if (options.expires)
                    cookieString += `; Expires=${options.expires.toUTCString()}`;
                if (options.path)
                    cookieString += `; Path=${options.path}`;
                if (options.domain)
                    cookieString += `; Domain=${options.domain}`;
                if (options.secure)
                    cookieString += `; Secure`;
                if (options.httpOnly)
                    cookieString += `; HttpOnly`;
                if (options.sameSite)
                    cookieString += `; SameSite=${options.sameSite}`;
                headers === null || headers === void 0 ? void 0 : headers.append('Set-Cookie', cookieString);
                return this;
            });
        },
        getCookie(cookieName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!parsedCookie) {
                    const cookieHeader = req.headers.get("cookie");
                    if (cookieHeader) {
                        parsedCookie = yield parseCookie(cookieHeader);
                    }
                }
                return cookieName ? parsedCookie[cookieName] || null : parsedCookie;
            });
        },
    };
}
function parseCookie(header) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = {};
        if (!header)
            return cookies;
        const cookieArray = header.split(";");
        cookieArray.forEach((cookie) => {
            var _a;
            const [cookieName, cookieValue] = (_a = cookie === null || cookie === void 0 ? void 0 : cookie.trim()) === null || _a === void 0 ? void 0 : _a.split("=");
            if (cookieName && cookieValue) {
                cookies[cookieName.trim()] = cookieValue.split(' ')[0].trim();
            }
        });
        return cookies;
    });
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
function parseBody(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentType = req.headers.get("Content-Type") || "";
        if (!contentType)
            return {};
        try {
            if (contentType.startsWith("application/json")) {
                return yield req.json();
            }
            if (contentType.startsWith("application/x-www-form-urlencoded")) {
                const body = yield req.text();
                return Object.fromEntries(new URLSearchParams(body));
            }
            if (contentType.startsWith("multipart/form-data")) {
                const formData = yield req.formData();
                return formDataToObject(formData);
            }
            return { error: "Unknown request body type" };
        }
        catch (error) {
            return { error: "Invalid request body format" };
        }
    });
}
function formDataToObject(formData) {
    const obj = {};
    for (const [key, value] of formData.entries()) {
        obj[key] = value;
    }
    return obj;
}

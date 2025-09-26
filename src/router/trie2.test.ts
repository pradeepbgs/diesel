import { describe, expect, test, beforeAll } from "bun:test";
import { TrieRouter2 } from "./trie2";
import { ContextType } from "../types";

let router: TrieRouter2;

beforeAll(() => {
    router = new TrieRouter2();

    // Static routes
    router.add("GET", "/", () => "root");
    router.add("GET", "/about", () => "about page");
    router.add("GET", "/user/profile", () => "static profile");

    // Dynamic route
    router.add("GET", "/user/:id", () => "dynamic user");

    // Wildcard
    router.add("GET", "/files/*", () => "catch all");

    // Multiple methods
    router.add("GET", "/api/data", () => "GET handler");
    router.add("POST", "/api/data", () => "POST handler");

    // Deeply nested dynamic route
    router.add("GET", "/a/:b/c/:d/e", () => "nested");
});

describe("TrieRouter2 - Router Tests", () => {
    const runHandlers = (handlers: any, ctx: any) => {
        let result: any;
        for (const h of handlers) {
            result = h(ctx);
        }
        return result;
    };

    test("should match root '/' route", () => {
        const result = router.find("GET", "/");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("root");
    });

    test("should match static routes", () => {
        const result = router.find("GET", "/about");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("about page");
    });

    test("should match dynamic route", () => {
        const result = router.find("GET", "/user/123");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("dynamic user");
    });

    test("should match wildcard route", () => {
        const result = router.find("GET", "/files/images/2025/photo.png");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("catch all");
    });

    test("should correctly handle multiple HTTP methods on same path", () => {
        const getResult = router.find("GET", "/api/data");
        const postResult = router.find("POST", "/api/data");

        expect(getResult ? runHandlers(getResult.handler, {} as any) : null).toBe("GET handler");
        expect(postResult ? runHandlers(postResult.handler, {} as any) : null).toBe("POST handler");
    });

    test("should return null when method does not match", () => {
        const result = router.find("PUT", "/api/data");
        expect(result?.handler).toBeDefined()
        expect(result?.handler).toHaveLength(0)
    });

    test("should handle deeply nested dynamic route", () => {
        const result = router.find("GET", "/a/123/c/456/e");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("nested");
    });

    test("should prefer exact match over dynamic match", () => {
        const result = router.find("GET", "/user/profile");
        expect(result ? runHandlers(result.handler, {} as any) : null).toBe("static profile");
    });

    test("should return null for non-existent route", () => {
        const result = router.find("GET", "/non-existent");
        expect(result?.handler).toBeDefined()
        expect(result?.handler).toHaveLength(0)
    });
});



describe("TrieRouter2 - with Middlewares check", () => {
    let router: TrieRouter2;

    beforeAll(() => {
        router = new TrieRouter2();

        // Add global middlewares
        router.addMiddleware("/", (ctx: any) => {
            const val = ctx.get("val") || "";
            ctx.set("val", val + "mw1;");
        });

        router.addMiddleware("/", (ctx: any) => {
            const val = ctx.get("val") || "";
            ctx.set("val", val + "mw2;");
        });

        router.addMiddleware("/user/*", (ctx: ContextType) => {
            ctx.set("/user/*", "/user/* middleware")
        })

        router.addMiddleware("/user/:id", (ctx: ContextType) => {
            const params = ctx.params.id
            ctx.set('id', params)
        })

        router.addMiddleware('/user/static', (ctx: ContextType) => {
            return "user/static"
        })

        router.add('GET', '/user/:id', (ctx: ContextType | any) => {
            const param = ctx.get('id')
            return param
        })
        router.add('GET', '/user/static', () => {
            return "user/static"
        })
        // Add route handler
        router.add("GET", "/", (ctx: any) => {
            const val = ctx.get("val") || "";
            ctx.set("val", val + "handler;");
            return ctx.get("val");
        });
    });

    test("should run all middlewares in order before handler", () => {
        const result = router.find("GET", "/");

        // Create a fake context with get/set
        const ctx = {
            store: {} as Record<string, any>,
            get(key: string) { return this.store[key]; },
            set(key: string, value: any) { this.store[key] = value; }
        };

        let output: any = "";

        if (result?.handler.length) {
            // invoke all handlers (middlewares + final handler)
            for (const fn of result?.handler as any) {
                output = fn(ctx);
            }
        }

        expect(output).toBe("mw1;mw2;handler;");
    });

    test("should return middlewares for non-existent route", () => {
        const result = router.find("GET", "/non-existent");
        expect(result?.handler).toBeDefined();
        expect(result!.handler).toHaveLength(2);
    });

    test("should return middlewares array when method does not match", () => {
        const result = router.find("POST", "/");
        expect(result?.handler).toBeDefined();
        expect(result!.handler).toHaveLength(2);
    });

    test("should run wildcard and dynamic middlewares correctly", () => {
        const ctx1 = {
            store: {} as Record<string, any>,
            params: { id: "123" },
            get(key: string) { return this.store[key]; },
            set(key: string, value: any) { this.store[key] = value; }
        };

        const result1 = router.find("GET", "/user/123");
        if (result1?.handler.length) {
            for (const fn of result1.handler as any) fn(ctx1);
        }
        expect(ctx1.get("/user/*")).toBe("/user/* middleware");
        expect(ctx1.get("id")).toBe("123");

        const ctx2 = {
            store: {} as Record<string, any>,
            params: {},
            get(key: string) { return this.store[key]; },
            set(key: string, value: any) { this.store[key] = value; }
        };

        const result2 = router.find("GET", "/user/static");
        let output: any;
        if (result2?.handler.length) {
            for (const fn of result2.handler as any) {
                output = fn(ctx2);
            }
        }
        expect(output).toBe("user/static");
    });


});
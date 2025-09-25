import { describe, expect, test, beforeAll } from "bun:test";
import { TrieRouter2 } from "./trie2";

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
  test("should match root '/' route", () => {
    const result = router.find("GET", "/");
    expect(result?.handler({} as any) as any).toBe("root");
  });

  test("should match static routes", () => {
    const result = router.find("GET", "/about");
    expect(result?.handler({} as any) as any).toBe("about page");
  });

  test("should match dynamic route", () => {
    const result = router.find("GET", "/user/123");
    expect(result?.handler({} as any) as any).toBe("dynamic user");
  });

  test("should match wildcard route", () => {
    const result = router.find("GET", "/files/images/2025/photo.png");
    expect(result?.handler({} as any) as any).toBe("catch all");
  });

  test("should correctly handle multiple HTTP methods on same path", () => {
    const getResult = router.find("GET", "/api/data");
    const postResult = router.find("POST", "/api/data");

    expect(getResult?.handler({} as any) as any).toBe("GET handler");
    expect(postResult?.handler({} as any) as any).toBe("POST handler");
  });

  test("should return null when method does not match", () => {
    const result = router.find("PUT", "/api/data");
    expect(result).toBeNull();
  });

  test("should handle deeply nested dynamic route", () => {
    const result = router.find("GET", "/a/123/c/456/e");
    expect(result?.handler({} as any) as any).toBe("nested");
  });

  test("should prefer exact match over dynamic match", () => {
    const result = router.find("GET", "/user/profile");
    expect(result?.handler({} as any) as any).toBe("static profile");
  });

  test("should return null for non-existent route", () => {
    const result = router.find("GET", "/non-existent");
    expect(result).toBeNull();
  });
});

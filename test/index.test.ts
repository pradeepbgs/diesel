import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import {app} from './server'
const port = process.env.PORT || 3000
beforeAll(async () => {
  app.listen( port as number, () => {
    console.log('Server running on http://localhost:3000')
  })
  
  await Bun.sleep(1000)
})
afterAll(async () => {
  app.close()
  console.log("Server closed.");
});

describe("GET /api/user/register", () => {
  it("should return a message", async () => {
    const response = await fetch("http://localhost:3000/api/user/register");
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.msg).toBe("This is a public route. No authentication needed.");
  });
  it("should return 405 for unsupported method on /api/user/register", async () => {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
    });
    expect(response.status).toBe(405);
  });
  it("should return 405 for unsupported method on /api/user/register", async () => {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "PUT",
    });
    expect(response.status).toBe(405);
  });
  it("should return 405 for unsupported method on /api/user/register", async () => {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "DELETE",
    });
    expect(response.status).toBe(405);
  });
  it("should return 200 again for supported method on /api/user/register", async () => {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "GET",
    });
    expect(response.status).toBe(200);
  });

  it("should set Content-Type to application/json for JSON responses", async () => {
    const response = await fetch("http://localhost:3000/api/user/register");
    console.log(response.headers)
    expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
  });
  
  
});

describe("GET /error", () => {
  it("should trigger onError hook", async () => {
    const response = await fetch("http://localhost:3000/error");
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.message).toBe("Something went wrong!");
  });
});

describe("GET /api/protected", () => {
  it("should return 401 when no cookie is provided", async () => {
    const response = await fetch("http://localhost:3000/api/protected");
    const data = await response.json();
    expect(response.status).toBe(401);
    expect(data.message).toBe("Authentication token missing");
  });

  it("should return 200 if accesToken cookie is given", async () => {
    // Simulate sending a valid token
    const response = await fetch("http://localhost:3000/api/protected", {
      headers: {
        Cookie: "accessToken=validToken",
      },
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.msg).toBe("Authenticated user");
  });
});

describe("CORS Testing", () => {
  it("should allow POST requests from allowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    expect(response.status).toBe(200);
  });

  it("should allow requests from allowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      headers: {
        Origin: "http://localhost:3000",
      },
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.msg).toBe("Hello world!");
  });

  it("should deny requests from disallowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      headers: {
        Origin: "http://evil.com",
      },
    });
    expect(response.status).toBe(403);
  });
  it("should deny PUT requests from disallowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      method: "PUT",
      headers: {
        Origin: "http://evil.com",
      },
    });
    expect(response.status).toBe(403);
  });
});

describe("Testing Dynamic routes - /api/param/:id/:username", () => {
  it("it should return 404 as we have set route- /api/param/:id/:username", async () => {
    const response = await fetch("http://localhost:3000/api/param");
    expect(response.status).toBe(404);
  });

  it("it should return 404 as we have give only /id in param", async () => {
    const response = await fetch("http://localhost:3000/api/param/99");
    expect(response.status).toBe(404);
  });
  it("it should return 200 as we have give only /id/username also in param", async () => {
    const response = await fetch("http://localhost:3000/api/param/99/pradeep");
    expect(response.status).toBe(200);
  });
});

describe("Testing for Query Route", () => {
  const baseUrl = "http://localhost:3000/query";

  it("should return 200 when name and age are provided as query parameters", async () => {
    const response = await fetch(`${baseUrl}?name=pradeep&age=23`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ name: "pradeep", age: "23" });
  });

  it("should return 200 when only name is provided as query parameter", async () => {
    const response = await fetch(`${baseUrl}?name=pradeep`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ name: "pradeep", age: undefined });
  });

  it("should return 200 when no query parameters are provided", async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ name: undefined, age: undefined });
  });
});

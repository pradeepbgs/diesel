import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import {app} from './server'
const port = process.env.PORT || 3001
beforeAll(async () => {
  console.log('this is our port:'+port)
  await Bun.sleep(1000)
  app.listen( port as number, () => {
    console.log('Server running on http://localhost:3000')
  })
  await Bun.sleep(1000)
})
afterAll(async () => {
  console.log('closing the server')
  app.close()
  console.log("Server closed.");
})

describe("GET /api/user/register", () => {
  it("should return a message", async () => {
    const response = await fetch("http://localhost:3000/api/user/register")
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.msg).toBe("This is a public route. No authentication needed.")
  })
})

describe("GET /error", () => {
  it("should trigger onError hook", async () => {
    const response = await fetch("http://localhost:3000/error")
    const data = await response.json()
    expect(response.status).toBe(500)
    expect(data.message).toBe("Something went wrong!")
  })
})

describe("GET /api/protected", () => {
  it("should return 401 if no token is provided", async () => {
    const response = await fetch("http://localhost:3000/api/protected")
    const data = await response.json()
    expect(response.status).toBe(401)
    expect(data.message).toBe("Authentication token missing")
  })

  it("should return 200 if token is valid", async () => {
    // Simulate sending a valid token
    const response = await fetch("http://localhost:3000/api/protected", {
      headers: {
        Cookie: "accessToken=validToken",
      },
    })
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.msg).toBe('Authenticated user')
  })
})

describe("CORS Testing", () => {
  it("should allow requests from allowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    })
    const data = await response.json()
    expect(response.status).toBe(200)
    expect(data.msg).toBe('Hello world!')
  })

  it("should deny requests from disallowed origin", async () => {
    const response = await fetch("http://localhost:3000/api/hello", {
      headers: {
        'Origin': 'http://evil.com'
      }
    })
    expect(response.status).toBe(403) 
  })
})
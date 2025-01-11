import type { Server } from 'bun'
import Diesel from '../dist/main'
import type { ContextType } from '../dist/types'

export const app = new Diesel()


async function authJwt(ctx:ContextType, server:Server) {
  
  try {
    const token = await ctx.getCookie('accessToken')
  if (!token) {
    return ctx.json({ message: 'Authentication token missing' }, 401)
  }
    const user = { id: 1, name: 'John Doe' }
    ctx.setUser(user)
  } catch (error) {
    return ctx.json({ message: 'Invalid token' }, 403)
  }
}

app.addHooks("onError", (error, req, url, server) => {
  console.error(`Error occurred: ${error.message}`);
  return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500});
});

app.cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
})

app.get("/api/hello", async (ctx) => {
  return ctx.json({ msg: "Hello world!" })
})

app.get("/error", (ctx) => {
  return ctx.json({ message: "Something went wrong!" }, 500);
});

app.get('/api/protected', authJwt, async (ctx) => {
  return ctx.json({ msg: 'Authenticated user' })
})

app.get("/api/user/register", async (ctx) => {
  return ctx.json({ msg: "This is a public route. No authentication needed." })
})





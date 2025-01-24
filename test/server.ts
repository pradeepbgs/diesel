import type { Server } from 'bun'
import Diesel from '../dist/main'
import type { ContextType } from '../dist/types'
import { cors } from '../src/middlewares/cors/cors' 
export const app = new Diesel()


async function authJwt(ctx:ContextType, server:Server):Promise<void | null | Response> {
  
  try {
    const token = await ctx.cookies.accessToken
  if (!token) {
    return ctx.json({ message: 'Authentication token missing' }, 401)
  }
    const user = { id: 1, name: 'John Doe' }
    ctx.set('user',user)
  } catch (error) {
    return ctx.json({ message: 'Invalid token' }, 403)
  }
}

app.addHooks("onError", (error, req, url, server) => {
  console.error(`Error occurred: ${error.message}`);
  return new Response(JSON.stringify({ message: "Something went wrong!" }), { status: 500});
});


app.use(cors({
  origin: 'http://localhost:3000',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app
.get("/api/hello", async (ctx) => {
  return ctx.json({ msg: "Hello world!" })
})
.post("/api/hello",(ctx) =>{
  return ctx.json({msg:"Hello world from post"})
})

app.get("/error", (ctx) => {
  return ctx.json({ message: "Something went wrong!" }, 500);
});

app
.get('/api/protected', authJwt, async (ctx) => {
  return ctx.json({ msg: 'Authenticated user' })
})
.post('/api/protected', authJwt, async (ctx) => {
  return ctx.json({ msg: 'Authenticated user' })
})

app.get("/api/user/register", async (ctx) => {
  return ctx.json({ msg: "This is a public route. No authentication needed." })
})

app.get("/api/param/:id/:username", async (ctx) => {
  const id = ctx.params.id
  return ctx.json({ msg: `This is a public route. No authentication needed. User id: ${id}` })
})

app.get("/query",async(ctx) =>{
  const name = ctx.query.name
  const age = ctx.query.age
  return ctx.json({ name , age })
})

app.post("/body", async (ctx) => {
  try {
    const body = await ctx.body; // Access the parsed request body
    return ctx.json(body); // Return the body as JSON
  } catch (error:any) {
    return ctx.json({ error: error.message }, 400); // Return 400 for invalid body
  }
});

// app.listen(3000)
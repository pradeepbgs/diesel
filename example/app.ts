import Diesel from "../src/main";
import jwt from "jsonwebtoken";
import { ContextType, CookieOptions } from "../src/types";
import { newRoute, userRoute } from "./route";
import homapge from './templates/index.html'
import aboutpage from './templates/about.html'
import {cors} from "../src/middlewares/cors/cors";
import { securityMiddleware } from "../src/middlewares/security/security";
import {fileSaveMiddleware} from './middleware/saveFile'
import {advancedLogger, logger} from '../src/middlewares/logger/logger'
// import {loadRoutes} from 'ex-router'

const app = new Diesel({
  enableFileRouting:true
});

const SECRET_KEY = "linux";
// this is my external lib fro file based routing
// loadRoutes(app,{
//   routeDir:process.cwd()+'/src/routes'
// })
const port = process.env.PORT ?? 3000


// Authentication Middleware
export async function authJwt(ctx: ContextType): Promise<void | null | Response> {
  const token = ctx.cookies?.accessToken
  if (!token) {
    return ctx.json({ message: "Authentication token missing" },401);
  }
  try {
    const user = jwt.verify(token, SECRET_KEY);
    ctx.set('user',user);
  } catch (error) {
    return ctx.json({ message: "Invalid token" },403);
  }
}

// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }))

// app.setupFilter()
// .routeMatcher("/cookie",'/')
// .permitAll()



// Error Handling Hook
app.addHooks("onError", (error: any, req: Request, url: URL) => {
  console.error(`Error occurred: ${error.message}`);
  console.error(`Request Method: ${req.method}, Request URL: ${url}`);
  return new Response("Internal Server Error", { status: 500 });
});


// app.useLogger(app)
// app.use(logger(app) as any)
//  app.use(advancedLogger(app) as any)

// app.use(securityMiddleware)


app.addHooks('routeNotFound',async (ctx:ContextType) => {
  const file = await Bun.file(`${import.meta.dir}/templates/routenotfound.html`)
  // console.log(file)
  return new Response(file,{status:404})
  // return ctx.file(`${import.meta.dir}/templates/routenotfound.html`)

  // have problem with headers so
})

// import homapge from './templates/index.html'
// import aboutpage from './templates/about.html'
// app.static(
//   {
//     "/":homapge,
//     "/about":aboutpage
//   }
// )

app.redirect("/name/:name/:age","/redirect/:name/:age")
app.get("/redirect/:name/:age",(ctx) => {
  const params = ctx.params
  const query = ctx.query
  return ctx.json({
    msg:"from redirect",
    params:params,
    query:query
  })
})

// app.use((ctx)=>{
//   const params = ctx.params
//   console.log(params)
// })

app.serveStatic(`${import.meta.dirname}/public`)
 
// app.get("*",() => new Response(Bun.file(`${import.meta.dirname}/public/index.html`)) )
  
 app.get("/", async (ctx: ContextType) => {
    //  await new Promise((resolve) => setTimeout(resolve, 100));
    ctx.status = 400
    return ctx.text("Hello world")
   });

app
.get('/rd',(ctx) => {
  return ctx.redirect('/test/pradeep/23')
})
  .head("/", (ctx:ContextType) => {
    return ctx.send("")
  })
  .post("/",(ctx) => ctx.json({status:true,message:"from post"}))
  .any("/any",(ctx) => {
    return ctx.json({msg:"any"})
  })
  .post("/post",fileSaveMiddleware, (ctx) =>{
    return ctx.json({msg:"post"})
  })
  .get("/test/:id/:name", (ctx:ContextType) => {
    const id  = ctx.params.id
    const name = ctx.params.name
    console.log(ctx.params.name)
    return ctx.text("How are you? "+id+name);
  })
  .get("/err",(ctx) =>{
    ctx.status = 400
    // throw new Error("Somethin`g went wrong yes");
    return ctx.send("Error",500);
  })
  .get("/query",async(ctx) =>{
    const name = ctx.query.name
    const age = ctx.query.age
    const q = ctx.query
    // console.log(name,age)
    const cookie = ctx.cookies.accessToken
    return ctx.json({ name , age , Allquery:q})
  })

  .post("/body", async (ctx) => {
    const body = await ctx.body;
    if (body) {
        return ctx.json({
            name: body.name,
            password: body.password,
            avatar: body.avatar ? {
                name: body.avatar.name,
                type: body.avatar.type,
                size: body.avatar.size
            } : null
        });
    }

    return ctx.text("No body found");
})


  .get("/cookie", (ctx: ContextType) => {
    const accessToken = jwt.sign({ userId: "123" }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: "123" }, SECRET_KEY, { expiresIn: '7d' });

    // Set cookies
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60, 
    };

    ctx.setCookie('accessToken', accessToken, cookieOptions);
    ctx.setCookie('refreshToken', refreshToken, cookieOptions);

    return ctx.json({ message: "Cookies set successfully" });
  });

// app.route("/api/user", userRoute)

app.get("/too",(ctx) => {return ctx.send("GETTT too")})
app.post('/too',(ctx) =>{return ctx.send("Send posstt")})

app.get("/ejs",async(ctx:ContextType) =>{
  return await ctx.ejs(`${import.meta.dirname}/templates/look.ejs`,{name:"linux"})
})

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})


const shutdown = ():any => {
  app.close();
  process.exit()
};

process.on('SIGTERM', shutdown)
process.on("SIGINT", shutdown);

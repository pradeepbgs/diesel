import Diesel from "../src/main";
import jwt from "jsonwebtoken";
import { ContextType, CookieOptions, middlewareFunc } from "../src/types";
import { newRoute, userRoute } from "./route";

const app = new Diesel();
const SECRET_KEY = "linux";
const port = 3000

// app.cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// });

// Authentication Middleware
export async function authJwt(ctx: ContextType): Promise<void | null | Response> {
  const token = ctx.getCookie("accessToken");
  if (!token) {
    return ctx.json({ message: "Authentication token missing" },401);
  }
  try {
    const user = jwt.verify(token, SECRET_KEY);
    ctx.setUser(user);
  } catch (error) {
    return ctx.json({ message: "Invalid token" },403);
  }
}



app
.static(`${import.meta.dir}/public`)
  // .setupFilter()
  // .routeMatcher("/cookie").permitAll()
  // .authenticate([authJwt]);  

// Error Handling Hook
app.addHooks("onError", (error: any, req: Request, url: URL) => {
  console.error(`Error occurred: ${error.message}`);
  console.error(`Request Method: ${req.method}, Request URL: ${url}`);
  return new Response("Internal Server Error", { status: 500 });
});


// Routes

  app
  .get("*",async (ctx:ContextType) => {
    return  ctx.file(`${import.meta.dir}/public/index.html`)
  })
  .any("/any",(ctx) => {
    return ctx.json({msg:"any"})
  })
  .get("/post",(ctx) =>{
    return ctx.json({msg:"get"})
  })
  .post("/post",(ctx) =>{
    return ctx.json({msg:"post"})
  })
  .get("/test/:id/:name", (ctx:ContextType) => {
    const id  = ctx.getParams("id")
    const name = ctx.getParams("name")
    return ctx.text("How are you?"+id+name);
  })


app.register("/api/user", userRoute)


app.listen(port)

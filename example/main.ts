import Diesel from "../src/main";
import jwt from "jsonwebtoken";
import { ContextType, CookieOptions, middlewareFunc } from "../src/types";
import { Server } from "bun";
import { newRoute, userRoute } from "./route";

const app = new Diesel();
const SECRET_KEY = "linux";
const port = 3000
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

const h1 = () => {
  console.log('from h1')
}
const h2 = () => {
  console.log('from h2')
}

// app
// .filter()
//   .routeMatcher("/cookie")
//   .permitAll()
//   .require(authJwt as middlewareFunc)

// Error Handling Hook
app.addHooks("onError", (error: any, req: Request, url: URL) => {
  console.error(`Error occurred: ${error.message}`);
  console.error(`Request Method: ${req.method}, Request URL: ${url}`);
  return new Response("Internal Server Error", { status: 500 });
});

// app.use("/home",h1)
// app.use(["/home","/user"],[h1,h2])
// app.use([h1,h2])
// app.use(h1)
app.use(h1,[h2,h1])
// Routes
app
  .get("/", async (ctx) => {
    // const user = ctx.getUser();
    return ctx.json({msg:"Hello world"})
  })
  // .get("/:id",async (ctx) => {
  //   const id= ctx.getParams("id")
  //   return ctx.json({id})
  // })
  // .get("/:name?",(ctx:ContextType) =>{
  //   return ctx.text("hello world")
  // })
  // .get("/error", async () => {
  //   throw new Error("This is a test error to demonstrate error handling");
  // })
  // .get("/redirect",async(ctx:ContextType) => {
  //   return ctx.redirect("/")
  // })
  // .get("/test/:id/:name", async (ctx) => {
  //   const query = ctx.getQuery();
  //   const params = ctx.getParams();
  //   return ctx.json({ msg: "Hello World", query, params });
  // })
  // .get("/ok", (ctx:ContextType) => {
  //   return ctx.text("How are you?");
  // })
  // .get("/cookie", async (ctx) => {
  //   const user = { name: "pk", age: 22 };

  //   const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });
  //   const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: "10d" });

  //   const cookieOptions: CookieOptions = {
  //     httpOnly: true,
  //     secure: true,
  //     maxAge: 24 * 60 * 60 * 1000, 
  //     sameSite: "Strict",
  //     path: "/",
  //   };

  //   return ctx
  //     .setCookie("accessToken", accessToken, cookieOptions)
  //     .setCookie("refreshToken", refreshToken, cookieOptions)
  //     .json({ msg: "Cookies set successfully" });
  // });

// Register Additional Routes
app
.register("/api/user", userRoute)

// app.route('/api/route', newRoute)

// Start the Server
app.listen(port)

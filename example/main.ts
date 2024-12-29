import {Diesel} from "../index.js";
import jwt from "jsonwebtoken";
import { ContextType, CookieOptions, middlewareFunc } from "../src/types";
import { Server } from "bun";
import { newRoute, userRoute } from "./route";

const app = new Diesel();
const SECRET_KEY = "linux";

// Authentication Middleware
export async function authJwt(ctx: ContextType): Promise<void | null | Response> {
  const token = ctx.getCookie("accessToken");
  if (!token) {
    return ctx.status(401).json({ message: "Authentication token missing" });
  }
  try {
    const user = jwt.verify(token, SECRET_KEY);
    ctx.setUser(user);
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

// Error Handling Hook
app.addHooks("onError", (error: any, req: Request, url: URL) => {
  console.error(`Error occurred: ${error.message}`);
  console.error(`Request Method: ${req.method}, Request URL: ${url}`);
  return new Response("Internal Server Error", { status: 500 });
});

// Routes
app
  .get("/", async (ctx) => {
    const user = ctx.getUser();
    return ctx.json({
      msg: "Hello World",
      user,
    });
  })
  .get("/error", async () => {
    throw new Error("This is a test error to demonstrate error handling");
  })
  .get("/test/:id/:name", async (ctx) => {
    const query = ctx.getQuery();
    const params = ctx.getParams();
    return ctx.json({ msg: "Hello World", query, params });
  })
  .get("/ok", (ctx) => {
    return ctx.status(200).text("How are you?");
  })
  .get("/cookie", async (ctx) => {
    const user = { name: "pk", age: 22 };

    const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: "1d" });
    const refreshToken = jwt.sign(user, SECRET_KEY, { expiresIn: "10d" });

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: "Strict",
      path: "/",
    };

    return ctx
      .setCookie("accessToken", accessToken, cookieOptions)
      .setCookie("refreshToken", refreshToken, cookieOptions)
      .json({ msg: "Cookies set successfully" });
  });

// Register Additional Routes
app.register("/api/user", userRoute);

app.route('/api/route', newRoute)

// Start the Server
app.listen(3000)

import Diesel from "../src/main";
import jwt from "jsonwebtoken";
import { ContextType, CookieOptions, HookType, middlewareFunc } from "../src/types";
import { Server } from "bun";

const app = new Diesel()
const secret = "linux";

// app.cors({
//   origin: ['http://localhost:5173','*'],
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// })

async function authJwt(ctx: ContextType): Promise<void | null | Response> {
  const token = ctx.getCookie("accessToken");
  if (!token) {
    return ctx.status(401).json({ message: "Authentication token missing" });
  }
  try {
    const user = await jwt.verify(token, secret); // Replace with your JWT secret
    ctx.setUser(user);
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

app
  .filter()
  .routeMatcher("/cookie")
  .permitAll()
  .require(authJwt as middlewareFunc);

// app.use(authJwt)

// app.addHooks('onRequest', (req:Request) => {
//   // console.log(req);
// });

app.addHooks('onError', (error: any, req: Request, url: URL, server: Server) => {
  console.error(`Error occurred: ${error.message}`);
  console.error(`Request Method: ${req.method}, Request URL: ${url}`);
  // return new Response('Internal Server Error', { status: 500 }); // You can customize the response as needed
});


app.get("/error", async () => {
  throw new Error("This is a test error to demonstrate error handling");
});

app.get("/", async (xl) => {
  const user = xl.getUser();
  return xl.json({
    user,
  });
});

// app.post("/",async (ctx) => {
//   const body = await ctx.getBody()
//   return ctx.json(body)
// })

app.get("/test/:id/:name", async (xl) => {
  const q = xl.getQuery();
  const params = xl.getParams();
  return new Response(JSON.stringify({ msg: "hello world", q, params }));
});

app.get("/ok", (xl) => {
  return xl.status(200).text("kaise ho??");
});

app.get("/cookie", async (xl) => {
  const user = {
    name: "pk",
    age: 22,
  };

  const accessToken = jwt.sign(user, secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(user, secret, { expiresIn: "10d" });
  const options: CookieOptions = {
    httpOnly: true, // Makes cookie accessible only by the web server (not JS)
    secure: true, // Ensures the cookie is sent over HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    sameSite: "Strict", // Prevents CSRF (strict origin policy)
    path: "/", // Cookie available for all routes
  };
  
  return (
    xl
      .setCookie("accessToken", accessToken, options)
      .setCookie("refreshToken", refreshToken, options)
      .json({ msg: "setting cookies" })
  );

});

app.listen(3000);

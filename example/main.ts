import { Server } from "bun";
import Diesel, { rateLimit } from "../dist/main";
import jwt from 'jsonwebtoken'
import { ContextType, CookieOptions, middlewareFunc } from "../dist/types";

const app = new Diesel()
const secret = 'pradeep'
// app.cors({
//   origin: ['http://localhost:5173','*'],
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// })

async function authJwt(ctx: ContextType, server?: Server): Promise<void | null | Response> {

  try {
    const token = ctx?.getCookie("accessToken");

    if (!token) {
      return ctx.status(401).json({ message: "Authentication token missing" });
    }
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);  // Replace with your JWT secret
    // Set the user data in context
    ctx.setUser(user)
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

const limiter = rateLimit({
  time: 60000,  // Time window in milliseconds (e.g., 1 minute)
  max: 10,     // Maximum number of requests allowed in the time window
  message: "Rate limit exceeded. Please try again later." // Custom error message
});

// app.use(limiter)

app
  .filter()
  .routeMatcher('/api/user/register', '/api/user/login', '/test/:id', '/cookie')
  .permitAll()
  .require(authJwt as middlewareFunc)

// app.use(authJwt as middlewareFunc)

// .require(you can pass jwt auth parser)

app.get("/", async (xl) => {
  // // const ip = xl.req
  // // // console.log(ip)
  // const user = xl.get('user')
  const q = xl.getUser()

  return xl.status(200).json({ msg: "hello world", q })
});

app.get("/test/:id", async (xl) => {
  const q = xl.getQuery();
  const params = xl.getParams('id');
  return new Response(JSON.stringify({ msg: "hello world", q, params }));
});

app.get("/ok", (xl) => {
  return xl.status(200).text("kaise ho??")
})

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
  return xl
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ msg: "setting cookies" })
});



app.listen(3000)

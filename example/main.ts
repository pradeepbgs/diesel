import { Server } from "bun";
import Diesel ,{rateLimit} from "../src/main";
import { ContextType, CookieOptions, middlewareFunc } from "../dist/types";
import jwt from 'jsonwebtoken'

const app = new Diesel()
const secret = 'pradeep'
// app.cors({
//   origin: ['http://localhost:5173','*'],
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// })

async function authJwt (ctx:ContextType, server?:Server): Promise<void | Response> {
  const token = await ctx.getCookie("accessToken");  // Retrieve the JWT token from cookies
  if (!token) {
    return ctx.status(401).json({ message: "Authentication token missing" });
  }
  try {
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);  // Replace with your JWT secret
    // Set the user data in context
    ctx.set("user", user);

    // Proceed to the next middleware/route handler
    return ctx.next();
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

const limiter = rateLimit({
  time: 60000,  // Time window in milliseconds (e.g., 1 minute)
  max: 10,     // Maximum number of requests allowed in the time window
  message: "Rate limit exceeded. Please try again later." // Custom error message
});
// app.use(h)
// app.use(limiter)

app
.filter()
.routeMatcher('/api/user/register','/api/user/login','/test/:id','/cookie')
.permitAll()
.require(authJwt)

// app.use(authJwt)

// .require(you can pass jwt auth parser)

app.get("/", async(xl) => {
  // const ip = xl.req
  // console.log(ip)
  const user = xl.get('user')
    return xl.json({user:user});
});

app.get("/test/:id", async (xl) => {
    const q = xl.getQuery();
    const params = xl.getParams('id');
    return new Response(JSON.stringify({ msg: "hello world", q, params }));
  });

  app.get("/ok",(xl)=>{
    return xl.status(200).text("kaise ho??")
  })

  app.get("/cookie", async(xl) => {
    const user = {
      name: "pk",
      age: 22,
    };
  
    const accessToken = jwt.sign(user, secret, { expiresIn: "1d" });
    const refreshToken = jwt.sign(user, secret, { expiresIn: "10d" });
    const options : CookieOptions= {
      httpOnly: true, // Makes cookie accessible only by the web server (not JS)
      secure: true, // Ensures the cookie is sent over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: "Strict", // Prevents CSRF (strict origin policy)
      path: "/", // Cookie available for all routes
    };
    await xl.cookie("accessToken", accessToken, options)
    await xl.cookie("refreshToken", refreshToken, options)
    // xl.cookie("refreshToken", refreshToken, options);
    await xl.getCookie()
    return xl.json({msg:"setting cookies"})
  });



app.listen(3000)

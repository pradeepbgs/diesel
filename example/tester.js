import Diesel from "../dist/main";
import jwt from "jsonwebtoken";

const app = new Diesel();
const secret = "secret";

// app.filter().permitAll().require()

app.get("/r", (xl) => {
  return xl.html(`${import.meta.dir}/index.html`);
});

// app.use((xl) => {
//     const cok = xl.getCookie('accessToken');

//     if (cok) {
//         try {
//             const vcok = jwt.verify(cok, secret);
//             xl.setAuth(true);
//             xl.set('user',vcok)
//         } catch (error) {
//             // console.log('Token verification failed:', error);
//             xl.setAuth(false);
//         }
//     } else {
//         xl.setAuth(false);
//     }

//     return null;
// });

// app.use(h)
// Main route handler for "/"

// app.addHooks('onRequest',(xl)=>{
//   console.log('on req hooks');
// })

// app.filter()

app.get("/", async (xl) => {
  return xl.status(200).text("hello d")
})

app.post("/", async (xl) => {
  const body = await xl.body();
  return new Response(JSON.stringify(body)); // This will log the parsed body content
});

app.get("/c", async(xl) => {
  const user = {
    name: "pk",
    age: 22,
  };

  const accessToken = jwt.sign(user, secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(user, secret, { expiresIn: "10d" });
  const options = {
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

// For "/test", middlewares h, s will run before the handler
app.get("/test/:id", async (xl) => {
  const q = xl.getQuery();
  const params = xl.getParams('id');
  return new Response(JSON.stringify({ msg: "hello world", q, params }));
});

// For "/ok", only middleware h will run before the handler
app.get("/redirect", (xl) => {
  return xl.redirect("/");
});

import userRoute from "./route.js";

app.register("/api/user", userRoute);

app.listen(3000);

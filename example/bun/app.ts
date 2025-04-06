import Diesel from "../../src/main";
import jwt from 'jsonwebtoken'
import type { ContextType } from "../../src/types";

const app = new Diesel()
const SECRET_KEY = "linux";


app.get("/cookie", (ctx: ContextType) => {
    const accessToken = jwt.sign({ userId: "123" }, SECRET_KEY, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: "123" }, SECRET_KEY, { expiresIn: '7d' });

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60, 
    };

    ctx.setCookie('accessToken', accessToken, cookieOptions);
    ctx.setCookie('refreshToken', refreshToken, cookieOptions);

    return ctx.json({ message: "Cookies set successfully" });
  });

app.BunRoute('GET','/',async ()=>{
    return new Response("Hello World")
})



app.listen(3000)
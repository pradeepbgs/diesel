import Diesel from "../src/main";
import Router from "../src/route";
import { authJwt } from "./main";

// export const userRoute = new Router();

const h = () => {
  console.log('object');
}

const s = () =>{
  console.log('s')
}

// route.get("/register/:id", h,(xl) => {
//   return xl.text("from register user");
// })

// route.get("/login",h,s,(xl)=>{
//   return new Response("hello loin")
// })

export const newRoute = new Diesel()

newRoute.get("/login",(xl)=>{
  return xl.json({message:"from login"})
})

newRoute.get("/tetet",(ctx) =>{
  return ctx.text("from tetet")
})

newRoute.get("/register/:id",(xl) => {
  return xl.json({message:"from register"})
})
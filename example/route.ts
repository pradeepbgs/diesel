import Diesel from "../src/main";
// import Router from "../src/route";
import { authJwt } from "./main";

 const userRoute = new Diesel();

const h = () => {
  console.log('object');
}

const s = () =>{
  console.log('s')
}

userRoute.get("/register",(xl) => {
  return xl.text("from register user");
})

userRoute.get("/login",(xl)=>{
  return new Response("hello loin")
})

 const newRoute = new Diesel()

newRoute.get("/login",(xl)=>{
  return xl.json({message:"from login"})
})

newRoute.get("/tetet",(ctx) =>{
  return ctx.text("from tetet")
})

newRoute.get("/register/:id",(xl) => {
  const param = xl.getParams("id")
  return xl.json({message:"from register",param})
})

export {
  userRoute,newRoute
}
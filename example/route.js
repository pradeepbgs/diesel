import Router from "../src/route";

const route = new Router();

const h = () => {
  console.log('object');
}

const s = () =>{
  console.log('s')
}

route.get("/register/:id", h,(xl) => {
  return xl.text("from register user");
})

route.get("/login",h,s,(xl)=>{
  return new Response("hello loin")
})

export default route;

import Diesel from "../src/main";



const app = new Diesel({ logger: true })



app.get("/", () => {
  return new Response("Hello world");
})

// Module system
const userModule = (app:Diesel) :void => {
  app.get("/user", () => new Response("Hello user"))
}

app.registerModule(userModule);

app.listen(3000,() => 'console server started')
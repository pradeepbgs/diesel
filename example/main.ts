import {Diesel, rateLimit} from "../src/main";

const app = new Diesel()

// app.cors({
//   origin: ['http://localhost:5173','*'],
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// })

function h() {
 return new Response("hello world")
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
.routeMatcher('/api/user/register','/api/user/login','/test/:id','/')
.permitAll()
.require()

// .require(you can pass jwt auth parser)

app.get("/", async(xl) => {
  // const ip = xl.req
  // console.log(ip)
    return xl.json({
      message: 'Hello from Express!',
      author: 'Pradeep',
      app: 'Express App',
      features: ['Fast', 'Flexible', 'Lightweight']
    });
});

app.get("/test/:id", async (xl) => {
    const q = xl.getQuery();
    const params = xl.getParams('id');
    return new Response(JSON.stringify({ msg: "hello world", q, params }));
  });

  app.get("/ok",(xl)=>{
    return xl.status(200).text("kaise ho??")
  })

app.listen(3000)

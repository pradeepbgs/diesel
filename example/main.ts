import {Diesel} from "../dist/main";

const app = new Diesel()

app.cors({
  origin: ['http://localhost:5173','*'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
})

app.get("/", async(xl) => {
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

app.listen(3000)

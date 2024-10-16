import {Diesel} from "../dist/main.js";

const app = new Diesel()

app.get("/", async(xl) => {
    return xl.json({ msg: "hello" });
});

app.get("/test/:id", async (xl) => {
    const q = xl.getQuery();
    const params = xl.getParams('id');
    return new Response(JSON.stringify({ msg: "hello world", q, params }));
  });

app.listen(3000)

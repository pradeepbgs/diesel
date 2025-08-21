import Diesel from "../src/main";

const app = new Diesel()
const port = process.env.PORT || 3000



// app.get('/', (c) => c.send("hello world"))

app.on(['GET','POST', 'BREW', 'QUERY'], '/', () => console.log("hellow"), (c) => c.send("Hello from /"))









app.listen(port, () => console.log(`server running on port: ${port}`))
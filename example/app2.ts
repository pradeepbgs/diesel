import Diesel from "../src/main";

const app = new Diesel()
const port = process.env.PORT || 3000


// app.use(() => console.log('in iddle'))
// app.addHooks('onRequest', () => console.log('onRequest'))
// app.useLogger({app})

app.addHooks('onError', (err: ErrnoException) => {
    console.log('got an exception ', err)
    return new Response(
        JSON.stringify({ message: err.message, stack: err.stack }),
        {
            headers: { "Content-Type": "application/json" },
            status: 500
        }
    );
});

app.get('/err', (ctx) => {
    return new Promise((res,rej) => {
        setTimeout(() => {
            rej(new Error("This is a simulated delayed error!"));
        }, 200);
    })
})

// app.on(['GET', 'POST', 'BREW', 'QUERY'], '/', (c) => c.text("Hello from /"))
app.get("/", (c) => c.text("Hello from /k"))


// app.use("/hello", () => console.log("/hello"))
app.get("/hello", (c) => c.send("he;;o"))

app.get("/hello/test", (c) => c.send("he;;o/test"))

app.get("/hello/:id", (c) => {
    const id = c.params.id
    const query = c.query.name
    return c.send(`Hello from /hello/${id} , and here is query:${query}`)
})



// 
const authRt = Diesel.router('/auth')
// authRt.use('/login', () => console.log('from authRt'))
authRt.get("/login", (c) => c.send("/auth login"))

const userRt = Diesel.router('/user')
// userRt.use('/login', () => console.log("from userRt /user"))
userRt.any("/login", (c) => c.send("/user login"))

//
const userRouter = new Diesel({ prefixApiUrl: '/api/user' })
userRouter.get("/login", (c) => c.send("from /api/user/login"))

const userRouter2 = new Diesel()
userRouter2.get("/login", (c) => c.send("login from userRouter 2"))

app.route('', userRouter)
app.register('/api/user2', userRouter2)

app.listen(port, () => console.log(`server running on ports: ${port}`))

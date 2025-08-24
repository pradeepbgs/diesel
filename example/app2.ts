import Diesel from "../src/main";

const app = new Diesel()
const port = process.env.PORT || 3000

const userRouter = new Diesel({ prefixApiUrl: '/api/user' })
userRouter.get("/login", (c) => c.send("from /api/user/login"))

const userRouter2 = new Diesel()
userRouter2.get("/login", (c) => c.send("login from userRouter 2"))

app.on(['GET', 'POST', 'BREW', 'QUERY'], '/', (c) => c.send("Hello from /"))

app.route('', userRouter)
app.register('/api/user2', userRouter2)


const authRt = Diesel.router('/auth')
authRt.use('/login',() => console.log('from authRt'))
authRt.get("/login", (c) => c.send("/auth login"))

const userRt = Diesel.router('/user')
userRt.use('/login',() => console.log("from userRt /user"))
userRt.any("/login", (c) => c.send("/user login"))

app.use("/hello", () => console.log("/hello"))
app.get("/hello", (c) => c.send("he;;o"))

app.listen(port, () => console.log(`server running on ports: ${port}`))
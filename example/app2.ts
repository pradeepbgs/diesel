import Diesel from "../src/main";

const app = new Diesel()
const port = process.env.PORT || 3000

const userRouter = new Diesel({ prefixApiUrl: '/api/user' })
userRouter.get("/login", (c) => c.send("login"))

const userRouter2 = new Diesel()
userRouter2.get("/login", (c) => c.send("login from userRouter 2"))


app.on(['GET', 'POST', 'BREW', 'QUERY'], '/', (c) => c.send("Hello from /"))

app.route('', userRouter)
app.register('/api/user2', userRouter2)



app.listen(port, () => console.log(`server running on ports: ${port}`))
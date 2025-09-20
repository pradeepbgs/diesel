import Diesel from "../src/main";
import { poweredBy } from "../src/middlewares/powered-by";
import { ContextType } from "../src/types";


const app = new Diesel({
    // onError:true,
    // logger: true // allready includes onErr with logger
})

// app.useAdvancedLogger({app})
// app.addHooks('preHandler', () => {
//     console.log('pre Handler hook hun mai')
// })

const msg = "hhhhh"
// app.use(() => console.log(msg))
// app.useLogger({ app , onError(error, req, pathname) {
//     console.log('got en error ')
// },})
// app.use(() => { console.log("hi") })
// app.BunRoute('get','/', "Helll")
// app.get('/', (ctx) => {
//     // ctx.setHeader("name",'pradeep')
//     // console.log('req ', ctx.req.headers.set("ok",'pk'))
//     // ctx.headers?.set("ok",'pk')
//     // const q = ctx.query
//     // console.log('q ', q)
//     return ctx.text("Hell")
//     // return Promise.reject(Error("k error"))
// })

// app.use('/ok', () => console.log('okk')).get("/ok", (ctx) => ctx.send("ok"))

app.get("/", (ctx) => ctx.text("Hello world!"))
// app.get('/', (ctx) => ctx.json({msg:"hello"}))

class UserService {
    users: Array<Object>
    constructor() {
        this.users = [
            {
                name: "pradeep",
                age: 20
            },
            {
                name: "pk",
                age: 2
            },
        ]
    }

    getUser = async (ctx: ContextType): Promise<Response> => {
        return new Promise((resolve, reject) => {
            // reject(new Error("User Not Found 404"))
            // console.log(this.users)
            resolve(Response.json({ users: this.users }))
        })
    }
}

const userService = new UserService()
app.BunRoute('get', '/user', userService.getUser)

// app.get('/user', userService.getUser)


// app.use('/power', (ctx) => {
//     console.log('power middleware')
//     // ctx.set("ok",'ok')
// })

app.get("/power", (ctx) => {
    // ctx.changeStatus(400)
    // ctx.set("ok", "pradeep")
    // console.log('ok ', ctx.get('ok'))
    return ctx.text("/power")
})



app.listen(3000, () => console.log("diesel running on 3000"))
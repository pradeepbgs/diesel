import Diesel from "../src/main";
import { ContextType } from "../src/types";
import { HTTPException } from '../src/http-exception';
import FindMyWay from 'find-my-way'
import { FindMyWayRouter } from "../src/router/find-my-way";


const app = new Diesel({
    errorFormat: 'text',
    // router: 'fastify',
})

const msg = "hhhhh"

function addMiddleware() {
    // app.use(() => console.log(msg))

    app.use(async () => { console.log("hi") })

    // app.useAdvancedLogger({ app })

    app.addHooks('preHandler', () => {
        console.log('pre Handler hook hun mai')
    })

    // app.routeNotFound((ctx) => {
    //     return ctx.send(`nahi mila ye route ${ctx.path}`)
    // })

    // app.use('/power', (ctx) => {
    //     console.log('power middleware')
    // })
}

// addMiddleware()

app.get('/user/:id', (ctx) => {
    const p = ctx.req
    const id = ctx.params.id
    console.log('id ', id)
    return ctx.text(id)
})


app.BunRoute('get', '/bun', "Helll")



app.get("/", (ctx) => {
    // const ip = ctx.ip
    // console.log('ip ', ip)
    return ctx.text("hello world")
})

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

// app.use(async() => console.log('hloblalsssss'), async() => console.log("2nd"), () => console.log("3rd"))
// app.use(async() => console.log('hloblal'))
// app.use('/power', () => console.log('power middleware'))
app.get("/power", (ctx) => {
    return ctx.text("/power")
})


app.get('/async', (ctx) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ctx.text("maybe resolved"))
        }, 200);
    })
})

app.get('/err', (ctx: ContextType) => {
    throw new HTTPException(405, { res: ctx.json({ msg: "unauthorized sir" }) })
    throw new HTTPException(400, { message: 'Unauthorized' });
});

app.get('/aerr', async (ctx) => {
    await someAsyncTask();
    throw new Error("async error");
});

async function someAsyncTask() { }

app.listen(3000, () => console.log("diesel running on 3000"))


// Bun.serve({
//     port: 3000,
//     fetch: app.fetch() as any
// })


import Diesel from "../src/main";
import { poweredBy } from "../src/middlewares/powered-by";
import { ContextType } from "../src/types";


const app = new Diesel({
    pipelineArchitecture: true,
    // onError:true,
    // logger: true // allready includes onErr with logger
})

const msg = "hhhhh"

function addMiddleware() {
    app.use(() => console.log(msg))
    app.useLogger({
        app, onError(error, req, pathname) {
            console.log('got en error ')
        },
    })
    app.use(() => { console.log("hi") })
    app.useAdvancedLogger({ app })
    app.addHooks('preHandler', () => {
        console.log('pre Handler hook hun mai')
    })

    app.routeNotFound((ctx) => {
        return ctx.send(`nahi mila ye route ${ctx.pathname}`)
    })
    app.use('/power', (ctx) => {
        console.log('power middleware')
    })
}


app.BunRoute('get', '/bun', "Helll")



app.get("/", (ctx) => ctx.text("Hello world!"))

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

app.get('/err', (ctx) => {
    throw new Error("sync error");
});

app.get('/aerr', async (ctx) => {
    await someAsyncTask();
    throw new Error("async error");
});

async function someAsyncTask() { }

// app.listen(3000, () => console.log("diesel running on 3000"))


Bun.serve({
    port: 3000,
    fetch: app.fetch() as any
})

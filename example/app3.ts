import Diesel from "../src/main";
import { poweredBy } from "../src/middlewares/powered-by";
import { ContextType } from "../src/types";
import { HTTPException } from '../src/http-exception';

const app = new Diesel({
    pipelineArchitecture: false,
    logger: true
})

const msg = "hhhhh"

function addMiddleware() {
    app.use(() => console.log(msg))

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

app.get('/user/:id', (ctx) => {
    const id = ctx.params.id
    return ctx.text(id)
})


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
    // throw new Error('Unauthorized', { cause: 401 })
    throw new HTTPException(401, {
        res: new Response('Unauthorized', { status: 401 }),
    })

    throw new HTTPException(400, { message: 'Unauthorized' });
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

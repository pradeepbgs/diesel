import Diesel from "../src/main";
import { ContextType } from "../src/types";


const app = new Diesel({
    // onError:true,
    // logger:true // allready includes onErr with logger
})


const msg = "hhhhh"
// app.use(() => { console.log(msg) })
// app.useLogger({ app , onError(error, req, pathname) {
//     console.log('got en error ')
// },})
// app.use(() => { console.log("hi") })
app.get('/', (ctx) =>ctx.send("hello world"))


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
// app.BunRoute('get','/',userService.getUser)

app.get('/user', userService.getUser)

app.listen(3000, () => console.log("diesel running on 3000"))
import { ContextType } from "../../../src/types"


export const GET = (ctx:ContextType) =>{
    return ctx.send("Hello")
}
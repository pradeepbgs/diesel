import { asyncHandler } from "../../utils/try-catch";

export const GET = asyncHandler((ctx)  => {
    return ctx.send({
        message:'From register GET'
    })
})
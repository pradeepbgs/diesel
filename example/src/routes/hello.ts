export const GET = (ctx) => {
    return ctx.send({
        status: 'success',
        message: 'Hello, welcome to our API!',
        data: null
    });
}
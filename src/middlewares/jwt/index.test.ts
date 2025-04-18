import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import Diesel from "../../main";
import { authenticateJwt } from "./index";
import jwt from 'jsonwebtoken'

describe('jwt test middleware', () => {
    const app = new Diesel()


    beforeAll(() => {
        app.listen(3007)
    })
    afterAll(() => app.close())

    app.use(authenticateJwt({
        app,
        jwt,
        routes:['/','']
    }))

})
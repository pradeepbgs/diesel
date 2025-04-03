import Diesel from "../../main";
import { ContextType } from "../../types";
type authenticateJwtT = {
    app: Diesel;
    jwt: any;
    jwtSecret?: string;
    routes?: string[];
};
type authenticateJwtDBT = {
    app: Diesel;
    userModel: any;
    jwt: any;
    jwtSecret?: string;
    routes?: string[];
};
export declare const authenticateJwt: (options: authenticateJwtT) => (ctx: ContextType) => Response | undefined;
export declare const authenticateJwtDB: (options: authenticateJwtDBT) => (ctx: ContextType) => Promise<Response | undefined> | undefined;
export {};

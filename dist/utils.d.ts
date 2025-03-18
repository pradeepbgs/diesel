import { ContextType } from "./types";
export default function rateLimit(props: {
    time?: number;
    max?: number;
    message?: string;
}): (ctx: ContextType) => void | Response;
export declare function getMimeType(filePath: string): string;
declare function authenticateJwtMiddleware(jwt: any, user_jwt_secret: string): (ctx: ContextType) => Response | undefined;
declare function authenticateJwtDbMiddleware(jwt: any, User: any, user_jwt_secret: string): (ctx: ContextType) => Promise<Response | undefined>;
export { authenticateJwtMiddleware, authenticateJwtDbMiddleware };

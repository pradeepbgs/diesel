import { BunRequest, Server } from "bun";
import type { ContextType, DieselT } from "./types";
export default function handleRequest(req: BunRequest, server: Server, url: URL, diesel: DieselT): Promise<any>;
export declare function executeMiddlewares(middlewares: Function[], ctx: ContextType, server: Server): Promise<Response | null>;
export declare function executeBunMiddlewares(middlewares: Function[], req: BunRequest, server: Server): Promise<any>;
export declare function handleFilterRequest(diesel: DieselT, path: string, ctx: ContextType, server: Server): Promise<Response | undefined>;
export declare function handleBunFilterRequest(diesel: DieselT, path: string, req: BunRequest, server: Server): Promise<Response | undefined>;
export declare function generateErrorResponse(status: number, message: string): Response;
export declare function handleStaticFiles(diesel: DieselT, pathname: string, ctx: ContextType): Promise<Response | null>;

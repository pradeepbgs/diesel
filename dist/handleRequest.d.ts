import { BunRequest, Server } from "bun";
import type { ContextType, DieselT } from "./types";
/** Fast parse that extracts pathname and raw query without constructing URL */
export declare function parseRequestUrl(rawUrl: string): string;
export default function handleRequest(req: BunRequest, server: Server, diesel: DieselT): Promise<Response>;
export declare function executeBunMiddlewares(middlewares: Function[], req: BunRequest, server: Server): Promise<any>;
export declare function handleFilterRequest(diesel: DieselT, path: string, ctx: ContextType, server: Server): Promise<Response | undefined>;
export declare function handleBunFilterRequest(diesel: DieselT, path: string, req: BunRequest, server: Server): Promise<Response | undefined>;
export declare function generateErrorResponse(status: number, error: string): Response;
export declare function handleStaticFiles(diesel: DieselT, pathname: string, ctx: ContextType): Promise<Response | null>;

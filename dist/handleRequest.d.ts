import { Server } from "bun";
import type { ContextType, DieselT } from "./types";
export default function handleRequest(req: Request, server: Server, url: URL, diesel: DieselT): Promise<Response>;
export declare function handleFilterRequest(diesel: DieselT, path: string, ctx: ContextType, server: Server): Promise<Response | undefined>;
export declare function generateErrorResponse(status: number, message: string): Response;
export declare function handleStaticFiles(diesel: DieselT, pathname: string, ctx: ContextType): Promise<Response | null>;

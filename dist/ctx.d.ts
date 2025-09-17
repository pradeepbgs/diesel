import { Server } from "bun";
import type { ContextType } from "./types";
export default function createCtx(req: Request, server: Server, pathname: string, routePattern: string | undefined): ContextType;
export declare function extractDynamicParams(originalPath: string, incomingPath: string): Record<string, string> | null;

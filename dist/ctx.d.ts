import { Server } from "bun";
import type { ContextType } from "./types";
export default function createCtx(req: Request, server: Server, pathname: string, routePattern: string | undefined): ContextType;

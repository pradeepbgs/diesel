import { Server } from "bun";
import type { DieselT } from "./types";
export default function handleRequest(req: Request, server: Server, diesel: DieselT, env?: Record<string, any>, executionContext?: any): Promise<Response | undefined>;

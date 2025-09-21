import { Server } from "bun";
import type { DieselT } from "./types";
export default function handleRequest(req: Request, server: Server, diesel: DieselT): Promise<Response | undefined>;

/// <reference types="bun-types" />
import { Server } from "bun";
import type { DieselT } from "./types";
export default function handleRequest(req: Request, server: Server, url: URL, diesel: DieselT): Promise<Response>;

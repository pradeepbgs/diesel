/// <reference types="bun-types" />
import { Server } from "bun";
import type { ContextType } from "./types";
export default function createCtx(req: Request, server: Server, url: URL): ContextType;

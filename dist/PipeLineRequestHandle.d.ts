import { Server } from "bun";
import { DieselT } from "./types";
export declare const pipelineHandler: (req: Request, server: Server, url: URL, diesel: DieselT) => Promise<any>;

import { CompileConfig, DieselT } from "./types";
export declare const buildRequestPipeline: (config: CompileConfig, diesel: DieselT) => any;
export declare const BunRequestPipline: (config: CompileConfig, diesel: DieselT, method: string, path: string, ...handlersOrResponse: Function[]) => any;

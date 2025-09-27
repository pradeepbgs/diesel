import { DieselT } from "./types";
export declare const buildRequestPipeline: (diesel: DieselT) => any;
export declare const BunRequestPipline: (diesel: DieselT, method: string, path: string, ...handlersOrResponse: Function[]) => any;

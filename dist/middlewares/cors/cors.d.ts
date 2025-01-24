import { middlewareFunc } from "../../types";
export interface CorsOptions {
    origin?: string | string[];
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
}
export declare const cors: (config: CorsOptions) => middlewareFunc;

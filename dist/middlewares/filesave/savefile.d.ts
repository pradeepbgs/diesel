import { ContextType } from "../../types";
export declare const fileSaveMiddleware: (options?: {
    dest?: string;
    fields?: string[];
}) => (ctx: ContextType) => Promise<Response | undefined>;

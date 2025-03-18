import { ContextType } from "../../types";
export declare const advancedLogger: (app: any) => void;
type PrintFunc = (str: string, ...rest: string[]) => void;
export declare const logger: (fn?: PrintFunc) => (ctx: ContextType) => Promise<void>;
export {};

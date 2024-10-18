import { ContextType } from "./types";
export default function rateLimit(props: {
    time?: number;
    max?: number;
    message?: string;
}): (ctx: ContextType) => void | Response;
export declare const binaryS: (arr: string[], target: string, start: number, end: number) => boolean;

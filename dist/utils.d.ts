import { ContextType } from "./types";
export default function rateLimit(props: {
    time?: number;
    max?: number;
    message?: string;
}): (ctx: ContextType) => void | Response;
export declare function getMimeType(filePath: string): string;
export declare const binaryS: (arr: string[], target: string, start: number, end: number) => boolean;

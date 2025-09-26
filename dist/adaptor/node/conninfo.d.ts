import * as http from 'http';
export interface ConnInfo {
    protocol: string;
    host: string;
    url: string;
    ip?: string;
    headers: Record<string, string | string[]>;
}
export declare function connInfo(req: http.IncomingMessage | Request): ConnInfo;

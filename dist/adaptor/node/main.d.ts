export interface options {
    fetch: (req: Request, ...args: any) => Response | Promise<Response>;
    port: number;
}
export declare function serve(options: options): void;

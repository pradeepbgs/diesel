export interface RateLimitStore{
    get(key:string): Promise<number | null>;
    set(key:string, value:string, ttlMs:number): Promise<void>
    reset(key:string): Promise<void>
}
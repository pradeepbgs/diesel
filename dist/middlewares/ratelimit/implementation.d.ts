export interface RateLimitStore {
    get(key: string): Promise<number | null>;
    set(key: string, value: string, ttlMs: number): Promise<void>;
    reset(key: string): Promise<void>;
}
declare class RedisStore implements RateLimitStore {
    private redis;
    constructor(redis: any);
    get(key: string): Promise<number | null>;
    set(key: string, value: string, ttlMs: number): Promise<void>;
    reset(key: string): Promise<void>;
}
export { RedisStore, };

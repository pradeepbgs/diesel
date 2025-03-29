export interface RateLimitStore{
    get(key:string): Promise<number | null>;
    set(key:string, value:string, ttlMs:number): Promise<void>
    reset(key:string): Promise<void>
}

class RedisStore implements RateLimitStore{
    constructor(private redis:any){
        
    }
    
    async get(key:string){
        const value = await this.redis.get(key)
        return value ? parseInt(value) : null
    }

    async set(key:string, value:string, ttlMs:number){
        await this.redis.set(key,value,'PX',ttlMs)
    }

    async reset(key:string){
        await this.redis.del(key)
    }
    
}

class DiceDbStore implements RateLimitStore{
    constructor(private dicedb:any){
        
    }
    async get(key:string){
        const value = await this.dicedb.get(key)
        return value ? parseInt(value) : null
    }

    async set(key:string, value:string, ttlMs:number){
        await this.dicedb.set(key,value,'PX',ttlMs)
    }

    async reset(key:string){
        await this.dicedb.del(key)
    }
    
}


export {
    RedisStore,
    DiceDbStore
}
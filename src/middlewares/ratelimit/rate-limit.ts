import { ContextType } from "../../types";
import { RateLimitStore } from "./interface";

type Props = {
    windowMs?: number,
    max?: number,
    message?: string
    store?: RateLimitStore
}


const requests = new Map<string, { count: number; startTime: number }>();

export const rateLimit = (props: Props) => {
    const {
        windowMs = 60000,
        max = 100,
        message = "Rate limit exceeded. Please try again later.",
        store
    } = props;

    return async (ctx: ContextType): Promise<Response | void> => {
        const socketIP = ctx.ip as string;
        
        // if user has given store ( instance of their redis)
        if (store) {
            const key = `rate-limit:${socketIP}`;

            let count = await store.get(key);
            count = count ? count + 1 : 1;

            if (count > max) {
                return ctx.json({ error: message }, 429);
            }

            await store.set(key, count.toString(), windowMs);
            return
        }

        // Default in-memory store
        const currentTime = Date.now();
        if (!requests.has(socketIP)) {
            requests.set(socketIP, { count: 1, startTime: currentTime });
        }
        else {
            const requestInfo = requests.get(socketIP)!;

            if (currentTime - requestInfo.startTime > windowMs) {
                requestInfo.count = 1;
                requestInfo.startTime = currentTime;
            } else {
                requestInfo.count++;
            }

            if (requestInfo.count > max) {
                return ctx.json({ error: message }, 429);
            }
        }
    };
};

import diesel from "./main";
import type { handlerFunction } from "./types";
declare class Router extends diesel {
    #private;
    constructor();
    get(path: string, ...handlers: handlerFunction[]): this;
    post(path: string, ...handlers: handlerFunction[]): this;
    put(path: string, ...handlers: handlerFunction[]): this;
    patch(path: string, ...handlers: handlerFunction[]): this;
    delete(path: string, ...handlers: handlerFunction[]): this;
}
export default Router;

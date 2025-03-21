import { ContextType } from "diesel-core";

export const asyncHandler = <T>(
  fn: (ctx: ContextType) => Promise<T>
) => {
  return async (ctx: ContextType) => {
    try {
      return await fn(ctx);
    } catch (error) {
      console.error("Error:", error);
      return ctx.json({ message: "Internal Server Error" }, 500);
    }
  };
};

 type Success<T> = {
    data: T;
    error: null;
  };
  
  type Failure<E> = {
    data: null;
    error: E;
  };
  
  type Result<T, E = Error> = Success<T> | Failure<E>;
  
  // Main wrapper function
  export async function tryCatch<T, E = Error>(
    promise: Promise<T>,
  ): Promise<Result<T, E>> {
    try {
      const data = await promise;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as E };
    }
  }
import { type ContextType } from "diesel-core";
import { asyncHandler } from "../../utils/try-catch";

export const POST = asyncHandler(async (ctx: ContextType) => {

  const { email, password } = await ctx.body;

  if (!email || !password) {
    return ctx.json({ message: "Email and password are required" }, 400);
  }

  return ctx.json({ message: "Login successful" }, 200);
});

// GET req withing same endpoint
export const GET = asyncHandler(async (ctx: ContextType) => {
  return ctx.json({ message: "GET request received" }, 200);
});
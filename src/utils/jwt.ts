import { ContextType } from "../types";

function authenticateJwtMiddleware(jwt: any, user_jwt_secret: string) {
    if (!jwt) {
      throw new Error("JWT library is not defined, please provide jwt to authenticateJwt Function");
    }
    return (ctx: ContextType) => {
      try {
        let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");
        if (!token) {
          return ctx.json({ message: "Unauthorized: No token provided" }, 401);
        }
  
        if (token.startsWith("Bearer ")) {
          token = token.slice(7);
        }
        const decoded = jwt?.verify(token, user_jwt_secret);
        if (!decoded) {
          return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
        }
  
        ctx.set("user", decoded);
      } catch (error:any) {
        console.error("JWT verification error:", error);
        return ctx.json({ message: "Unauthorized: Invalid token", error: error?.message }, 401);
      }
    };
  }
  
  function authenticateJwtDbMiddleware(jwt: any, User: any, user_jwt_secret: string) {
    if (!jwt) {
      throw new Error("JWT library is not defined, please provide jwt to authenticateJwtDB Function");
    }
    if (!User) {
      throw new Error("User model is not defined, please provide UserModel to authenticateJwtDB Function")
    }
    return async (ctx: ContextType) => {
      try {
        let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");
  
        if (!token) {
          return ctx.json({ message: "Unauthorized: No token provided" }, 401);
        }
  
        if (token.startsWith("Bearer ")) {
          token = token.slice(7);
        }
  
        const decodedToken = jwt?.verify(token, user_jwt_secret);
  
        if (!decodedToken) {
          return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
        }
  
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  
        if (!user) {
          return ctx.json({ message: "Unauthorized: User not found" }, 401);
        }
  
        ctx.set("user", user);
        return;
      } catch (error:any) {
        // console.error("JWT/DB authentication error:", error?.message);
        return ctx.json({ message: "Unauthorized: Authentication failed",error: error?.message }, 401);
      }
    };
  }
  
  export { authenticateJwtMiddleware, authenticateJwtDbMiddleware };
  
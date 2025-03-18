import { ContextType } from "./types";

export default function rateLimit(props: { time?: number; max?: number; message?: string }) {
    const {
        time: windowMs = 60000,
        max = 100,
        message = "Rate limit exceeded. Please try again later."
    } = props;

    const requests = new Map<string, { count: number, startTime: any }>()

    return (ctx: ContextType): void | Response => {
        const currentTime: any = new Date()
        const socketIP = ctx.ip as string

        if (!requests.has(socketIP)) {
            requests.set(socketIP, { count: 0, startTime: currentTime })
        }
        const requestInfo = requests.get(socketIP)
        if (requestInfo) {
            if (currentTime - requestInfo.startTime > windowMs) {
                requestInfo.count = 1
                requestInfo.startTime = currentTime
            } else {
                requestInfo.count++
            }
        }

        if (requestInfo && requestInfo.count > max) {
            return ctx.json({
                error: message
            },429)
        }

    }
}

export function getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'application/javascript';
      case 'css':
        return 'text/css';
      case 'html':
        return 'text/html';
      case 'json':
        return 'application/json';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'svg':
        return 'image/svg+xml';
      case 'gif':
        return 'image/gif';
      case 'woff':
        return 'font/woff';
      case 'woff2':
        return 'font/woff2';
      default:
        return 'application/octet-stream';
    }
  }

  


export const binaryS = (arr:string[], target:string,start:number,end:number) : boolean =>{
    if (start > end){
        return false;
    }
    let mid :number = start + (end-start)/2;
    if (arr[mid] == target){
        return true;
    }

    if (arr[mid] > target){
        return binaryS(arr,target,start,mid-1);
    }
    return binaryS(arr,target,mid+1,end);

}


// import jwt from 'jsonwebtoken';

// function authenticateJwtMiddleware(user_jwt_secret: string) {
//     return (ctx: ContextType) => {
//         try {
//             let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");

//             if (!token) {
//                 return ctx.json({ message: "Unauthorized: No token provided" }, 401);
//             }

//             if (token.startsWith("Bearer ")) {
//                 token = token.slice(7);
//             }

//             const decoded = jwt.verify(token, user_jwt_secret);

//             if (!decoded) {
//                 return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
//             }

//             ctx.set("user", decoded);
//             return;
//         } catch (error) {
//             console.error("JWT verification error:", error);
//             return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
//         }
//     };
// }

// function authenticateJwtDbMiddleware(User: any, user_jwt_secret: string) {
//     return async (ctx: ContextType) => {
//         try {
//             let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");

//             if (!token) {
//                 return ctx.json({ message: "Unauthorized: No token provided" }, 401);
//             }

//             if (token.startsWith("Bearer ")) {
//                 token = token.slice(7);
//             }

//             const decodedToken = jwt.verify(token, user_jwt_secret);

//             if (!decodedToken) {
//                 return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
//             }

//             const user = await User.findById(decodedToken._id).select("-password -refreshToken");

//             if (!user) {
//                 return ctx.json({ message: "Unauthorized: User not found" }, 401);
//             }

//             ctx.set("user", user);
//             return;
//         } catch (error) {
//             console.error("JWT/DB authentication error:", error);
//             return ctx.json({ message: "Unauthorized: Authentication failed" }, 401);
//         }
//     };
// }

export { authenticateJwtMiddleware, authenticateJwtDbMiddleware };

// public int Bsearch(int[] arr,int target,int start,int end){
//     if (start > end){
//         return -1;
//     }

//     int mid = start + (end-start)/2;

//     if (arr[mid] == target){
//         return mid;
//     }

//     if (arr[mid] > target){
//     return Bsearch(arr,target,start,mid-1);
//     }
//     return Bsearch(arr,target,mid+1,end);
// }
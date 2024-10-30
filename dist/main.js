var R=Object.create;var{getPrototypeOf:S,defineProperty:T,getOwnPropertyNames:O}=Object;var I=Object.prototype.hasOwnProperty;var v=(G,J,F)=>{F=G!=null?R(S(G)):{};let X=J||!G||!G.__esModule?T(F,"default",{value:G,enumerable:!0}):F;for(let Z of O(G))if(!I.call(X,Z))T(X,Z,{get:()=>G[Z],enumerable:!0});return X};var H=(G,J)=>()=>(J||G((J={exports:{}}).exports,J),J.exports);var b=H((C)=>{Object.defineProperty(C,"__esModule",{value:!0});C.parse=x;C.serialize=u;var q=/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/,g=/^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/,y=/^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,f=/^[\u0020-\u003A\u003D-\u007E]*$/,m=Object.prototype.toString,k=(()=>{let G=function(){};return G.prototype=Object.create(null),G})();function x(G,J){let F=new k,X=G.length;if(X<2)return F;let Z=J?.decode||c,Y=0;do{let z=G.indexOf("=",Y);if(z===-1)break;let L=G.indexOf(";",Y),U=L===-1?X:L;if(z>U){Y=G.lastIndexOf(";",z-1)+1;continue}let W=j(G,Y,z),D=N(G,z,W),B=G.slice(W,D);if(F[B]===void 0){let $=j(G,z+1,U),_=N(G,U,$),A=Z(G.slice($,_));F[B]=A}Y=U+1}while(Y<X);return F}function j(G,J,F){do{let X=G.charCodeAt(J);if(X!==32&&X!==9)return J}while(++J<F);return F}function N(G,J,F){while(J>F){let X=G.charCodeAt(--J);if(X!==32&&X!==9)return J+1}return F}function u(G,J,F){let X=F?.encode||encodeURIComponent;if(!q.test(G))throw new TypeError(`argument name is invalid: ${G}`);let Z=X(J);if(!g.test(Z))throw new TypeError(`argument val is invalid: ${J}`);let Y=G+"="+Z;if(!F)return Y;if(F.maxAge!==void 0){if(!Number.isInteger(F.maxAge))throw new TypeError(`option maxAge is invalid: ${F.maxAge}`);Y+="; Max-Age="+F.maxAge}if(F.domain){if(!y.test(F.domain))throw new TypeError(`option domain is invalid: ${F.domain}`);Y+="; Domain="+F.domain}if(F.path){if(!f.test(F.path))throw new TypeError(`option path is invalid: ${F.path}`);Y+="; Path="+F.path}if(F.expires){if(!h(F.expires)||!Number.isFinite(F.expires.valueOf()))throw new TypeError(`option expires is invalid: ${F.expires}`);Y+="; Expires="+F.expires.toUTCString()}if(F.httpOnly)Y+="; HttpOnly";if(F.secure)Y+="; Secure";if(F.partitioned)Y+="; Partitioned";if(F.priority)switch(typeof F.priority==="string"?F.priority.toLowerCase():F.sameSite){case"low":Y+="; Priority=Low";break;case"medium":Y+="; Priority=Medium";break;case"high":Y+="; Priority=High";break;default:throw new TypeError(`option priority is invalid: ${F.priority}`)}if(F.sameSite)switch(typeof F.sameSite==="string"?F.sameSite.toLowerCase():F.sameSite){case!0:case"strict":Y+="; SameSite=Strict";break;case"lax":Y+="; SameSite=Lax";break;case"none":Y+="; SameSite=None";break;default:throw new TypeError(`option sameSite is invalid: ${F.sameSite}`)}return Y}function c(G){if(G.indexOf("%")===-1)return G;try{return decodeURIComponent(G)}catch(J){return G}}function h(G){return m.call(G)==="[object Date]"}});class V{children;isEndOfWord;handler;isDynamic;pattern;path;method;subMiddlewares;constructor(){this.children={},this.isEndOfWord=!1,this.handler=[],this.isDynamic=!1,this.pattern="",this.path="",this.method=[],this.subMiddlewares=new Map}}class K{root;constructor(){this.root=new V}insert(G,J){let F=this.root,X=G.split("/").filter(Boolean);if(G==="/"){F.isEndOfWord=!0,F.handler.push(J.handler),F.path=G,F.method.push(J.method);return}for(let Z of X){let Y=!1,z=Z;if(Z.startsWith(":"))Y=!0,z=":";if(!F.children[z])F.children[z]=new V;F=F.children[z],F.isDynamic=Y,F.pattern=Z,F.method.push(J.method),F.handler.push(J.handler),F.path=G}F.isEndOfWord=!0,F.method.push(J.method),F.handler.push(J.handler),F.path=G}search(G,J){let F=this.root,X=G.split("/").filter(Boolean);for(let Y of X){let z=Y;if(!F.children[z])if(F.children[":"])F=F.children[":"];else return null;else F=F.children[z]}let Z=F.method.indexOf(J);if(Z!==-1)return{path:F.path,handler:F.handler[Z],isDynamic:F.isDynamic,pattern:F.pattern,method:F.method[Z]};return{path:F.path,handler:F.handler,isDynamic:F.isDynamic,pattern:F.pattern,method:F.method[Z]}}}var P=v(b(),1);function E(G,J,F){let X=new Headers,Z={},Y=!1,z,L=null,U,W,D=200,B={};return{req:G,server:J,url:F,getUser(){return B},setUser($){if($)B=$},status($){return D=$,this},getIP(){return this.server.requestIP(this.req)},async getBody(){if(!W)W=await d(G);if(W.error)return new Response(JSON.stringify({error:W.error}),{status:400});return W},setHeader($,_){return X.set($,_),this},set($,_){return Z[$]=_,this},get($){return Z[$]||null},setAuth($){return Y=$,this},getAuth(){return Y},text($,_){return new Response($,{status:_??D,headers:X})},send($,_){return new Response($,{status:_??D,headers:X})},json($,_){return new Response(JSON.stringify($),{status:_??D,headers:X})},html($,_){return new Response(Bun.file($),{status:_??D,headers:X})},file($,_){return new Response(Bun.file($),{status:_??D,headers:X})},redirect($,_){return X.set("Location",$),new Response(null,{status:_??302,headers:X})},setCookie($,_,A={}){let Q=`${encodeURIComponent($)}=${encodeURIComponent(_)}`;if(A.maxAge)Q+=`; Max-Age=${A.maxAge}`;if(A.expires)Q+=`; Expires=${A.expires.toUTCString()}`;if(A.path)Q+=`; Path=${A.path}`;if(A.domain)Q+=`; Domain=${A.domain}`;if(A.secure)Q+="; Secure";if(A.httpOnly)Q+="; HttpOnly";if(A.sameSite)Q+=`; SameSite=${A.sameSite}`;return X?.append("Set-Cookie",Q),this},getParams($){if(!U&&G?.routePattern)U=i(G?.routePattern,F?.pathname);return $?U[$]||{}:U},getQuery($){try{if(!z)z=Object.fromEntries(F.searchParams);return $?z[$]||{}:z}catch(_){return{}}},getCookie($){if(!L){let _=G.headers.get("cookie");if(_)L=P.default.parse(_);else return null}if(!L)return null;if($)return L[$]??null;else return L}}}function i(G,J){let F={},X=G.split("/"),[Z]=J.split("?"),Y=Z.split("/");if(X.length!==Y.length)return null;return X.forEach((z,L)=>{if(z.startsWith(":")){let U=z.slice(1);F[U]=Y[L]}}),F}async function d(G){let J=G.headers.get("Content-Type")||"";if(!J)return{};try{if(J.startsWith("application/json"))return await G.json();if(J.startsWith("application/x-www-form-urlencoded")){let F=await G.text();return Object.fromEntries(new URLSearchParams(F))}if(J.startsWith("multipart/form-data")){let F=await G.formData(),X={};for(let[Z,Y]of F.entries())X[Z]=Y;return X}return{error:"Unknown request body type"}}catch(F){return{error:"Invalid request body format"}}}async function M(G,J,F,X){let Z=X.trie.search(F.pathname,G.method);if(!Z||Z.method!==G.method){let L=Z?"Method not allowed":`Route not found for ${F.pathname}`,U=Z?405:404;return new Response(JSON.stringify({message:L}),{status:U})}if(Z.isDynamic)G.routePattern=Z.path;let Y=E(G,J,F);if(X.corsConfig){let L=a(G,Y,X.corsConfig);if(L)return L}if(X.hasOnReqHook&&X.hooks.onRequest)X.hooks.onRequest(G,F,J);if(X.hasFilterEnabled){let L=G.routePattern??F.pathname;if(X.filters.includes(L)===!1)if(X.filterFunction)try{let W=await X.filterFunction(Y,J);if(W)return W}catch(W){return console.error("Error in filterFunction:",W),Y.status(500).json({message:"Internal Server Error",error:W.message})}else return Y.status(400).json({message:"Authentication required"})}if(X.hasMiddleware){for(let U of X.globalMiddlewares){let W=await U(Y,J);if(W)return W}let L=X.middlewares.get(F.pathname)||[];for(let U of L){let W=await U(Y,J);if(W)return W}}if(X.hasPreHandlerHook&&X.hooks.preHandler){let L=await X.hooks.preHandler(Y);if(L)return L}let z=await Z.handler(Y);if(X.hasPostHandlerHook&&X.hooks.postHandler)await X.hooks.postHandler(Y);if(X.hasOnSendHook&&X.hooks.onSend){let L=await X.hooks.onSend(Y,z);if(L)return L}return z??Y.status(204).json({message:"No response from this handler"})}function a(G,J,F={}){let X=G.headers.get("origin")??"*",Z=F?.origin,Y=F?.allowedHeaders??["Content-Type","Authorization"],z=F?.methods??["GET","POST","PUT","DELETE","OPTIONS"],L=F?.credentials??!1,U=F?.exposedHeaders??[];if(J.setHeader("Access-Control-Allow-Methods",z),J.setHeader("Access-Control-Allow-Headers",Y),J.setHeader("Access-Control-Allow-Credentials",L),U.length)J.setHeader("Access-Control-Expose-Headers",U);if(Z==="*")J.setHeader("Access-Control-Allow-Origin","*");else if(Array.isArray(Z))if(X&&Z.includes(X))J.setHeader("Access-Control-Allow-Origin",X);else if(Z.includes("*"))J.setHeader("Access-Control-Allow-Origin","*");else return J.status(403).json({message:"CORS not allowed"});else if(typeof Z==="string")if(X===Z)J.setHeader("Access-Control-Allow-Origin",X);else return J.status(403).json({message:"CORS not allowed"});else return J.status(403).json({message:"CORS not allowed"});if(J.setHeader("Access-Control-Allow-Origin",X),G.method==="OPTIONS")return J.setHeader("Access-Control-Max-Age","86400"),J.status(204).text("");return null}class w{globalMiddlewares;middlewares;trie;hasOnReqHook;hasMiddleware;hasPreHandlerHook;hasPostHandlerHook;hasOnSendHook;hasOnError;hooks;corsConfig;FilterRoutes;filters;filterFunction;hasFilterEnabled;constructor(){this.globalMiddlewares=[],this.middlewares=new Map,this.trie=new K,this.corsConfig=null,this.hasMiddleware=!1,this.hasOnReqHook=!1,this.hasPreHandlerHook=!1,this.hasPostHandlerHook=!1,this.hasOnSendHook=!1,this.hasOnError=!1,this.hooks={onRequest:null,preHandler:null,postHandler:null,onSend:null,onError:null,onClose:null},this.FilterRoutes=[],this.filters=[],this.filterFunction=null,this.hasFilterEnabled=!1}filter(){return this.hasFilterEnabled=!0,{routeMatcher:(...G)=>{return this.FilterRoutes=G.sort(),this.filter()},permitAll:()=>{for(let G of this?.FilterRoutes)this.filters.push(G);return this.filter()},require:(G)=>{if(G)this.filterFunction=G}}}cors(G){this.corsConfig=G}addHooks(G,J){if(typeof G!=="string")throw new Error("hookName must be a string");if(typeof J!=="function")throw new Error("callback must be a instance of function");if(this.hooks.hasOwnProperty(G)){if(G==="onError"&&J)this.hooks.onError=J;else if(G==="onRequest"&&J)this.hooks.onRequest=J;else if(G!=="onError"&&G!=="onRequest"&&J)this.hooks[G]=J}else throw new Error(`Unknown hook type: ${G}`)}compile(){if(this.globalMiddlewares.length>0)this.hasMiddleware=!0;for(let[G,J]of this.middlewares.entries())if(J.length>0){this.hasMiddleware=!0;break}if(this.hooks.onRequest)this.hasOnReqHook=!0;if(this.hooks.preHandler)this.hasPreHandlerHook=!0;if(this.hooks.postHandler)this.hasPostHandlerHook=!0;if(this.hooks.onSend)this.hasOnSendHook=!0;if(this.hooks.onError)this.hasOnError=!0}listen(G,J,{sslCert:F=null,sslKey:X=null}={}){if(typeof Bun==="undefined")throw new Error(".listen() is designed to run on Bun only...");if(typeof G!=="number")throw new Error("Port must be a numeric value");this.compile();let Z={port:G,fetch:async(z,L)=>{let U=new URL(z.url);try{return await M(z,L,U,this)}catch(W){if(this.hasOnError&&this.hooks.onError){let D=await this.hooks.onError(W,z,U,L);if(D)return D}return new Response(JSON.stringify({message:"Internal Server Error",error:W.message}),{status:500})}}};if(F&&X)Z.certFile=F,Z.keyFile=X;let Y=Bun?.serve(Z);if(typeof J==="function")return J();if(F&&X)console.log(`HTTPS server is running on https://localhost:${G}`);else console.log(`HTTP server is running on http://localhost:${G}`);return Y}register(G,J){if(typeof G!=="string")throw new Error("path must be a string");if(typeof J!=="object")throw new Error("handler parameter should be a instance of router object",J);let F=Object.entries(J.trie.root.children);J.trie.root.subMiddlewares.forEach((X,Z)=>{if(!this.middlewares.has(G+Z))this.middlewares.set(G+Z,[]);X?.forEach((Y)=>{if(!this.middlewares.get(G+Z)?.includes(Y))this.middlewares.get(G+Z)?.push(Y)})});for(let[X,Z]of F){let Y=G+Z?.path,z=Z.handler[0],L=Z.method[0];this.trie.insert(Y,{handler:z,method:L})}J.trie=new K}addRoute(G,J,F){if(typeof J!=="string")throw new Error("Path must be a string type");if(typeof G!=="string")throw new Error("method must be a string type");let X=F.slice(0,-1),Z=F[F.length-1];if(!this.middlewares.has(J))this.middlewares.set(J,[]);X.forEach((Y)=>{if(J==="/"){if(!this.globalMiddlewares.includes(Y))this.globalMiddlewares.push(Y)}else if(!this.middlewares.get(J)?.includes(Y))this.middlewares.get(J)?.push(Y)}),this.trie.insert(J,{handler:Z,method:G})}use(G,J){if(typeof G==="function"){if(!this.globalMiddlewares.includes(G))this.globalMiddlewares.push(G);return}let F=G;if(!this.middlewares.has(F))this.middlewares.set(F,[]);if(J){if(!this.middlewares.get(F)?.includes(J))this.middlewares.get(F)?.push(J)}}get(G,...J){return this.addRoute("GET",G,J),this}post(G,...J){return this.addRoute("POST",G,J),this}put(G,...J){return this.addRoute("PUT",G,J),this}patch(G,...J){return this.addRoute("PATCH",G,J),this}delete(G,...J){return this.addRoute("DELETE",G,J),this}}export{w as default};

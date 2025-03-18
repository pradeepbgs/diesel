var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/utils.ts
function rateLimit(props) {
  const {
    time: windowMs = 60000,
    max = 100,
    message = "Rate limit exceeded. Please try again later."
  } = props;
  const requests = new Map;
  return (ctx) => {
    const currentTime = new Date;
    const socketIP = ctx.ip;
    if (!requests.has(socketIP)) {
      requests.set(socketIP, { count: 0, startTime: currentTime });
    }
    const requestInfo = requests.get(socketIP);
    if (requestInfo) {
      if (currentTime - requestInfo.startTime > windowMs) {
        requestInfo.count = 1;
        requestInfo.startTime = currentTime;
      } else {
        requestInfo.count++;
      }
    }
    if (requestInfo && requestInfo.count > max) {
      return ctx.json({
        error: message
      }, 429);
    }
  };
}
function getMimeType(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "application/javascript";
    case "css":
      return "text/css";
    case "html":
      return "text/html";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    case "gif":
      return "image/gif";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}
var binaryS = (arr, target, start, end) => {
  if (start > end) {
    return false;
  }
  let mid = start + (end - start) / 2;
  if (arr[mid] == target) {
    return true;
  }
  if (arr[mid] > target) {
    return binaryS(arr, target, start, mid - 1);
  }
  return binaryS(arr, target, mid + 1, end);
};
export {
  getMimeType,
  rateLimit as default,
  binaryS
};

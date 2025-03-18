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

// src/trie.ts
class TrieNode {
  children;
  isEndOfWord;
  handler;
  isDynamic;
  pattern;
  path;
  method;
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = [];
    this.isDynamic = false;
    this.pattern = "";
    this.path = "";
    this.method = [];
  }
}

class Trie {
  root;
  constructor() {
    this.root = new TrieNode;
  }
  insert(path, route) {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);
    if (path === "/") {
      node.isEndOfWord = true;
      node.handler.push(route.handler);
      node.path = path;
      node.method.push(route.method);
      return;
    }
    for (const segment of pathSegments) {
      let isDynamic = false;
      let key = segment;
      if (segment.startsWith(":")) {
        isDynamic = true;
        key = ":";
      }
      if (!node.children[key]) {
        node.children[key] = new TrieNode;
      }
      node = node.children[key];
      node.isDynamic = isDynamic;
      node.pattern = segment;
      node.method.push(route.method);
      node.handler.push(route.handler);
      node.path = path;
    }
    node.isEndOfWord = true;
    node.method.push(route.method);
    node.handler.push(route.handler);
    node.path = path;
  }
  search(path, method) {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);
    const totalSegments = pathSegments.length;
    for (const segment of pathSegments) {
      let key = segment;
      if (!node.children[key]) {
        if (node.children[":"]) {
          node = node.children[":"];
        } else {
          return null;
        }
      } else {
        node = node.children[key];
      }
    }
    const routeSegments = node.path.split("/").filter(Boolean);
    if (totalSegments !== routeSegments.length) {
      return null;
    }
    const routeMethodIndex = node.method.indexOf(method);
    if (routeMethodIndex !== -1) {
      return {
        path: node.path,
        handler: node.handler[routeMethodIndex],
        isDynamic: node.isDynamic,
        pattern: node.pattern,
        method: node.method[routeMethodIndex]
      };
    }
    return {
      path: node.path,
      handler: node.handler,
      isDynamic: node.isDynamic,
      pattern: node.pattern,
      method: node.method[routeMethodIndex]
    };
  }
}
export {
  Trie as default
};

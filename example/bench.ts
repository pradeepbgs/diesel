import { performance } from "node:perf_hooks";

// -------- Custom Parser --------
function parseRequestUrl(rawUrl) {
  let pathAndQuery;

  const protoIndex = rawUrl.indexOf("://");
  if (protoIndex !== -1) {
    const firstSlashAfterHost = rawUrl.indexOf("/", protoIndex + 3);
    pathAndQuery = firstSlashAfterHost === -1 ? "/" : rawUrl.slice(firstSlashAfterHost);
  } else if (rawUrl.startsWith("//")) {
    const firstSlash = rawUrl.indexOf("/", 2);
    pathAndQuery = firstSlash === -1 ? "/" : rawUrl.slice(firstSlash);
  } else {
    pathAndQuery = rawUrl || "/";
  }

  const qIdx = pathAndQuery.indexOf("?");
  if (qIdx === -1) {
    return { pathname: pathAndQuery, query: null };
  }
  const pathname = qIdx === 0 ? "/" : pathAndQuery.slice(0, qIdx);
  const query = pathAndQuery.slice(qIdx + 1);
  return { pathname, query };
}

// -------- Benchmark Setup --------
const TEST_URL = "http://localhost:3000/hello/world?foo=bar&baz=123";
const ITERATIONS = 1_000_000;

console.log(`Running benchmark with ${ITERATIONS.toLocaleString()} iterations...`);

// -------- Benchmark: new URL() --------
const startNative = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const u = new URL(TEST_URL);
  const path = u.pathname;
  const query = u.searchParams.get("foo"); // simulate typical use
}
const endNative = performance.now();
console.log(`new URL(): ${(endNative - startNative).toFixed(2)}ms`);

// -------- Benchmark: Custom Parser --------
const startCustom = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const { pathname, query } = parseRequestUrl(TEST_URL);
  // simulate checking a single query param manually
  if (query && query.includes("foo=")) {}
}
const endCustom = performance.now();
console.log(`Custom Parser: ${(endCustom - startCustom).toFixed(2)}ms`);

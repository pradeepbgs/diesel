import { TrieRouter } from "../../src/router/trie";
import { TrieRouter2 } from "../../src/router/trie2";
import { FastRouter } from "./fast-r";
import { FindMyWayRouter } from "./find-my-way";
import { performance } from "perf_hooks";

const NUM_ROUTES = 2000;
const LARGE_ROUTES = 50000;
const SEARCH_ITERATIONS = 1_000_000;

const dummyHandler = () => "ok";

function forceGC() {
  if (global.gc) global.gc()
}

function mem(label: string) {
  const m = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`${label} memory: ${m.toFixed(2)} MB`);
}

function percentile(arr: number[], p: number) {
  const idx = Math.floor(arr.length * p);
  return arr.sort((a, b) => a - b)[idx];
}

function latencyTest(router: any, paths: string[], name: string) {
  const samples: number[] = [];

  for (let i = 0; i < 10000; i++) router.find("GET", paths[i]); // warmup
  forceGC();

  for (let i = 0; i < 50000; i++) {
    const t0 = performance.now();
    router.find("GET", paths[i]);
    const t1 = performance.now();
    samples.push(t1 - t0);
  }

  console.log(
    `${name} latency p50=${percentile(samples, 0.5).toFixed(4)}ms ` +
    `p90=${percentile(samples, 0.9).toFixed(4)}ms ` +
    `p99=${percentile(samples, 0.99).toFixed(4)}ms`
  );
}

function benchmarkInsert(router: any, routes: string[], name: string) {
  forceGC();
  const t0 = performance.now();
  for (const r of routes) router.add("GET", r, dummyHandler);
  const t1 = performance.now();
  console.log(`${name} insert ${(t1 - t0).toFixed(2)} ms`);
  mem(name);
}

function benchmarkLookup(router: any, paths: string[], name: string) {
  for (let i = 0; i < 100000; i++) router.find("GET", paths[i]); // warmup
  forceGC();

  const t0 = performance.now();
  for (const p of paths) router.find("GET", p);
  const t1 = performance.now();

  const ms = t1 - t0;
  const rps = (SEARCH_ITERATIONS / (ms / 1000)).toFixed(0);

  console.log(`${name} lookup ${ms.toFixed(2)} ms | RPS ${rps}`);
}

function benchmarkParamCost(router: any, paths: string[], name: string) {
  for (let i = 0; i < 100000; i++) router.find("GET", paths[i]);
  forceGC();

  const t0 = performance.now();
  for (const p of paths) {
    const r = router.find("GET", p);
    if (r?.params) {
      for (const k in r.params) void r.params[k];
    }
  }
  const t1 = performance.now();
  console.log(`${name} param extraction ${(t1 - t0).toFixed(2)} ms`);
}

function makeRoutes(n: number) {
  const routes: string[] = [];
  for (let i = 0; i < n; i++) {
    routes.push(`/api/users/${i}`);
    routes.push(`/api/posts/${i}/comments/:id`);
    routes.push(`/shop/:cat/products/${i}`);
  }
  return routes;
}

function makeDeepRoutes(n: number) {
  const routes: string[] = [];
  for (let i = 0; i < n; i++) {
    routes.push(`/a/b/c/d/e/f/g/h/i/j/${i}/:id`);
  }
  return routes;
}

function makeConflictRoutes(n: number) {
  const routes: string[] = [];

  for (let i = 0; i < n; i++) {
    routes.push(`/users/${i}`);                 // static unique
    routes.push(`/users/${i}/posts`);
    routes.push(`/users/:id/comments/${i}`);    // param vs static conflict
    routes.push(`/users/settings/${i}`);
  }

  // Add classic conflict set once
  routes.push("/users/me");
  routes.push("/users/:id");
  routes.push("/users/:id/posts");
  routes.push("/users/settings");

  return routes;
}


function makeLookupPaths(n: number) {
  return Array.from({ length: SEARCH_ITERATIONS }, () => {
    const id = Math.floor(Math.random() * n);
    const r = Math.random();
    if (r < 0.33) return `/api/users/${id}`;
    if (r < 0.66) return `/api/posts/${id}/comments/${id}`;
    return `/shop/electronics/products/${id}`;
  });
}

function runSuite(title: string, routes: string[], lookupBase: number) {
  console.log(`\n===== ${title} =====`);

  const paths = makeLookupPaths(lookupBase);

  const routers = {
    FindMyWay: new FindMyWayRouter(),
    Trie1: new TrieRouter(),
    Trie2: new TrieRouter2(),
    FastR : new FastRouter()
  };

  for (const [name, r] of Object.entries(routers)) {
    benchmarkInsert(r, routes, name);
  }

  for (const [name, r] of Object.entries(routers)) {
    benchmarkLookup(r, paths, name);
  }

  for (const [name, r] of Object.entries(routers)) {
    benchmarkParamCost(r, paths, name);
  }

  for (const [name, r] of Object.entries(routers)) {
    latencyTest(r, paths, name);
  }
}

// ---------- RUN ALL TESTS ----------

// Normal
runSuite("NORMAL ROUTES", makeRoutes(NUM_ROUTES), NUM_ROUTES);

// Deep
runSuite("DEEP ROUTES", makeDeepRoutes(NUM_ROUTES), NUM_ROUTES);

// Conflict
runSuite("CONFLICT ROUTES", makeConflictRoutes(NUM_ROUTES), NUM_ROUTES);

// Large scale
runSuite("LARGE SCALE", makeRoutes(LARGE_ROUTES), LARGE_ROUTES);

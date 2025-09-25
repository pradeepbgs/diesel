import { FindMyWayRouter } from "../../src/router/find-my-way";
import { TrieRouter } from "../../src/router/trie";
import { performance } from "perf_hooks";
import { TrieRouter2 } from "../../src/router/trie2";
import { extractParam } from "../../src/ctx";

const NUM_ROUTES = 2000; // total routes to register
const SEARCH_ITERATIONS = 1_000_000; // total lookups

// ---------- Generate realistic routes ----------
const staticRoutes = [
    "/api/health",
    "/api/status",
    "/api/config",
    "/about",
    "/contact",
    "/help",
];

const dynamicRoutes: string[] = [];
for (let i = 0; i < NUM_ROUTES; i++) {
    dynamicRoutes.push(`/api/users/${i}`);
    dynamicRoutes.push(`/api/posts/${i}/comments/:commentId`);
    dynamicRoutes.push(`/shop/:category/products/${i}`);
}

// Combine static + dynamic
const allRoutes = [...staticRoutes, ...dynamicRoutes];

const randomPaths = Array.from({ length: SEARCH_ITERATIONS }, () => {
    const base = Math.floor(Math.random() * NUM_ROUTES);
    const randomType = Math.random();

    if (randomType < 0.3) return `/api/users/${base}`;
    if (randomType < 0.6) return `/api/posts/${base}/comments/${Math.floor(Math.random() * 1000)}`;
    if (randomType < 0.9) return `/shop/electronics/products/${base}`;
    return staticRoutes[Math.floor(Math.random() * staticRoutes.length)];
});

const dummyHandler = () => "ok";

// ---------- Benchmark helpers ----------
function benchmarkInsert(router: any, name: string) {
    const start = performance.now();
    for (const path of allRoutes) {
        router.add("GET", path, dummyHandler);
    }
    const end = performance.now();
    console.log(`${name} insert time: ${(end - start).toFixed(2)} ms`);
}

function benchmarkFind(router: any, name: string) {
    // Warmup
    for (let i = 0; i < 10000; i++) {
        router.find("GET", randomPaths[i]);
    }

    const start = performance.now();
    for (const path of randomPaths) {
        router.find("GET", path);
    }
    const end = performance.now();

    const totalMs = end - start;
    const rps = (SEARCH_ITERATIONS / (totalMs / 1000)).toFixed(0);

    console.log(`${name} lookup time: ${totalMs.toFixed(2)} ms | RPS: ${rps}`);
}

// ---------- Run Benchmarks ----------
const fastifyRouter = new FindMyWayRouter();
const trieRouter = new TrieRouter();
const trieRouter2 = new TrieRouter2();

console.log("=== Inserting Routes ===");
benchmarkInsert(fastifyRouter, "FindMyWayRouter");
benchmarkInsert(trieRouter, "TrieRouter");
benchmarkInsert(trieRouter2, "TrieRouter2");

console.log("\n=== Lookup Performance ===");
benchmarkFind(fastifyRouter, "FindMyWayRouter");
benchmarkFind(trieRouter, "TrieRouter");
benchmarkFind(trieRouter2, "TrieRouter2");



// ---------- Debug single match ----------
console.log("\nSample lookup:");
console.log(extractParam(trieRouter.find("GET", "/api/posts/42/comments/99")?.params as any, '/api/posts/42/comments/99'));
console.log(extractParam(trieRouter2.find("GET", "/api/posts/42/comments/99")?.params as any, '/api/posts/42/comments/99'));
console.log(fastifyRouter.find("GET", "/api/posts/42/comments/99"))
import { FindMyWayRouter } from "../../src/router/find-my-way";
import { TrieRouter } from "../../src/router/trie";
import { performance } from "perf_hooks";

const NUM_ROUTES = 10000;

// Use a single param name for dynamic matching
const testPaths: string[] = [];
for (let i = 0; i < NUM_ROUTES; i++) {
    testPaths.push(`/api/item/${i}`);
}

const dummyHandler = () => "ok";

const fastifyRouter = new FindMyWayRouter();
const trieRouter = new TrieRouter();

console.log("Inserting routes...");

// for (const path of testPaths) {
//     fastifyRouter.add("GET", path, dummyHandler as any);
//     trieRouter.add("GET", path, dummyHandler as any);
// }
fastifyRouter.add("GET", "/api/item/", dummyHandler as any);
trieRouter.add("GET", "/api/item/", dummyHandler as any);

console.log("Routes inserted.", NUM_ROUTES);

// Generate random paths to lookup (dynamic values for :id)
const SEARCH_ITERATIONS = 10000_000;
const randomPaths = Array.from({ length: SEARCH_ITERATIONS }, () => {
    const idx = Math.floor(Math.random() * NUM_ROUTES);
    return `/api/item/${idx}`;
});

function benchmark(router: typeof fastifyRouter | typeof trieRouter, name: string) {
    const start = performance.now();

    for (const path of randomPaths) {
        const result = router.find("GET", "/api/item/");
        if (!result) throw new Error(`Route not found: ${path}`);
    }

    const end = performance.now();
    console.log(`${name} search time for ${SEARCH_ITERATIONS} lookups: ${(end - start).toFixed(2)} ms`);
}

benchmark(fastifyRouter, "FindMyWayRouter");
benchmark(trieRouter, "TrieRouter");

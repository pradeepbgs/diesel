const ITERATION = 1_000_000;
const PATH = "/user/123/profile/abc/xyz";

// -------------------------
// Your implementations
// -------------------------

function splitPath(path: string): string[] {
  const out: string[] = [];
  let start = 0;

  for (let i = 0; i < path.length; i++) {
    if (path.charCodeAt(i) === 47) {
      if (i > start) out.push(path.slice(start, i));
      start = i + 1;
    }
  }

  if (start < path.length) out.push(path.slice(start));
  return out;
}

function splitPathInto(path: string, out: string[]) {
  out.length = 0;
  let start = 0;

  for (let i = 0; i < path.length; i++) {
    if (path.charCodeAt(i) === 47) {
      if (i > start) out.push(path.slice(start, i));
      start = i + 1;
    }
  }

  if (start < path.length) out.push(path.slice(start));
}

// -------------------------
// Benchmark helper
// -------------------------

function bench(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${(end - start).toFixed(2)} ms`);
}

// -------------------------
// Correctness check
// -------------------------

console.log("Correctness check:");
console.log("native:", PATH.split("/"));
console.log("native + filter:", PATH.split("/").filter(Boolean));
console.log("splitPath:", splitPath(PATH));

const tmp: string[] = [];
splitPathInto(PATH, tmp);
console.log("splitPathInto:", tmp);
console.log("");

// -------------------------
// Warmup (important)
// -------------------------

console.log("Warming up...");
for (let i = 0; i < 100_000; i++) {
  PATH.split("/");
  PATH.split("/").filter(Boolean);
  splitPath(PATH);
  splitPathInto(PATH, tmp);
}
console.log("Warmup done.\n");

// -------------------------
// Benchmarks
// -------------------------

console.log(`Running ${ITERATION.toLocaleString()} iterations\n`);

bench("Native split('/')", () => {
  for (let i = 0; i < ITERATION; i++) {
    PATH.split("/");
  }
});

bench("Native split + filter(Boolean)", () => {
  for (let i = 0; i < ITERATION; i++) {
    PATH.split("/").filter(Boolean);
  }
});

bench("splitPath (single-pass)", () => {
  for (let i = 0; i < ITERATION; i++) {
    splitPath(PATH);
  }
});

bench("splitPathInto (reuse array)", () => {
  for (let i = 0; i < ITERATION; i++) {
    splitPathInto(PATH, tmp);
  }
});

console.log("\nDone.");

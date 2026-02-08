import { getPath } from "../src/utils/urls";

const ITERATIONS = 1_000_000;

// Test URLs (mix of cases)
const urls = [
  "http://localhost:3000/",
  "http://localhost:3000/now",
  "http://localhost:3000/user?id=10",
  "http://localhost:3000/product/view?cat=books&page=2",
  "http://localhost:3000/a/b/c/d/e?x=1&y=2&z=3",
];

function randomUrl() {
  return urls[(Math.random() * urls.length) | 0];
}

// Warmup for JIT
for (let i = 0; i < 100_000; i++) {
  const u = randomUrl();
  new URL(u).pathname;
  getPath(u);
}

console.log("Starting benchmark with", ITERATIONS, "iterations\n");

// Test 1: Native URL parser
console.time("new URL()");
for (let i = 0; i < ITERATIONS; i++) {
  new URL(randomUrl()).pathname;
}
console.timeEnd("new URL()");

// Test 2: Custom parser
console.time("getPath()");
for (let i = 0; i < ITERATIONS; i++) {
  getPath(randomUrl());
}
console.timeEnd("getPath()");

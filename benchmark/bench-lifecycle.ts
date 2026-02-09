// bench-lifecycle.ts

import http from "http";

const ITER = 200_000;

const server = http.createServer((req, res) => {
  const headers = { "Content-Type": "text/plain" };
  res.writeHead(200, headers);
  res.end("hello");
});

server.listen(3001, async () => {
  console.log("Running lifecycle benchmark...");

  const t1 = performance.now();

  for (let i = 0; i < ITER; i++) {
    await fetch("http://localhost:3000");
  }

  const t2 = performance.now();
  console.log("Total time:", (t2 - t1).toFixed(2), "ms");

  server.close();
});

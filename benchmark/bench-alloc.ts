// bench-alloc.ts

const ITER = 1_000_000;

const customHeaders = {
  "X-Test": "123",
  "Cache-Control": "no-cache"
};

function text_manual(data: string, custom?: Record<string,string>) {
  if (!custom) {
    return new Response(data, {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const h: Record<string,string> = {
    "Content-Type": "text/plain; charset=utf-8"
  };

  for (const k in custom) h[k] = custom[k];

  return new Response(data, { headers: h });
}

global.gc?.();

const startMem = process.memoryUsage().heapUsed;
const t1 = performance.now();

for (let i = 0; i < ITER; i++) {
  text_manual("hello", customHeaders);
}

global.gc?.();

const t2 = performance.now();
const endMem = process.memoryUsage().heapUsed;

console.log("Time:", (t2 - t1).toFixed(2), "ms");
console.log("Heap delta:", ((endMem - startMem) / 1024 / 1024).toFixed(2), "MB");

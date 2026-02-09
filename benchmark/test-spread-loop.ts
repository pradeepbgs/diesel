// bench-text-real.ts

const ITER = 1_000_000;

// Simulate custom headers user might pass
const customHeaders: Record<string, string> = {
  "X-Test": "123",
  "X-Auth": "token",
  "Cache-Control": "no-cache"
};

const DEFAULT_TYPE = "text/plain; charset=utf-8";

// ---------------------------------------
// Manual loop version (your current)
// ---------------------------------------
function text_manual(data: string, status = 200, custom?: Record<string, string>) {
  if (!custom) {
    return new Response(data, {
      status,
      headers: { "Content-Type": DEFAULT_TYPE }
    });
  }

  const h: Record<string, string> = {
    "Content-Type": DEFAULT_TYPE
  };

  for (const k in custom) {
    h[k] = custom[k];
  }

  return new Response(data, { status, headers: h });
}


// ---------------------------------------
// Spread version
// ---------------------------------------
function text_spread(data: string, status = 200, custom?: Record<string, string>) {
  if (!custom) {
    return new Response(data, {
      status,
      headers: { "Content-Type": DEFAULT_TYPE }
    });
  }

  return new Response(data, {
    status,
    headers: {
      "Content-Type": DEFAULT_TYPE,
      ...custom
    }
  });
}


// ---------------- WARMUP ----------------
for (let i = 0; i < 1_000_000; i++) {
  text_manual("hello", 200, customHeaders);
  text_spread("hello", 200, customHeaders);
}

await new Promise(r => setTimeout(r, 100));

console.log("Starting real text() benchmark...\n");


// ---------------- MANUAL ----------------
let t1 = Bun.nanoseconds();

for (let i = 0; i < ITER; i++) {
  text_manual("hello", 200, customHeaders);
}

let t2 = Bun.nanoseconds();

console.log("Manual loop text():", ((t2 - t1) / 1e6).toFixed(2), "ms");


// ---------------- SPREAD ----------------
t1 = Bun.nanoseconds();

for (let i = 0; i < ITER; i++) {
  text_spread("hello", 200, customHeaders);
}

t2 = Bun.nanoseconds();

console.log("Spread text():", ((t2 - t1) / 1e6).toFixed(2), "ms");

console.log("\nDone.");

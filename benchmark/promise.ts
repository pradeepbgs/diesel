const NUM_IT = 1000_000;

const isPromise = (v: any): boolean =>
    v !== null && typeof v === "object" && typeof (v as any).then === "function";


const isResponse = (v: any): v is Response =>
    v !== null &&
    typeof v === "object" &&
    typeof (v as any).status === "number" &&
    typeof (v as any).headers === "object";

const result = Promise.resolve();

const startBenchInstanceOf = () => {
    const start = performance.now();
    for (let i = 0; i < NUM_IT; i++) {
        if (result instanceof Promise) { }
        // if (result instanceof Response){}
    }
    const end = performance.now();

    const totalMs = end - start;
    const rps = (NUM_IT / (totalMs / 1000)).toFixed(0);

    console.log(`\n--- Test 1: 'instanceof Promise' ---`);
    console.log(`Total Iterations: ${NUM_IT.toLocaleString()}`);
    console.log(`Lookup Time: ${totalMs.toFixed(2)} ms`);
    console.log(`Requests Per Second (RPS): ${rps.toLocaleString()}`);
}


const startBenchIsPromise = () => {
    const start = performance.now();
    for (let i = 0; i < NUM_IT; i++) {
        if (isPromise(result)) { }
        // if (isResponse(result)){}
    }
    const end = performance.now();

    const totalMs = end - start;
    const rps = (NUM_IT / (totalMs / 1000)).toFixed(0);

    console.log(`\n--- Test 2: Duck-Typing ('isPromise') ---`);
    console.log(`Total Iterations: ${NUM_IT.toLocaleString()}`);
    console.log(`Lookup Time: ${totalMs.toFixed(2)} ms`);
    console.log(`Requests Per Second (RPS): ${rps.toLocaleString()}`);
}

// console.log(isResponse("J"))
// console.log(isResponse(new Response("h")))

startBenchInstanceOf();
startBenchIsPromise();
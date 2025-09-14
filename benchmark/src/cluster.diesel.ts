import cluster from "cluster";
import os from "os";
import app from "./diesel";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary process started. PID: ${process.pid}`);
    console.log(`Spawning ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    Bun.serve({
        fetch: app.fetch() as any,
        port: 3000,
    });
    console.log(`Worker started. PID: ${process.pid}`);
}

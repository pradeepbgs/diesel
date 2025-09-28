// import path from 'path';
// const entryPoints = [
//     './src/main.ts',
//     './src/ctx.ts',
//     './src/handleRequest.ts',
//     './src/trie.ts',
//     './src/utils.ts',
// ];

// entryPoints.forEach(entry => {
//     console.log(`Building: ${entry}`);
//     try {
//         Bun.build({
//             entrypoints: [path.resolve(entry)],
//             outdir: './dist',
//             minify: true,
//         });
//     } catch (error) {
//         console.error(`Failed to build ${entry}:`, error);
//     }
// });

// './src/middlewares/cors/cors.ts',
// './src/middlewares/security/security.ts'

Bun.build({
    entrypoints: [
        './src/main.ts',
        './src/request_pipeline.ts',
        './src/handleRequest.ts',
        './src/router/trie.ts',
        './src/router/interface.ts',
        './src/router/find-my-way.ts',
        './src/http-exception.ts',
        './src/ctx.ts',
    ],
    outdir: './dist',
    minify: true,
})
console.log('build complete for main src')

Bun.build({
    entrypoints: [
        './src/middlewares/cors/cors.ts', 
        './src/middlewares/security/security.ts',
        './src/middlewares/logger/logger.ts',
        './src/middlewares/filesave/savefile.ts',
        './src/middlewares/ratelimit/rate-limit.ts',
        './src/middlewares/ratelimit/implementation.ts',
        './src/middlewares/powered-by/index.ts',
        './src/middlewares/jwt/index.ts',
    ],
    outdir: './dist/middlewares',
    minify: true,
})
console.log('Middleware build complete')

Bun.build({
    entrypoints:[
        './src/utils/jwt.ts',
        './src/utils/mimeType.ts',
        './src/utils/urls.ts',
        './src/utils/request.util.ts',
        './src/utils/promise.ts'
    ],
    outdir: './dist/utils',
    minify: true
})
console.log('build complete')
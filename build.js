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
        './src/ctx.ts',
        './src/handleRequest.ts',
        './src/trie.ts',
        './src/utils.ts',
    ],
    outdir: './dist',
    minify: true,
})

Bun.build({
    entrypoints: [
        './src/middlewares/cors/cors.ts', 
        './src/middlewares/security/security.ts',
        './src/middlewares/logger/logger.ts',
        './src/middlewares/filesave/savefile.ts'
    ],
    outdir: './dist/middlewares',
    minify: true,
})
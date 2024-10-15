// build.js
await Bun.build({
    entrypoints: [
        './src/main.ts',
        './src/ctx.ts',
        './src/handleRequest.ts',
        './src/trie.ts',
        './src/router.ts'
    ],
    outdir: './dist',
    minify: true, // Enable minification
});

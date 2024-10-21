// build.js
await Bun.build({
    entrypoints: [
        './main/main.ts',
        './main/ctx.ts',
        './main/handleRequest.ts',
        './main/trie.ts',
        './main/router.ts'
    ],
    outdir: './dist',
    minify: true, // Enable minification
});

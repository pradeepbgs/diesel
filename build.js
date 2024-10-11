// build.js
await Bun.build({
    entrypoints: [
        './src/server.js',
        './src/ctx.js',
        './src/handleRequest.js',
        './src/trie.js',
        './src/router.js'
    ],
    outdir: './dist',
    minify: true, // Enable minification
});

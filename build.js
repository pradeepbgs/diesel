import path from 'path';
const entryPoints = [
    './main/main.js',
    './main/ctx.js',
    './main/handleRequest.js',
    './main/trie.js',
    './main/router.js',
    './main/utils.js'
];

entryPoints.forEach(entry => {
    console.log(`Building: ${entry}`);
    try {
        Bun.build({
            entrypoints: [path.resolve(entry)],
            outdir: './dist',
            minify: true,
        });
    } catch (error) {
        console.error(`Failed to build ${entry}:`, error);
    }
});

// Bun.spawn(['rm','-rf','./main'])
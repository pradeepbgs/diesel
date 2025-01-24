import path from 'path';
const entryPoints = [
    './src/main.ts',
    './src/ctx.ts',
    './src/handleRequest.ts',
    './src/trie.ts',
    './src/utils.ts'
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

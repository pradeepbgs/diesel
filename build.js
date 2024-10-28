import path from 'path';
const entryPoints = [
    './src/main.ts',
    './src/ctx.ts',
    './src/handleRequest.ts',
    './src/trie.ts',
    './src/router.ts',
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

// Bun.spawn(['rm','-rf','./main'])

// oha test
// oha -c 500 -n 100000 -H "Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGsiLCJhZ2UiOjIyLCJpYXQiOjE3Mjk5MjQxOTQsImV4cCI6MTczMDAxMDU5NH0._dEjx5iUuOLoq15-xTPgXOemfzIPrg06Qmruiv-I5cc" http://localhost:3000/

// bombardier


//  bombardier -c 500 -n 100000 -H "Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGsiLCJhZ2UiOjIyLCJpYXQiOjE3Mjk5MjQxOTQsImV4cCI6MTczMDAxMDU5NH0._dEjx5iUuOLoq15-xTPgXOemfzIPrg06Qmruiv-I5cc" http://localhost:3000/

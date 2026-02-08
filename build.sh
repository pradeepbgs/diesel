rm -r ./dist

npx tsc src/adaptor/node/*.ts --outDir dist/adaptor/node

bun run build 

bun run tsc

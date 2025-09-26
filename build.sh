rm -r ./dist

tsc

npx tsc src/adaptor/node/*.ts --outDir dist/adaptor/node

bun run build 
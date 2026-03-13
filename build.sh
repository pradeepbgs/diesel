#!/bin/bash
set -e

echo "🧹 Cleaning dist..."
rm -rf ./dist

echo "📦 Building node adapter (tsc)..."
# npx tsc -p tsconfig.node.json

echo "📦 Bundling source with Bun..."

# Build each entrypoint individually to avoid Bun v1.3.10 multi-entrypoint crash
build_one() {
  local entry="$1"
  local outdir="$2"
  bun build "$entry" --outdir "$outdir" --minify
}

echo "  → core modules"
build_one ./src/request_pipeline.ts ./dist
build_one ./src/main.ts ./dist
build_one ./src/router/trie.ts ./dist/router
build_one ./src/router/interface.ts ./dist/router
build_one ./src/http-exception.ts ./dist
build_one ./src/ctx.ts ./dist
build_one ./src/constant.ts ./dist

echo "  → middlewares"
build_one ./src/middlewares/cors/cors.ts ./dist/middlewares/cors
build_one ./src/middlewares/security/security.ts ./dist/middlewares/security
build_one ./src/middlewares/logger/logger.ts ./dist/middlewares/logger
build_one ./src/middlewares/filesave/savefile.ts ./dist/middlewares/filesave
build_one ./src/middlewares/ratelimit/rate-limit.ts ./dist/middlewares/ratelimit
build_one ./src/middlewares/ratelimit/implementation.ts ./dist/middlewares/ratelimit
build_one ./src/middlewares/powered-by/index.ts ./dist/middlewares/powered-by
build_one ./src/middlewares/jwt/index.ts ./dist/middlewares/jwt
build_one ./src/middlewares/request-id/index.ts ./dist/middlewares/request-id

echo "  → utils"
build_one ./src/utils/jwt.ts ./dist/utils
build_one ./src/utils/mimeType.ts ./dist/utils
build_one ./src/utils/urls.ts ./dist/utils
build_one ./src/utils/request.util.ts ./dist/utils
build_one ./src/utils/promise.ts ./dist/utils

echo "📦 Generating type declarations (tsc)..."
npx tsc -p tsconfig.json

echo "✅ Build complete!"

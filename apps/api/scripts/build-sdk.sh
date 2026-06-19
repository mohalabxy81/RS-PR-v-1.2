#!/bin/bash
set -e

echo "Building SDK pipeline..."

# 1. Generate OpenAPI JSON spec
npx ts-node -r tsconfig-paths/register scripts/generate-openapi.ts

# 2. Check if openapi.json was generated
if [ ! -f "../../openapi.json" ]; then
  echo "Error: openapi.json not found."
  exit 1
fi

echo "OpenAPI spec generated. Building TypeScript SDK..."

# 3. Generate SDK
# Install openapi-generator-cli if not present
npx @openapitools/openapi-generator-cli generate \
  -i ../../openapi.json \
  -g typescript-axios \
  -o ../../sdk/typescript-client \
  --additional-properties=supportsES6=true,typescriptThreePlus=true,withInterfaces=true

echo "SDK generation complete. Output in sdk/typescript-client/"

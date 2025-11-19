#!/usr/bin/env bash
set -euo pipefail

echo "== PWD =="
pwd
echo

echo "== openapi.yaml (first 120 lines) =="
if [ -f openapi.yaml ]; then
  sed -n '1,120p' openapi.yaml
else
  echo "openapi.yaml not found"
fi
echo

echo "== src/app/api/auth/register/route.ts =="
if [ -f src/app/api/auth/register/route.ts ]; then
  cat src/app/api/auth/register/route.ts
else
  echo "register route not found"
fi
echo

echo "== src/app/api/auth/login/route.ts =="
if [ -f src/app/api/auth/login/route.ts ]; then
  cat src/app/api/auth/login/route.ts
else
  echo "login route not found"
fi
echo

echo "== src/app/api/items/route.ts (if present) =="
if [ -f src/app/api/items/route.ts ]; then
  cat src/app/api/items/route.ts
else
  echo "items route not found (might be in a different folder)"
fi
echo

echo "== frontend items pages (if folder exists) =="
if [ -d src/app/items ]; then
  find src/app/items -maxdepth 3 -type f -print
else
  echo "src/app/items directory not found"
fi
echo

echo "== Done. =="

#!/usr/bin/env bash
set -euo pipefail

LF_ROOT="$HOME/Desktop/LOST_AND_FOUND_PROJECT/campus-lost-found"

echo "== Go to Lost & Found root =="
cd "$LF_ROOT"

echo "== Kill old dev server & swagger container (if any) =="
pkill -f "next dev" 2>/dev/null || true
docker rm -f campus-lf-swagger 2>/dev/null || true

echo "== Start Next.js Lost & Found API on :3000 =="
ABS_DEV="file:$(realpath prisma/dev.db)"
export DATABASE_URL="$ABS_DEV"
export JWT_SECRET="${JWT_SECRET:-dev-secret}"
npm run dev &
API_PID=$!

echo "API PID = $API_PID"
echo "Waiting 10s for Next.js to boot..."
sleep 10

echo "== Start Swagger UI on :8080 using openapi.yaml (server 3000) =="
docker run --name campus-lf-swagger -d -p 8080:8080 \
  -e SWAGGER_JSON=/app/openapi.yaml \
  -v "$PWD/openapi.yaml:/app/openapi.yaml:ro" \
  swaggerapi/swagger-ui

echo "== Quick health check =="
curl -sS -o /dev/null -w "Health status: HTTP %{http_code}\n" \
  http://127.0.0.1:3000/api/health || true

cat <<MSG

========================================================
Lost & Found API + Swagger are running ✅

• API base URL      : http://127.0.0.1:3000
• Swagger UI        : http://localhost:8080
• Swagger "Servers" : should show http://127.0.0.1:3000

Use Swagger "Try it out" to manually test:
  - POST  /api/auth/register
  - POST  /api/auth/login
  - GET   /api/items
  - POST  /api/items
  - POST  /api/items/{id}/claim
  - GET   /api/items/{id}/claims
  - GET   /api/claims/mine
  - POST  /api/claims/{id}/approve
  - POST  /api/claims/{id}/reject

When you're done testing:

  kill $API_PID
  docker rm -f campus-lf-swagger

========================================================
MSG

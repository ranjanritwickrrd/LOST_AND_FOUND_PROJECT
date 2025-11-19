#!/usr/bin/env bash
set -euo pipefail
echo "== CAMPUS LOST & FOUND: Prisma + Registration Check =="

# 1️⃣ Ensure you’re in the right directory
cd ~/Desktop/LOST_AND_FOUND_PROJECT/campus-lost-found

# 2️⃣ Use absolute path for DB
ABS_DEV="file:$(realpath prisma/dev.db)"
echo "Using DATABASE_URL = $ABS_DEV"

# 3️⃣ Start backend on same DB (in background)
echo "== Starting backend on port 3000 =="
pkill -f "next dev" 2>/dev/null || true
JWT_SECRET="${JWT_SECRET:-dev-secret-change-me}" DATABASE_URL="$ABS_DEV" nohup npm run dev >/tmp/lf_backend.log 2>&1 &
sleep 8

# 4️⃣ Register a new user through API
echo "== Registering test user 'auto_check_user' =="
curl -sS -X POST http://127.0.0.1:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"auto_check_user","password":"123","name":"AutoCheck"}' || true

# 5️⃣ Verify new user in SQLite (should appear below)
echo
echo "== Checking database for auto_check_user =="
sqlite3 prisma/dev.db "SELECT id, username, name, createdAt FROM User WHERE username='auto_check_user';"

# 6️⃣ Launch Prisma Studio attached to same DB
echo
echo "== Launching Prisma Studio on same dev.db (localhost:5560) =="
pkill -f "prisma studio" 2>/dev/null || true
DATABASE_URL="$ABS_DEV" npx prisma studio --port 5560

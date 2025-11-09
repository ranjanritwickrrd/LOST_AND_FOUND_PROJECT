#!/usr/bin/env bash
set -euo pipefail
DB="${1:-prisma/dev.db}"

echo "== Claim table schema =="
sqlite3 "$DB" '.schema Claim'

echo
echo "== Recent claims =="
sqlite3 "$DB" 'SELECT id,itemId,claimerId,status,message,contact,datetime(createdAt/1000, "unixepoch") FROM Claim ORDER BY createdAt DESC LIMIT 10;'

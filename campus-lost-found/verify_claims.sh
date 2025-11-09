#!/usr/bin/env bash
set -euo pipefail
DB="${1:-prisma/dev.db}"

echo "== Claim table schema =="
sqlite3 "$DB" '.schema Claim'

echo
echo "== Recent claims (latest 10) =="
sqlite3 "$DB" '
  SELECT id,itemId,claimerId,status,message,contact,
         datetime(createdAt/1000,"unixepoch") AS created
  FROM Claim
  ORDER BY createdAt DESC LIMIT 10;
'

# Optional pause support (so terminal doesn't close instantly)
if [ -n "${PAUSE_ON_EXIT:-}" ]; then
  echo
  read -rp "Done. Press Enter to close..."
fi

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
DB_DEV="prisma/dev.db"
DB_TEST="prisma/test.db"
PICK="${1:-auto}"   # usage: ./db_debug.sh [dev|test|auto]
DB=""

echo "== .env DATABASE_URL =="
grep -E '^DATABASE_URL=' .env || echo "(no DATABASE_URL in .env)"
echo

echo "== File stats =="
[ -f "$DB_DEV" ] && ls -lh "$DB_DEV" || echo "$DB_DEV (missing)"
[ -f "$DB_TEST" ] && ls -lh "$DB_TEST" || echo "$DB_TEST (missing)"
echo

show_counts () {
  local f="$1"
  if [ ! -f "$f" ]; then
    echo "$f: (missing)"
    return
  fi
  echo "-- $f tables --"
  sqlite3 "$f" ".tables" || true
  for t in User Item Claim; do
    printf "%-5s %s\n" "$t:" "$(sqlite3 "$f" "SELECT COUNT(*) FROM $t;" 2>/dev/null || echo "?")"
  done
  echo
}

show_counts "$DB_DEV"
show_counts "$DB_TEST"

if [ "$PICK" = "dev" ]; then
  DB="$DB_DEV"
elif [ "$PICK" = "test" ]; then
  DB="$DB_TEST"
else
  # auto: prefer test.db if present, else dev.db
  if [ -f "$DB_TEST" ]; then DB="$DB_TEST"; elif [ -f "$DB_DEV" ]; then DB="$DB_DEV"; else DB="$DB_TEST"; fi
fi

if [ ! -f "$DB" ]; then
  echo "No DB found. Creating test.db from schema…"
  npx prisma db push --schema=prisma/schema.prisma --skip-generate --force-reset --accept-data-loss --url file:./prisma/test.db >/dev/null
  DB="$DB_TEST"
fi

echo "Opening Prisma Studio on $DB"
DATABASE_URL="file:./$DB" npx prisma studio --browser none

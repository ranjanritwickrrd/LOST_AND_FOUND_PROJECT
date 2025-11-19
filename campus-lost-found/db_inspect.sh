#!/usr/bin/env bash
set -euo pipefail

DB_DEV="prisma/dev.db"
DB_TEST="prisma/test.db"

has () { [ -f "$1" ] && echo "yes" || echo "no"; }

echo "== .env DATABASE_URL =="
grep -E '^DATABASE_URL=' .env || echo "(no DATABASE_URL in .env)"
echo

echo "== File stats =="
[ -f "$DB_DEV" ] && ls -lh "$DB_DEV" || echo "$DB_DEV (missing)"
[ -f "$DB_TEST" ] && ls -lh "$DB_TEST" || echo "$DB_TEST (missing)"
echo

inspect () {
  local f="$1"
  if [ ! -f "$f" ]; then
    echo "$f : (missing)"
    echo
    return
  fi
  echo "-- $f : tables --"
  sqlite3 "$f" ".tables" || true
  echo
  for t in User Item Claim; do
    printf "%-5s count=%s\n" "$t:" "$(sqlite3 "$f" "SELECT COUNT(*) FROM $t;" 2>/dev/null || echo "?")"
  done
  echo
  for t in User Item Claim; do
    echo "Top rows from $t:"
    sqlite3 -header -column "$f" "SELECT * FROM $t LIMIT 5;" 2>/dev/null || echo "(table missing)"
    echo
  done
}

inspect "$DB_DEV"
inspect "$DB_TEST"

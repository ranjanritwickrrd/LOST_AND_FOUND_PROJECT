#!/usr/bin/env bash
set -euo pipefail
DB="${1:-prisma/dev.db}"

echo "== Item table schema =="
sqlite3 "$DB" '.schema Item'

echo
echo "== Recent items (latest 12) =="
sqlite3 -header -column "$DB" '
  SELECT
    i.id,
    i.title,
    i.type,
    IFNULL(i.description,"") AS description,
    u.name AS owner_name,
    datetime(i.createdAt/1000,"unixepoch") AS created
  FROM Item i
  LEFT JOIN "User" u ON u.id = i.ownerId
  ORDER BY i.createdAt DESC
  LIMIT 12;
'

echo
echo "== Counts by type =="
sqlite3 -header -column "$DB" '
  SELECT type, COUNT(*) AS count
  FROM Item
  GROUP BY type;
'

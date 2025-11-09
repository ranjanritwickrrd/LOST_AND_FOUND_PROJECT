#!/usr/bin/env bash
set -euo pipefail
DB="${1:-prisma/dev.db}"

echo "== Claims by status =="
sqlite3 -header -column "$DB" '
  SELECT status, COUNT(*) AS count
  FROM Claim
  GROUP BY status
  ORDER BY status;
'

echo
echo "== Latest 12 claims with names =="
sqlite3 -header -column "$DB" '
  SELECT
    c.id           AS claim_id,
    c.status,
    i.title        AS item_title,
    i.type         AS item_type,
    ow.name        AS owner_name,
    cl.name        AS claimer_name,
    IFNULL(c.message,"") AS message,
    IFNULL(c.contact,"") AS contact,
    datetime(c.createdAt/1000, "unixepoch") AS created
  FROM Claim c
  JOIN Item i      ON i.id = c.itemId
  JOIN "User" cl   ON cl.id = c.claimerId
  JOIN "User" ow   ON ow.id = i.ownerId
  ORDER BY c.createdAt DESC
  LIMIT 12;
'

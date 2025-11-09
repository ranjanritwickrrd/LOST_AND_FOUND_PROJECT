#!/usr/bin/env bash
set -euo pipefail
ABS="${1:-/home/ritwick/Desktop/ASSL/college_connect/Campus-Connect/campus-lost-found/prisma/dev.db}"
echo "DB => $ABS"
sqlite3 "$ABS" '
SELECT "User" AS tbl, COUNT(*) AS rows FROM "User"
UNION ALL SELECT "Item", COUNT(*) FROM Item
UNION ALL SELECT "Claim", COUNT(*) FROM Claim;
'
echo
sqlite3 -header -column "$ABS" '
  SELECT i.id,i.title,i.type,IFNULL(i.description,"") AS description,
         u.name AS owner, datetime(i.createdAt/1000,"unixepoch") AS created
  FROM Item i JOIN "User" u ON u.id=i.ownerId
  ORDER BY i.createdAt DESC LIMIT 20;
'
echo
sqlite3 -header -column "$ABS" '
  SELECT c.id AS claim_id, c.status, i.title AS item_title, i.type AS item_type,
         ow.name AS owner_name, cl.name AS claimer_name,
         IFNULL(c.message,"") AS message, IFNULL(c.contact,"") AS contact,
         datetime(c.createdAt/1000,"unixepoch") AS created
  FROM Claim c
  JOIN Item i    ON i.id=c.itemId
  JOIN "User" cl ON cl.id=c.claimerId
  JOIN "User" ow ON ow.id=i.ownerId
  ORDER BY c.createdAt DESC LIMIT 20;
'

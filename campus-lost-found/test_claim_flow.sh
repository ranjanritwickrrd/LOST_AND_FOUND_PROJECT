#!/usr/bin/env bash
set -euo pipefail

LF_BASE="${LF_BASE:-http://127.0.0.1:3001}"
py() { python3 - "$@"; }

echo "== Lost & Found – approve flow =="
echo "BASE: $LF_BASE"

# Owner A (Alice)
UA="a_$RANDOM"; PA="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\",\"name\":\"Alice\"}" >/dev/null
TA=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\"}" | python3 -c 'import sys,json;data=json.load(sys.stdin);print(data.get("token",""))')

# Alice posts a FOUND item
IID=$(curl -sS -X POST "$LF_BASE/api/items" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"type":"FOUND","title":"Calculator","description":"Found near Block A"}' \
  | python3 -c 'import sys,json;data=json.load(sys.stdin);print(data.get("id",""))')
echo "Item ID: $IID"

# Claimer B (Bob)
UB="b_$RANDOM"; PB="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\",\"name\":\"Bob\"}" >/dev/null
TB=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\"}" | python3 -c 'import sys,json;data=json.load(sys.stdin);print(data.get("token",""))')

# Bob creates a claim
CID=$(curl -sS -X POST "$LF_BASE/api/items/$IID/claim" \
  -H "Authorization: Bearer $TB" -H 'Content-Type: application/json' \
  -d '{"message":"It is mine","contact":"+91-9999"}' \
  | python3 -c 'import sys,json;data=json.load(sys.stdin);print(data.get("id",""))')
echo "Claim ID: $CID"

# Alice lists claims (should show PENDING)
echo "== Claims visible to owner (expect PENDING) =="
curl -sS "$LF_BASE/api/items/$IID/claims" -H "Authorization: Bearer $TA" | python3 -m json.tool

# Alice approves the claim
echo "== Approving =="
curl -sS -X POST "$LF_BASE/api/claims/$CID/approve" -H "Authorization: Bearer $TA" | python3 -m json.tool

# Bob sees APPROVED in /claims/mine
echo "== Claimer's view after approval =="
curl -sS "$LF_BASE/api/claims/mine" -H "Authorization: Bearer $TB" | python3 -m json.tool

echo "✅ Done."

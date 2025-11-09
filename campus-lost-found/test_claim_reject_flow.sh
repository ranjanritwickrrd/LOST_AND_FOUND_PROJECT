#!/usr/bin/env bash
set -euo pipefail
LF_BASE="${LF_BASE:-http://127.0.0.1:3001}"

echo "== Lost & Found – reject flow =="
echo "BASE: $LF_BASE"

# A (owner)
UA="a_$RANDOM"; PA="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\",\"name\":\"Alice\"}" >/dev/null
TA=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\"}" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("token",""))')

# Item by A
IID=$(curl -sS -X POST "$LF_BASE/api/items" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"type":"FOUND","title":"Bottle","description":"Blue bottle near canteen"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin).get("id",""))')
echo "Item ID: $IID"

# B (claimer)
UB="b_$RANDOM"; PB="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\",\"name\":\"Bob\"}" >/dev/null
TB=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\"}" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("token",""))')

# Claim by B
CID=$(curl -sS -X POST "$LF_BASE/api/items/$IID/claim" \
  -H "Authorization: Bearer $TB" -H 'Content-Type: application/json' \
  -d '{"message":"Looks like mine","contact":"+91-1234"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin).get("id",""))')
echo "Claim ID: $CID"

# List (owner sees PENDING)
curl -sS "$LF_BASE/api/items/$IID/claims" -H "Authorization: Bearer $TA" | python3 -m json.tool

# Reject
curl -sS -X POST "$LF_BASE/api/claims/$CID/reject" -H "Authorization: Bearer $TA" | python3 -m json.tool

# B sees REJECTED
curl -sS "$LF_BASE/api/claims/mine" -H "Authorization: Bearer $TB" | python3 -m json.tool
echo "✅ Done."

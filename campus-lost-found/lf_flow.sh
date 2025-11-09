#!/usr/bin/env bash
set -euo pipefail

LF_BASE="${LF_BASE:-http://127.0.0.1:3001}"
j() { python3 -m json.tool; }

# Safe JSON extractor: prints "" if stdin invalid/missing
jx() { python3 - "$@" <<'PY'
import sys, json
raw = sys.stdin.read().strip()
if not raw:
    print(""); sys.exit(0)
try:
    data = json.loads(raw)
except Exception:
    print(""); sys.exit(0)
for k in sys.argv[1:]:
    if not isinstance(data, dict):
        print(""); sys.exit(0)
    data = data.get(k, "")
print("" if data is None else data)
PY
}

echo "== Campus Lost & Found — full demo flow =="
echo "BASE: $LF_BASE"

# Optional: wait for /api/health (skip silently if not present)
for i in {1..30}; do
  if curl -fsS "$LF_BASE/api/health" >/dev/null 2>&1; then break; fi
  sleep 0.2
done || true

# 1) Alice registers & logs in
UA="alice_$RANDOM"; PA="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\",\"name\":\"Alice\"}" >/dev/null
TA=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UA\",\"password\":\"$PA\"}" | jx token)
echo "Alice token: ${TA:0:20}..."
[ -n "$TA" ] || { echo "Login failed for Alice"; exit 1; }

# 2) Alice posts a LOST item
LOST_JSON=$(curl -sS -X POST "$LF_BASE/api/items" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"type":"LOST","title":"Lost ID Card","description":"Black lanyard, near Library"}')
echo "$LOST_JSON" | j
LOST_ID=$(printf '%s' "$LOST_JSON" | jx id)
[ -n "$LOST_ID" ] || { echo "No LOST_ID"; exit 1; }
echo "LOST_ID=$LOST_ID"

# 3) Bob registers, logs in, posts a FOUND item
UB="bob_$RANDOM"; PB="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\",\"name\":\"Bob\"}" >/dev/null
TB=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UB\",\"password\":\"$PB\"}" | jx token)
echo "Bob token: ${TB:0:20}..."
[ -n "$TB" ] || { echo "Login failed for Bob"; exit 1; }

FOUND_B_JSON=$(curl -sS -X POST "$LF_BASE/api/items" \
  -H "Authorization: Bearer $TB" -H 'Content-Type: application/json' \
  -d '{"type":"FOUND","title":"Calculator","description":"Found near Block A"}')
echo "$FOUND_B_JSON" | j
FOUND_B_ID=$(printf '%s' "$FOUND_B_JSON" | jx id)
[ -n "$FOUND_B_ID" ] || { echo "No FOUND_B_ID"; exit 1; }
echo "FOUND_B_ID=$FOUND_B_ID"

# 4) Alice claims Bob’s FOUND item
CLAIM1_JSON=$(curl -sS -X POST "$LF_BASE/api/items/$FOUND_B_ID/claim" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"message":"Looks like mine","contact":"+91-9999"}')
echo "Alice → claim Bob's item:"; echo "$CLAIM1_JSON" | j

echo "Bob views claims for his item:"
curl -sS "$LF_BASE/api/items/$FOUND_B_ID/claims" -H "Authorization: Bearer $TB" | j

# 5) Alice updates her LOST item (optional PATCH; skips if not supported)
echo "Trying to PATCH Alice's LOST item (optional):"
if ! curl -fsS -X PATCH "$LF_BASE/api/items/$LOST_ID" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"description":"Updated: black lanyard with college logo"}' | j; then
  echo "(PATCH not supported — skipping LOST update)"
fi

# 6) Alice posts a FOUND item
FOUND_A_JSON=$(curl -sS -X POST "$LF_BASE/api/items" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"type":"FOUND","title":"Water Bottle","description":"Blue bottle near canteen"}')
echo "$FOUND_A_JSON" | j
FOUND_A_ID=$(printf '%s' "$FOUND_A_JSON" | jx id)
[ -n "$FOUND_A_ID" ] || { echo "No FOUND_A_ID"; exit 1; }
echo "FOUND_A_ID=$FOUND_A_ID"

# 7) Cara registers, logs in, claims Alice’s FOUND item
UC="cara_$RANDOM"; PC="p_$RANDOM"
curl -sS -X POST "$LF_BASE/api/auth/register" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UC\",\"password\":\"$PC\",\"name\":\"Cara\"}" >/dev/null
TC=$(curl -sS -X POST "$LF_BASE/api/auth/login" -H 'Content-Type: application/json' \
  -d "{\"username\":\"$UC\",\"password\":\"$PC\"}" | jx token)
echo "Cara token: ${TC:0:20}..."
[ -n "$TC" ] || { echo "Login failed for Cara"; exit 1; }

CLAIM2_JSON=$(curl -sS -X POST "$LF_BASE/api/items/$FOUND_A_ID/claim" \
  -H "Authorization: Bearer $TC" -H 'Content-Type: application/json' \
  -d '{"message":"That is mine","contact":"+91-1234"}')
echo "Cara → claim Alice's item:"; echo "$CLAIM2_JSON" | j
CLAIM2_ID=$(printf '%s' "$CLAIM2_JSON" | jx id)
[ -n "$CLAIM2_ID" ] || { echo "No CLAIM2_ID"; exit 1; }

echo "Alice views claims for her found item:"
curl -sS "$LF_BASE/api/items/$FOUND_A_ID/claims" -H "Authorization: Bearer $TA" | j

echo "Alice approves Cara's claim:"
curl -sS -X POST "$LF_BASE/api/claims/$CLAIM2_ID/approve" -H "Authorization: Bearer $TA" | j

echo "Cara checks /api/claims/mine:"
curl -sS "$LF_BASE/api/claims/mine" -H "Authorization: Bearer $TC" | j

# 8) Optional PATCH on Alice's FOUND; then fetch both items
echo "Trying to PATCH Alice's FOUND item (optional):"
if ! curl -fsS -X PATCH "$LF_BASE/api/items/$FOUND_A_ID" \
  -H "Authorization: Bearer $TA" -H 'Content-Type: application/json' \
  -d '{"description":"Updated: kept at Admin Desk"}' | j; then
  echo "(PATCH not supported — skipping FOUND update)"
fi

echo "Fetch Alice's LOST item:"
curl -sS "$LF_BASE/api/items/$LOST_ID" -H "Authorization: Bearer $TA" | j || true

echo "Fetch Alice's FOUND item:"
curl -sS "$LF_BASE/api/items/$FOUND_A_ID" -H "Authorization: Bearer $TA" | j || true

echo "✅ Flow complete."

#!/usr/bin/env bash
set -euo pipefail

API="${API:-http://localhost:3000}"

say(){ printf "\n[ %s ] %s\n" "$1" "$2"; }

say 1 "health"
curl -s -o /dev/null -w "health %{http_code}\n" "$API/api/health"

say 2 "login"
curl -s -o /tmp/login.json -w "login %{http_code}\n" \
  -X POST "$API/api/auth/login" -H "Content-Type: application/json" \
  -d '{"username":"alice_lf","password":"ravi"}'
TOKEN=$(jq -r .token /tmp/login.json)
echo "TOKEN_PREFIX=$(echo "$TOKEN" | cut -c1-12)..."

say 3 "/me"
curl -s -o /tmp/me.json -w "me %{http_code}\n" \
  -H "Authorization: Bearer $TOKEN" "$API/api/me"
jq . /tmp/me.json

say 4 "create item"
curl -s -o /tmp/item.json -w "item %{http_code}\n" \
  -X POST "$API/api/items" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"type":"LOST","title":"Wallet","description":"Brown wallet","category":"Accessories","locationFound":"CSE Block"}'
ITEM_ID=$(jq -r .id /tmp/item.json); echo "ITEM_ID=$ITEM_ID"

say 5 "create claim"
curl -s -o /tmp/claim.json -w "claim %{http_code}\n" \
  -X POST "$API/api/claims" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"itemId\":\"$ITEM_ID\",\"message\":\"Has my ID card\",\"contact\":\"alice_lf@uni\"}"
CLAIM_ID=$(jq -r .id /tmp/claim.json); echo "CLAIM_ID=$CLAIM_ID"

say 6 "approve claim"
curl -s -o /tmp/claim_upd.json -w "approve %{http_code}\n" \
  -X PUT "$API/api/claims/$CLAIM_ID" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'
jq . /tmp/claim_upd.json

say 7 "verify"
curl -s "$API/api/claims/$CLAIM_ID" -H "Authorization: Bearer $TOKEN" | jq '{id,status,itemId}'

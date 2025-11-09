#!/usr/bin/env bash
set -euo pipefail
./test_claim_flow.sh
./test_claim_reject_flow.sh
echo "🎉 Both approve & reject flows passed."

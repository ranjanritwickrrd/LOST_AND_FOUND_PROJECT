#!/usr/bin/env bash
set -euo pipefail

# Prefer test.db if it exists, otherwise fall back to dev.db
DB_TEST='prisma/test.db'
DB_DEV='prisma/dev.db'
TARGET=''

if [ -f "$DB_TEST" ]; then
  TARGET="$DB_TEST"
elif [ -f "$DB_DEV" ]; then
  TARGET="$DB_DEV"
else
  echo "No SQLite DB found. Creating test.db from schema..."
  cross-env NODE_ENV=test DATABASE_URL=file:./prisma/test.db npx prisma db push --skip-generate
  TARGET="$DB_TEST"
fi

echo "Opening Prisma Studio on $TARGET"
DATABASE_URL="file:./$TARGET" npx prisma studio

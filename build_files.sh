#!/bin/bash
set -euo pipefail

PYTHON_BIN="python3"
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  PYTHON_BIN="python"
fi

# Diagnostic: Check if Postgres driver is available
echo "Checking Postgres driver (psycopg v3)..."
"$PYTHON_BIN" -c "try: import psycopg; print('psycopg (v3) found version:', psycopg.__version__); except Exception as e: print('psycopg (v3) import failed:', e)" || true

# Bundle static files for Whitenoise to serve
"$PYTHON_BIN" manage.py collectstatic --noinput --clear

# Run database migrations against the Postgres DB.
# Avoid running migrations on Preview deploys (they may point at prod DB).
if [ "${VERCEL_ENV:-}" = "production" ]; then
  "$PYTHON_BIN" manage.py migrate --noinput
else
  echo "Skipping migrate (VERCEL_ENV=${VERCEL_ENV:-unset})"
fi

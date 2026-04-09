#!/bin/bash
set -euo pipefail

# Vercel by default uses a virtual environment for Python builds.
# Let's ensure pip is up to date and we install dependencies.
python3 -m pip install -r requirements.txt

# Bundle static files for Whitenoise to serve
python3 manage.py collectstatic --noinput --clear

# Run database migrations against the Postgres DB.
# Avoid running migrations on Preview deploys (they may point at prod DB).
if [ "${VERCEL_ENV:-}" = "production" ]; then
  python3 manage.py migrate --noinput
else
  echo "Skipping migrate (VERCEL_ENV=${VERCEL_ENV:-unset})"
fi

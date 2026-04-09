#!/bin/bash

# Vercel by default uses a virtual environment for Python builds.
# Let's ensure pip is up to date and we install dependencies.
python3.9 -m pip install -r requirements.txt

# Bundle static files for Whitenoise to serve
python3.9 manage.py collectstatic --noinput --clear

# Run database migrations against the Postgres DB
python3.9 manage.py migrate

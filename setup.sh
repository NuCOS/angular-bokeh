#!/bin/bash
set -e

# Ensure Node 22 is available without using nvm
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but not installed. Please install Node.js 22.x and rerun this script." >&2
  exit 1
fi

NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -ne 22 ]; then
  echo "Node.js 22.x is required. Current version: $(node -v)" >&2
  exit 1
fi

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..

# Install python dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Setup complete."

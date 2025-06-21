#!/bin/bash
set -e

# Ensure nvm is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \ . "$NVM_DIR/nvm.sh"

# Use Node 16 for Angular 12
nvm install 16
nvm use 16

# Install client dependencies
cd client
npm install --legacy-peer-deps
cd ..

# Install python dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Setup complete."

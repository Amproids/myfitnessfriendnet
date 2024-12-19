#!/bin/bash
set -e
git config core.fileMode true

#Update from the repository
git fetch origin && git reset --hard origin/main

# Start both servers
echo "Starting  servers..."

# Start server
cd server
npm install
npm run start &

# Start client
cd ../client
npm install
npm run build &

echo "Dev environment ready"
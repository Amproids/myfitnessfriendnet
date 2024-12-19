#!/bin/bash
set -e

# Start both dev servers
echo "Starting dev servers..."

# Start server
cd server
npm install
npm run start &

# Start client
cd ../client
npm install
npm run build &

echo "Dev environment ready"
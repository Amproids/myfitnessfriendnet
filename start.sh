#!/bin/bash
set -e

# Then do the hard reset
git fetch origin && git reset --hard origin/main
# Fix permissions again after reset
chmod 775 start.sh

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
#testin
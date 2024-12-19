#!/bin/bash
git fetch origin && git reset --hard origin/main
chmod 775 start.sh
chmod 775 stop.sh

echo "Starting servers..."
(cd server && npm install && npm run start) &
(cd client && npm install && npm run build) &
sleep 1
echo "Client started"
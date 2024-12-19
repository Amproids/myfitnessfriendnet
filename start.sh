#!/bin/bash
git fetch origin && git reset --hard origin/main
chmod 775 start.sh
chmod 775 stop.sh

echo "Starting servers..."

pm2 start myfitnessfriend-back
echo "Server started"

pm2 start myfitnessfriend-front
echo "Client started"
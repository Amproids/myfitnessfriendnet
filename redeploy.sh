#!/bin/bash

# Set up logging
LOG_FILE="/home/andrew/myfitnessfriendnet/deploy.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

echo "Starting deployment at $(date)"

# Navigate to project directory
cd ~/myfitnessfriendnet || exit 1

# Kill existing processes
echo "Killing existing processes..."
lsof -t -i:3002 | xargs kill -9 2>/dev/null || true
lsof -t -i:3001 | xargs kill -9 2>/dev/null || true

# Update from git with fetch and reset
echo "Fetching latest changes..."
git fetch origin
echo "Resetting to origin/main..."
git reset --hard origin/main

# Set permissions for scripts
echo "Setting script permissions..."
chmod 777 ./* || true

# Start server with nohup
echo "Starting server..."
cd server || exit 1
nohup npm run start > ../server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > ../server.pid

# Start client build
echo "Building client..."
cd ../client || exit 1
npm run build &
BUILD_PID=$!

# Wait for build to complete
echo "Waiting for build to complete..."
wait $BUILD_PID
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "Build completed successfully at $(date)"
    echo "Server running with PID: $(cat ../server.pid)"
else
    echo "Build failed with status $BUILD_STATUS at $(date)"
    if [ -f "../server.pid" ]; then
        kill $(cat ../server.pid) 2>/dev/null || true
        rm ../server.pid
    fi
    exit 1
fi

# Keep track of server status
echo "Checking server status..."
sleep 5
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server is running successfully"
else
    echo "Server failed to start properly"
    exit 1
fi

echo "Deployment completed successfully at $(date)"
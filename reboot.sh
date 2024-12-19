#!/bin/bash

# Set up logging
LOG_FILE="deployment.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)
echo "Starting deployment at $(date)"

# Navigate to project directory
cd ~/myfitnessfriendnet || {
    echo "Failed to navigate to project directory"
    exit 1
}

# Kill existing processes
echo "Killing existing processes..."
for port in 3001 3002; do
    pid=$(lsof -t -i:"$port" 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 "$pid" 2>/dev/null || true
    fi
done

# Pull latest changes
echo "Pulling latest changes from main..."
git pull origin main || {
    echo "Failed to pull latest changes"
    exit 1
}

# Start server
echo "Starting server..."
cd server || {
    echo "Failed to navigate to server directory"
    exit 1
}
npm run start &
SERVER_PID=$!
echo "Server started with PID: $SERVER_PID"

# Start client build
echo "Building client..."
cd ../client || {
    echo "Failed to navigate to client directory"
    exit 1
}
npm run build &
BUILD_PID=$!
echo "Build started with PID: $BUILD_PID"

# Wait for build to complete
echo "Waiting for build to complete..."
wait $BUILD_PID
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "Build completed successfully at $(date)"
else
    echo "Build failed with status $BUILD_STATUS at $(date)"
    echo "Killing server process..."
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo "Deployment completed successfully at $(date)"
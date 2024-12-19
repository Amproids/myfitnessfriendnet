#!/bin/bash
set -e

# Define project directory
PROJECT_DIR=~/myfitnessfriendnet

# Update code
cd "$PROJECT_DIR"
git pull

# Build client
cd "$PROJECT_DIR/client"
npm install
npm run build

# Start server
cd "$PROJECT_DIR/server"
npm install
npm run start

echo "Web app started"
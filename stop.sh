#!/bin/bash

# Get current directory where script is run
CURRENT_DIR=$(pwd)

# Find PIDs for processes running from these specific paths
SERVER_PID=$(pgrep -f "node.*$CURRENT_DIR/server")
VITE_PID=$(pgrep -f "vite.*$CURRENT_DIR/client")

if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID
    echo "Server stopped"
fi

if [ ! -z "$VITE_PID" ]; then
    kill $VITE_PID
    echo "Client stopped"
fi
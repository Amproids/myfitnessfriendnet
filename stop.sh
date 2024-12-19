#!/bin/bash

# Kill process on port 3001 (server)
SERVER_PID=$(lsof -ti:3001)
if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID
    echo "Server stopped (port 3001)"
fi

# Kill process on port 3002 (client)
CLIENT_PID=$(lsof -ti:3002)
if [ ! -z "$CLIENT_PID" ]; then
    kill $CLIENT_PID
    echo "Client stopped (port 3002)"
fi
reset

echo "Environment stopped"
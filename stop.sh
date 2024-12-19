#!/bin/bash
# Kill only our specific server processes
SERVER_PID=$(lsof -ti:3001)
CLIENT_PID=$(lsof -ti:3002)

[ ! -z "$SERVER_PID" ] && kill $SERVER_PID
[ ! -z "$CLIENT_PID" ] && kill $CLIENT_PID

echo "Services stopped"
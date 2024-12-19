#!/bin/bash
cd ~/myfitnessfriendnet
pkill -f "node server.js"
git pull
cd backend
node server.js &
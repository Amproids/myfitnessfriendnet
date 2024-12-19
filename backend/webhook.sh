#!/bin/bash
cd ~/myfitnessfriendnet/backend
pkill -f "node server.js"
git pull
node server.js &
#!/bin/bash
cd ~/myfitnessfriendnet
pkill -f "node fitness-server.js"
git pull
node fitness-server.js &
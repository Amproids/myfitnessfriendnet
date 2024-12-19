#!/bin/bash
pkill -f "node server.js"
git pull
node server.js &
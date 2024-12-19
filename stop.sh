#!/bin/bash
set -e
lsof -ti:3001 | xargs -r kill
sleep 3
lsof -ti:3002 | xargs -r kill
sleep 3
echo "Environment stopped"
#!/bin/bash
lsof -ti:3001 | xargs -r kill
sleep 1
lsof -ti:3002 | xargs -r kill
sleep 1
echo "Environment stopped"
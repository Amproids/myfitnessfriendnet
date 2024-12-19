#!/bin/bash
set -e

lsof -ti:3001 | xargs -r kill
sleep 1
echo "Server 1 stopped"

lsof -ti:3002 | xargs -r kill
sleep 1
echo "Server 2 stopped"

sleep 2
echo "Environment stopped"
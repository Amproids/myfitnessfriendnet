#!/bin/bash
(lsof -ti:3001 | xargs -r kill) &
(lsof -ti:3002 | xargs -r kill) &
wait
sleep 1
reset
echo "Environment stopped"
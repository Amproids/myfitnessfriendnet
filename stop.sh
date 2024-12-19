#!/bin/bash
(lsof -ti:3001 | xargs -r kill) &
(lsof -ti:3002 | xargs -r kill) &
wait
echo "Environment stopped"
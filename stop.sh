#!/bin/bash
pkill -f "node.*server"
sleep 1
pkill -f "node.*client" 
sleep 1
echo "Environment stopped"
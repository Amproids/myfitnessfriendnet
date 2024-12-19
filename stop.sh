#!/bin/bash

# Stop server
pkill -f "node.*server"

# Stop client dev server (if running)
pkill -f "vite"

echo "All servers stopped"
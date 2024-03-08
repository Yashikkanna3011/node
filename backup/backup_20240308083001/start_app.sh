#!/bin/bash

# Specify the path to your Node.js application
APP_PATH="/root/node-mysql"
# Specify the name of your Node.js application file
APP_FILE="server.js"

# Check if the Node.js application is already running
if pgrep -f "$APP_FILE" > /dev/null
then
    echo "Node.js application is already running."
else
    echo "Node.js application is not running. Starting..."
    cd "$APP_PATH" || exit
    pm2 start "$APP_FILE"
fi


#!/bin/bash

# Navigate to the directory where your Node.js application is located
cd /root/node-mysql

# Restart the Node.js application using pm2
pm2 restart server.js

# Capture MySQL logs
cp /root/node-mysql/access.log /usr/bin/mysql /mysql/logs/mysql.log
> /root/node-mysql/access.log


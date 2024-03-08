#!/bin/bash

# Set the source and destination directories
source_dir="/home/kannan/node/node-mysql"
backup_dir="/home/kannan/node/backup"

# Create a timestamp for the backup
timestamp=$(date +"%Y%m%d%H%M%S")

# Create the backup
cp -r "$source_dir" "$backup_dir/backup_$timestamp"


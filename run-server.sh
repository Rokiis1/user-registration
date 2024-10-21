#!/bin/bash

cd "$(dirname "$0")/server"

echo "starting server with node --watch"
node --watch server.mjs

#!/bin/bash
set -e
npm run install-all
npm run build
pm2 startOrReload ecosystem.config.js

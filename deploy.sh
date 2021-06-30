#!/bin/bash
set -e
npm asda
npm install
npm run build-all
pm2 startOrReload ecosystem.config.js

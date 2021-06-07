#!/bin/bash
npm install
npm run build-all
pm2 startOrReload ecosystem.config.js && pm2 log

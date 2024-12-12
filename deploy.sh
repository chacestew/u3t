#!/bin/bash
set -e
bun install
bun run build-all
pm2 startOrReload ecosystem.config.js

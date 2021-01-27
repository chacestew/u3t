#!/bin/bash
echo "Starting development stack"
(cd client && npm start) & (cd server && npm start)
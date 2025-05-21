#!/bin/sh

echo "[user-service] Startuję..." > /status/start.log
touch /status/start.ok

trap 'echo "[user-service] Kończę..."; touch /status/stopped.ok; exit' SIGTERM

node app.js

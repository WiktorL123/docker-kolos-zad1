#!/bin/sh

echo "[course-service] Startuję..." > /status/start.log
touch /status/start.ok

trap 'echo "[course-service] Zamykam..."; touch /status/stopped.ok; exit' SIGTERM

node app.js

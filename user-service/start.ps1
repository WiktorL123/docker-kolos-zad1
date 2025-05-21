New-Item -ItemType Directory -Force -Path "/status" | Out-Null
"[user-service] Startuję..." | Set-Content "/status/start.log"
New-Item -ItemType File -Force -Path "/status/start.ok" | Out-Null

# Obsługa sygnału zakończenia
$event = {
    "[user-service] Kończę..." | Out-Host
    New-Item -ItemType File -Force -Path "/status/stopped.ok" | Out-Null
    Stop-Process -Id $PID
}
Register-EngineEvent PowerShell.Exiting -Action $event | Out-Null

node app.js

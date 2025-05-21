New-Item -ItemType Directory -Force -Path "/status" | Out-Null
"[course-service] Startuję..." | Set-Content "/status/start.log"
New-Item -ItemType File -Force -Path "/status/start.ok" | Out-Null

# Obsługa sygnału zakończenia
$event = {
    "[course-service] Zamykam..." | Out-Host
    New-Item -ItemType File -Force -Path "/status/stopped.ok" | Out-Null
    Stop-Process -Id $PID
}
Register-EngineEvent PowerShell.Exiting -Action $event | Out-Null

node app.js

@echo off
cd server
start /min cmd /k "npm run dev"
cd ..
cd client
start /min cmd /k "npm run dev"
timeout /t 2 /nobreak > nul
start brave http://localhost:5173

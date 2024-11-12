@echo off
set SCRIPT_PATH="D:\React3.0\IMS-proj\start_and_monitor.ps1"
echo Starting server, client, and monitoring browser activity...
PowerShell -ExecutionPolicy Bypass -File %SCRIPT_PATH%
pause

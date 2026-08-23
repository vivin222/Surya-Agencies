@echo off
title Surya Agencies - Real-Time Server & Tunnel Launcher
echo ================================================================
echo 🍨 SURYA AGENCIES - STANDALONE SERVER LAUNCHER
echo ================================================================
echo Starting backend server and worldwide tunnel...
cd /d "%~dp0"

start "Surya Agencies Server" cmd /k "node server.js"
timeout /t 2 >nul
start "Surya Agencies Cloudflare Tunnel" cmd /k "%~dp0cloudflared.exe tunnel --url http://127.0.0.1:8080"

echo.
echo ✅ Server is running!
echo 📱 Open Customer Store: http://localhost:8080/#customer
echo 🏪 Open Shopkeeper Portal: http://localhost:8080/#shopkeeper
echo.
pause

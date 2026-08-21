@echo off
title Surya Agencies Real-Time System
echo Starting Local Server & Cloudflare Worldwide Tunnel...
cd /d "%~dp0"
start "Arun Icecreams Backend" cmd /k "node server.js"
start "Cloudflare Worldwide Tunnel" cmd /k "cloudflared tunnel --url http://localhost:8080"
echo Server started! Open http://localhost:8080

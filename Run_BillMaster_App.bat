@echo off
title BillMaster - Java Full Stack Billing App
echo ============================================================
echo         BillMaster - Integrated Billing System
echo    (Java Spring Boot + React + Data Structures Engine)
echo ============================================================
echo.

:: Step 1: Start Backend Server
echo [1/3] Launching Java Spring Boot Backend Server (Port 8080)...
start "BillMaster Backend" /min cmd /c "cd /d %~dp0backend && .\mvnw.cmd spring-boot:run"

:: Step 2: Start Frontend Server
echo [2/3] Launching React Frontend Server (Port 5173)...
start "BillMaster Frontend" /min cmd /c "cd /d %~dp0frontend && npm run dev"

:: Step 3: Open in Browser
echo [3/3] Waiting 4 seconds for servers to start...
timeout /t 4 /nobreak > nul

echo.
echo Opening BillMaster App in your default web browser...
start http://localhost:5173

echo.
echo ============================================================
echo  BillMaster App is NOW RUNNING!
echo  - Web Application: http://localhost:5173
echo  - Backend API: http://localhost:8080/api
echo  - H2 Database Console: http://localhost:8080/h2-console
echo.
echo  Keep this window open while using the app. Press any key to stop servers.
echo ============================================================
pause

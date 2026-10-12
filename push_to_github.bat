@echo off
title Upload BillMaster to GitHub (24eg109a52-lab/Billmaster)
color 0b
echo ============================================================
echo      Uploading BillMaster Project to GitHub Repository
echo        https://github.com/24eg109a52-lab/Billmaster
echo ============================================================
echo.

echo [1/3] Setting remote origin...
"C:\Users\surra\AppData\Local\github-copilot-git-2.53.0-3\cmd\git.exe" remote remove origin 2>nul
"C:\Users\surra\AppData\Local\github-copilot-git-2.53.0-3\cmd\git.exe" remote add origin https://github.com/24eg109a52-lab/Billmaster.git

echo [2/3] Setting branch to main...
"C:\Users\surra\AppData\Local\github-copilot-git-2.53.0-3\cmd\git.exe" branch -M main

echo [3/3] Uploading all files to GitHub...
echo (If a browser window opens, click 'Sign in with your browser' or 'Authorize')
echo.
"C:\Users\surra\AppData\Local\github-copilot-git-2.53.0-3\cmd\git.exe" push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ============================================================
    echo  SUCCESS! All project files are uploaded to GitHub!
    echo  View it here: https://github.com/24eg109a52-lab/Billmaster
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo  Upload finished or requires browser authorization.
    echo ============================================================
)
echo.
pause

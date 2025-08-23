@echo off
echo Offline LeetCode Practice System - Local Startup
echo ===================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not found
    echo Please install Node.js: https://nodejs.org
    pause
    exit /b 1
)

echo Node.js installed: 
node --version

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
)

REM Check if project is built
if not exist ".next\" (
    echo Building application...
    npm run build
    if %errorlevel% neq 0 (
        echo Build failed
        pause
        exit /b 1
    )
    echo Build completed successfully
)

echo.
echo Starting application...
echo URL: http://localhost:3000
echo.
echo Usage Instructions:
echo    - Open http://localhost:3000 in your browser
echo    - Fully local execution, no external network required
echo    - Press Ctrl+C to stop the server
echo.

REM Start the application
npm start
@ECHO OFF
SETLOCAL

ECHO Building Offline Leet Practice for Windows
ECHO ========================================

:: Check if Node.js is installed
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Error: Node.js not found
    ECHO Please install Node.js: https://nodejs.org
    EXIT /B 1
)
FOR /F "tokens=*" %%v IN ('node --version') DO ECHO Node.js installed: %%v

:: Check if npm is installed
WHERE npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    ECHO Error: npm not found
    ECHO Please install npm
    EXIT /B 1
)
FOR /F "tokens=*" %%v IN ('npm --version') DO ECHO npm installed: %%v

:: Install dependencies
ECHO Installing dependencies...
CALL npm install
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to install dependencies
    EXIT /B 1
)
ECHO Dependencies installed successfully

:: Build Next.js app
ECHO Building Next.js application...
CALL npm run build
IF %ERRORLEVEL% NEQ 0 (
    ECHO Build failed
    EXIT /B 1
)
ECHO Next.js build completed successfully

:: Build Electron app for Windows with additional flags to handle symbolic links
ECHO Building Electron app for Windows...
CALL npx electron-builder --win --config electron-builder.config.js
IF %ERRORLEVEL% NEQ 0 (
    ECHO Electron build failed
    ECHO.
    ECHO Trying alternative build method with elevated privileges...
    ECHO If this fails, please run this script as Administrator
    EXIT /B 1
)

ECHO.
ECHO Windows build completed successfully!
ECHO Installer can be found in the 'dist' folder
ECHO.

ENDLOCAL
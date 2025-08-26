# PowerShell script to build Offline Leet Practice for Windows
# This script can request elevated privileges if needed

param(
    [switch]$ForceElevated = $false
)

function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Start-ProcessAsAdmin {
    $scriptPath = $MyInvocation.MyCommand.Definition
    $arguments = "-File `"$scriptPath`" -ForceElevated"
    
    Start-Process powershell.exe -Verb RunAs -ArgumentList $arguments
    exit
}

# Check if we need to run as admin
if ($ForceElevated -and -not (Test-Admin)) {
    Write-Host "Requesting elevated privileges..."
    Start-ProcessAsAdmin
}

Write-Host "Building Offline Leet Practice for Windows"
Write-Host "========================================"

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Error: Node.js not found. Please install Node.js: https://nodejs.org"
    exit 1
}

$nodeVersion = node --version
Write-Host "Node.js installed: $nodeVersion"

# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "Error: npm not found. Please install npm"
    exit 1
}

$npmVersion = npm --version
Write-Host "npm installed: $npmVersion"

# Install dependencies
Write-Host "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install dependencies"
    exit 1
}
Write-Host "Dependencies installed successfully"

# Build Next.js app
Write-Host "Building Next.js application..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed"
    exit 1
}
Write-Host "Next.js build completed successfully"

# Build Electron app for Windows
Write-Host "Building Electron app for Windows..."
npx electron-builder --win --config electron-builder.config.js
if ($LASTEXITCODE -ne 0) {
    Write-Error "Electron build failed"
    Write-Host ""
    Write-Host "If this error persists, please run this script as Administrator:"
    Write-Host "Right-click on PowerShell and select 'Run as Administrator'"
    Write-Host "Then navigate to this directory and run: .\build-windows.ps1"
    exit 1
}

Write-Host ""
Write-Host "Windows build completed successfully!"
Write-Host "Installer can be found in the 'dist' folder"
Write-Host ""
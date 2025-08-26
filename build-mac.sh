#!/bin/bash

echo "Building Offline Leet Practice for macOS"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found"
    echo "Please install Node.js: https://nodejs.org"
    exit 1
fi

echo "Node.js installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm not found"
    echo "Please install npm"
    exit 1
fi

echo "npm installed: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed successfully"

# Build Next.js app
echo "Building Next.js application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi
echo "Next.js build completed successfully"

# Build Electron app for macOS
echo "Building Electron app for macOS..."
npx electron-builder --mac
if [ $? -ne 0 ]; then
    echo "Electron build failed"
    exit 1
fi

echo ""
echo "macOS build completed successfully!"
echo "Installer can be found in the 'dist' folder"
echo ""
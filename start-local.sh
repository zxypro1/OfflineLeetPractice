#!/bin/bash

# Offline LeetCode Practice System - Local Startup Script
# ======================================================

echo "Offline LeetCode Practice System - Local Startup"
echo "==================================================="
echo ""

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

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies"
        exit 1
    fi
    echo "Dependencies installed successfully"
fi

# Check if project is built
if [ ! -d ".next" ]; then
    echo "Building application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "Build failed"
        exit 1
    fi
    echo "Build completed successfully"
fi

echo ""
echo "Starting application..."
echo "URL: http://localhost:3000"
echo ""
echo "Usage Instructions:"
echo "   - Open http://localhost:3000 in your browser"
echo "   - Fully local execution, no external network required"
echo "   - Press Ctrl+C to stop the server"
echo ""

# Start the application
npm start
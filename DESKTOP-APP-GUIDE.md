# Desktop App Packaging Guide

This guide explains how to package the Offline Leet Practice application as a desktop app for Windows, macOS, and Linux using Electron.

## Prerequisites

Before packaging the application, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Project Structure for Desktop App

The desktop app packaging adds the following files to the project:
- `electron-main.js`: Main Electron process file
- `build-windows.bat`: Windows build script
- `build-mac.sh`: macOS build script
- `public/desktop-index.html`: Desktop entry point

## Building for All Platforms

You can build the desktop app for all supported platforms (Windows, macOS, and Linux) using a single command:

```bash
npm run dist:all
```

This will generate installers for all platforms in the `dist` folder.

## Building for Windows

### Using the build script (Recommended)

1. Double-click on `build-windows.bat` or run it from the command line:
   ```cmd
   build-windows.bat
   ```

2. The script will:
   - Install all dependencies
   - Build the Next.js application
   - Package the app as a Windows installer

3. The installer will be created in the `dist` folder as an `.exe` file.

### Manual build

If you prefer to build manually:

1. Install dependencies:
   ```cmd
   npm install
   ```

2. Build the Next.js application:
   ```cmd
   npm run build
   ```

3. Package for Windows:
   ```cmd
   npx electron-builder --win
   ```
   
   Or use the npm script:
   ```cmd
   npm run dist:win
   ```

### Windows Build Issues and Solutions

#### Symbolic Link Permission Error

On Windows, you might encounter an error like:
```
ERROR: Cannot create symbolic link : 客户端没有所需的特权。(Client does not have required privileges)
```

This happens because electron-builder tries to extract dependencies that contain symbolic links, which requires administrator privileges on Windows.

**Solutions:**

1. **Run as Administrator (Recommended)**:
   - Right-click on Command Prompt or PowerShell and select "Run as Administrator"
   - Navigate to your project directory
   - Run the build command: `npx electron-builder --win`

2. **Use the PowerShell Script**:
   - Run `build-windows.ps1` which can automatically request elevated privileges:
   ```powershell
   .\build-windows.ps1
   ```

3. **Developer Mode**:
   - Enable Developer Mode in Windows Settings
   - This may help with symbolic link creation without requiring administrator privileges

## Building for macOS

### Using the build script (Recommended)

1. Make the script executable (if not already):
   ```bash
   chmod +x build-mac.sh
   ```

2. Run the build script:
   ```bash
   ./build-mac.sh
   ```

3. The script will:
   - Install all dependencies
   - Build the Next.js application
   - Package the app as a macOS installer

4. The installer will be created in the `dist` folder as a `.dmg` file.

### Manual build

If you prefer to build manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the Next.js application:
   ```bash
   npm run build
   ```

3. Package for macOS:
   ```bash
   npx electron-builder --mac
   ```
   
   Or use the npm script:
   ```bash
   npm run dist:mac
   ```

## Building for Linux

You can also build the app for Linux:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the Next.js application:
   ```bash
   npm run build
   ```

3. Package for Linux:
   ```bash
   npx electron-builder --linux
   ```
   
   Or use the npm script:
   ```bash
   npm run dist:linux
   ```

This will generate an AppImage file in the `dist` folder.

## Development

To run the app in development mode with Electron:

```bash
npm run electron-dev
```

This will start the Next.js development server and open the app in an Electron window.

## Customization

### App Icon

To customize the app icon:
1. Create your icon in PNG format (recommended size: 512x512 pixels)
2. Save it as `public/icon.png`
3. The build process will automatically use this icon

### App Metadata

You can customize the app metadata in the `build` section of `package.json`:
- `appId`: Unique identifier for your app
- `productName`: Display name of your app
- Platform-specific settings for Windows, macOS, and Linux

## Technical Details

The desktop app works by:
1. Starting a local Next.js server on port 3000
2. Opening an Electron window that loads the local server
3. Bundling all necessary files into a standalone installer

The app is completely offline-capable after installation, just like the web version.

## Troubleshooting

### Port Conflicts

If port 3000 is already in use, the app may fail to start. Either:
- Close the application using port 3000
- Modify the port in `electron-main.js`

### Build Failures

If you encounter build failures:
1. Ensure all dependencies are installed: `npm install`
2. Check that you're using Node.js 16 or higher
3. Clear the build cache: delete the `.next` folder and try again

### Windows Symbolic Link Issues

If you encounter symbolic link errors on Windows:
1. Run the build script as Administrator
2. Use the PowerShell script which can request elevated privileges
3. Enable Developer Mode in Windows Settings

### macOS Security

On macOS, you might need to allow the app in System Preferences > Security & Privacy if it's blocked from opening.

## File Locations After Installation

### Windows
- Program Files: `C:\Program Files\Offline Leet Practice\`
- User data: `%APPDATA%\Offline Leet Practice\`

### macOS
- Applications folder: `/Applications/Offline Leet Practice.app`
- User data: `~/Library/Application Support/Offline Leet Practice/`

### Linux
- AppImage can be run from any location
- User data: `~/.config/Offline Leet Practice/`

## Updating the App

To update the app, you'll need to build a new version and reinstall it. The app doesn't have auto-update functionality built-in.
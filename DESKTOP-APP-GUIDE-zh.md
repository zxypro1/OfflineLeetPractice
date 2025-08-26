# 桌面应用程序打包指南

本指南解释了如何使用 Electron 将 Offline Leet Practice 应用程序打包为 Windows、macOS 和 Linux 的桌面应用程序。

## 系统要求

在打包应用程序之前，请确保您已安装以下软件：
- Node.js（版本 16 或更高）
- npm（随 Node.js 一起提供）

## 桌面应用程序的项目结构

桌面应用程序打包会向项目中添加以下文件：
- `electron-main.js`：Electron 主进程文件
- `build-windows.bat`：Windows 构建脚本
- `build-mac.sh`：macOS 构建脚本
- `public/desktop-index.html`：桌面应用程序入口点

## 为所有平台构建

您可以使用单个命令为所有支持的平台（Windows、macOS 和 Linux）构建桌面应用程序：

```bash
npm run dist:all
```

这将在 `dist` 文件夹中为所有平台生成安装程序。

## 为 Windows 构建

### 使用构建脚本（推荐）

1. 双击 `build-windows.bat` 或从命令行运行：
   ```cmd
   build-windows.bat
   ```

2. 脚本将：
   - 安装所有依赖项
   - 构建 Next.js 应用程序
   - 将应用程序打包为 Windows 安装程序

3. 安装程序将在 `dist` 文件夹中创建为 `.exe` 文件。

### 手动构建

如果您更喜欢手动构建：

1. 安装依赖项：
   ```cmd
   npm install
   ```

2. 构建 Next.js 应用程序：
   ```cmd
   npm run build
   ```

3. 为 Windows 打包：
   ```cmd
   npx electron-builder --win
   ```
   
   或使用 npm 脚本：
   ```cmd
   npm run dist:win
   ```

### Windows 构建问题和解决方案

#### 符号链接权限错误

在 Windows 上，您可能会遇到如下错误：
```
ERROR: Cannot create symbolic link : 客户端没有所需的特权。(Client does not have required privileges)
```

这是因为 electron-builder 尝试提取包含符号链接的依赖项，这在 Windows 上需要管理员权限。

**解决方案：**

1. **以管理员身份运行（推荐）**：
   - 右键单击命令提示符或 PowerShell 并选择"以管理员身份运行"
   - 导航到您的项目目录
   - 运行构建命令：`npx electron-builder --win`

2. **使用 PowerShell 脚本**：
   - 运行 `build-windows.ps1`，它可以自动请求提升权限：
   ```powershell
   .\build-windows.ps1
   ```

3. **开发者模式**：
   - 在 Windows 设置中启用开发者模式
   - 这可能有助于在不需要管理员权限的情况下创建符号链接

## 为 macOS 构建

### 使用构建脚本（推荐）

1. 使脚本可执行（如果尚未执行）：
   ```bash
   chmod +x build-mac.sh
   ```

2. 运行构建脚本：
   ```bash
   ./build-mac.sh
   ```

3. 脚本将：
   - 安装所有依赖项
   - 构建 Next.js 应用程序
   - 将应用程序打包为 macOS 安装程序

4. 安装程序将在 `dist` 文件夹中创建为 `.dmg` 文件。

### 手动构建

如果您更喜欢手动构建：

1. 安装依赖项：
   ```bash
   npm install
   ```

2. 构建 Next.js 应用程序：
   ```bash
   npm run build
   ```

3. 为 macOS 打包：
   ```bash
   npx electron-builder --mac
   ```
   
   或使用 npm 脚本：
   ```bash
   npm run dist:mac
   ```

## 为 Linux 构建

您也可以为 Linux 构建应用程序：

1. 安装依赖项：
   ```bash
   npm install
   ```

2. 构建 Next.js 应用程序：
   ```bash
   npm run build
   ```

3. 为 Linux 打包：
   ```bash
   npx electron-builder --linux
   ```
   
   或使用 npm 脚本：
   ```bash
   npm run dist:linux
   ```

这将在 `dist` 文件夹中生成 AppImage 文件。

## 开发

要在 Electron 中以开发模式运行应用程序：

```bash
npm run electron-dev
```

这将启动 Next.js 开发服务器并在 Electron 窗口中打开应用程序。

## 自定义

### 应用程序图标

要自定义应用程序图标：
1. 以 PNG 格式创建您的图标（推荐尺寸：512x512 像素）
2. 将其保存为 `public/icon.png`
3. 构建过程将自动使用此图标

### 应用程序元数据

您可以在 `package.json` 的 `build` 部分自定义应用程序元数据：
- `appId`：应用程序的唯一标识符
- `productName`：应用程序的显示名称
- Windows、macOS 和 Linux 的平台特定设置

## 技术细节

桌面应用程序的工作原理：
1. 在端口 3000 上启动本地 Next.js 服务器
2. 打开一个加载本地服务器的 Electron 窗口
3. 将所有必要文件打包到独立的安装程序中

安装后的应用程序完全支持离线使用，就像 Web 版本一样。

## 故障排除

### 端口冲突

如果端口 3000 已被使用，应用程序可能无法启动。可以：
- 关闭使用端口 3000 的应用程序
- 修改 `electron-main.js` 中的端口

### 构建失败

如果遇到构建失败：
1. 确保所有依赖项都已安装：`npm install`
2. 检查您是否使用的是 Node.js 16 或更高版本
3. 清除构建缓存：删除 `.next` 文件夹并重试

### Windows 符号链接问题

如果在 Windows 上遇到符号链接错误：
1. 以管理员身份运行构建脚本
2. 使用可以请求提升权限的 PowerShell 脚本
3. 在 Windows 设置中启用开发者模式

### macOS 安全性

在 macOS 上，您可能需要在系统偏好设置 > 安全性与隐私中允许应用程序，如果它被阻止打开。

## 安装后的文件位置

### Windows
- 程序文件：`C:\Program Files\Offline Leet Practice\`
- 用户数据：`%APPDATA%\Offline Leet Practice\`

### macOS
- 应用程序文件夹：`/Applications/Offline Leet Practice.app`
- 用户数据：`~/Library/Application Support/Offline Leet Practice/`

### Linux
- AppImage 可以从任何位置运行
- 用户数据：`~/.config/Offline Leet Practice/`

## 更新应用程序

要更新应用程序，您需要构建新版本并重新安装。该应用程序没有内置自动更新功能。
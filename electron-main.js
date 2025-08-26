const { app, BrowserWindow, shell, Menu, ipcMain } = require('electron');
const { createServer } = require('http');
const next = require('next');
const path = require('path');
const fs = require('fs');
const os = require('os');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

let mainWindow;
let server;

// Function to update the application menu
function updateApplicationMenu(language = 'en') {
  // Define menu labels for different languages
  const menuLabels = {
    en: {
      navigation: 'Navigation',
      home: 'Home',
      settings: 'Settings',
      aiGenerator: 'AI Generator',
      addProblem: 'Add Problem',
      view: 'View',
      help: 'Help',
      documentation: 'Documentation'
    },
    zh: {
      navigation: '导航',
      home: '首页',
      settings: '设置',
      aiGenerator: 'AI 生成器',
      addProblem: '添加题目',
      view: '视图',
      help: '帮助',
      documentation: '文档'
    }
  };
  
  const labels = menuLabels[language] || menuLabels.en;
  
  // Create the application menu
  const menu = Menu.buildFromTemplate([
    {
      label: labels.navigation,
      submenu: [
        {
          label: labels.home,
          click: () => mainWindow.loadURL('http://localhost:3000')
        },
        {
          label: labels.settings,
          click: () => mainWindow.loadURL('http://localhost:3000/settings')
        },
        {
          label: labels.aiGenerator,
          click: () => mainWindow.loadURL('http://localhost:3000/generator')
        },
        {
          label: labels.addProblem,
          click: () => mainWindow.loadURL('http://localhost:3000/add-problem')
        }
      ]
    },
    {
      label: labels.view,
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: labels.help,
      submenu: [
        {
          label: labels.documentation,
          click: () => shell.openExternal('https://github.com/OfflineLeetPractice')
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

async function startNextServer() {
  try {
    // Load saved configuration at startup and set environment variables
    try {
      const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
      if (fs.existsSync(configPath)) {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        // Set environment variables
        if (configData.deepSeek) {
          if (configData.deepSeek.apiKey) process.env.DEEPSEEK_API_KEY = configData.deepSeek.apiKey;
          if (configData.deepSeek.model) process.env.DEEPSEEK_MODEL = configData.deepSeek.model;
          if (configData.deepSeek.timeout) process.env.DEEPSEEK_API_TIMEOUT = configData.deepSeek.timeout;
          if (configData.deepSeek.maxTokens) process.env.DEEPSEEK_MAX_TOKENS = configData.deepSeek.maxTokens;
        }
        
        if (configData.openAI) {
          if (configData.openAI.apiKey) process.env.OPENAI_API_KEY = configData.openAI.apiKey;
          if (configData.openAI.model) process.env.OPENAI_MODEL = configData.openAI.model;
        }
        
        if (configData.qwen) {
          if (configData.qwen.apiKey) process.env.QWEN_API_KEY = configData.qwen.apiKey;
          if (configData.qwen.model) process.env.QWEN_MODEL = configData.qwen.model;
        }
        
        if (configData.claude) {
          if (configData.claude.apiKey) process.env.CLAUDE_API_KEY = configData.claude.apiKey;
          if (configData.claude.model) process.env.CLAUDE_MODEL = configData.claude.model;
        }
        
        if (configData.ollama) {
          if (configData.ollama.endpoint) process.env.OLLAMA_ENDPOINT = configData.ollama.endpoint;
          if (configData.ollama.model) process.env.OLLAMA_MODEL = configData.ollama.model;
        }
      }
    } catch (configError) {
      console.error('Error loading saved configuration:', configError);
    }
    
    const nextApp = next({ dev, hostname, port });
    const nextHandler = nextApp.getRequestHandler();
    
    server = createServer(async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `nextApp.render` to properly handle SSR
        await nextHandler(req, res);
      } catch (error) {
        console.error('Error occurred handling', req.url, error);
        res.statusCode = 500;
        res.end('internal server error');
      }
    });

    await nextApp.prepare();
    
    server.listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      // Only load the main app URL after the server is ready
      if (mainWindow) {
        mainWindow.loadURL(`http://${hostname}:${port}`);
      }
    });

    return nextApp;
  } catch (error) {
    console.error('Failed to start Next.js server:', error);
    process.exit(1);
  }
}
let savedThemePref = 'light';

function createWindow() {
  // Load saved theme preference
  try {
    const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (configData.theme) {
        savedThemePref = configData.theme;
      }
    }
  } catch (error) {
    console.error('Error loading theme preference:', error);
  }
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: savedThemePref === 'dark' ? '#1A1B1E' : '#FFFFFF',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    icon: path.join(__dirname, 'public', 'icon.png') // You'll need to add an icon file
  });

  // Load saved language and theme preferences
  let savedLanguage = 'en';
  
  try {
    const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (configData.language) {
        savedLanguage = configData.language;
      }
      if (configData.theme) {
        savedThemePref = configData.theme;
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  
  // Update the application menu with the saved language
  updateApplicationMenu(savedLanguage);
  
  // Apply theme to the main window
  if (mainWindow) {
    mainWindow.setBackgroundColor(savedThemePref === 'dark' ? '#1A1B1E' : '#FFFFFF');
  }

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Load the desktop entry point first
  mainWindow.loadFile(path.join(__dirname, 'public', 'desktop-main.html'));
}

app.whenReady().then(async () => {
  await startNextServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) {
      server.close(() => {
        console.log('Server closed');
      });
    }
    app.quit();
  }
});

// Handle app termination gracefully
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});

// IPC event handlers for configuration management
ipcMain.handle('save-config', async (event, configData) => {
  try {
    // Save configuration to a file in the user's home directory
    const configDir = path.join(os.homedir(), '.offline-leet-practice');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configPath = path.join(configDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    // Set environment variables for the current process
    if (configData.deepSeek) {
      if (configData.deepSeek.apiKey) process.env.DEEPSEEK_API_KEY = configData.deepSeek.apiKey;
      if (configData.deepSeek.model) process.env.DEEPSEEK_MODEL = configData.deepSeek.model;
      if (configData.deepSeek.timeout) process.env.DEEPSEEK_API_TIMEOUT = configData.deepSeek.timeout;
      if (configData.deepSeek.maxTokens) process.env.DEEPSEEK_MAX_TOKENS = configData.deepSeek.maxTokens;
    }
    
    if (configData.openAI) {
      if (configData.openAI.apiKey) process.env.OPENAI_API_KEY = configData.openAI.apiKey;
      if (configData.openAI.model) process.env.OPENAI_MODEL = configData.openAI.model;
    }
    
    if (configData.qwen) {
      if (configData.qwen.apiKey) process.env.QWEN_API_KEY = configData.qwen.apiKey;
      if (configData.qwen.model) process.env.QWEN_MODEL = configData.qwen.model;
    }
    
    if (configData.claude) {
      if (configData.claude.apiKey) process.env.CLAUDE_API_KEY = configData.claude.apiKey;
      if (configData.claude.model) process.env.CLAUDE_MODEL = configData.claude.model;
    }
    
    if (configData.ollama) {
      if (configData.ollama.endpoint) process.env.OLLAMA_ENDPOINT = configData.ollama.endpoint;
      if (configData.ollama.model) process.env.OLLAMA_MODEL = configData.ollama.model;
    }
    
    // Update menu if language changed
    if (configData.language) {
      updateApplicationMenu(configData.language);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving configuration:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-config', async () => {
  try {
    // Load configuration from a file in the user's home directory
    const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      return { success: true, data: JSON.parse(configData) };
    } else {
      return { success: true, data: {} };
    }
  } catch (error) {
    console.error('Error loading configuration:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-language', async (event, language) => {
  try {
    // Load existing configuration
    let configData = {};
    const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
    
    if (fs.existsSync(configPath)) {
      configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    // Update language preference
    configData.language = language;
    
    // Save updated configuration
    const configDir = path.join(os.homedir(), '.offline-leet-practice');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    // Update the application menu
    updateApplicationMenu(language);
    
    return { success: true };
  } catch (error) {
    console.error('Error setting language:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('set-theme', async (event, theme) => {
  try {
    // Load existing configuration
    let configData = {};
    const configPath = path.join(os.homedir(), '.offline-leet-practice', 'config.json');
    
    if (fs.existsSync(configPath)) {
      configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    
    // Update theme preference
    configData.theme = theme;
    
    // Save updated configuration
    const configDir = path.join(os.homedir(), '.offline-leet-practice');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    
    // Apply theme to the main window
    if (mainWindow) {
      mainWindow.setBackgroundColor(theme === 'dark' ? '#1A1B1E' : '#FFFFFF');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error setting theme:', error);
    return { success: false, error: error.message };
  }
});
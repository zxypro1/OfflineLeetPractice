// electron-preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveConfiguration: (configData) => ipcRenderer.invoke('save-config', configData),
  loadConfiguration: () => ipcRenderer.invoke('load-config'),
  setLanguage: (language) => ipcRenderer.invoke('set-language', language),
  setTheme: (theme) => ipcRenderer.invoke('set-theme', theme),
  // Add other IPC methods as needed
});
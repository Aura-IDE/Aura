// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Definování bezpečného API pro použití v procesu renderování
contextBridge.exposeInMainWorld('electronAPI', {
  sendToMain: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receiveFromMain: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
});

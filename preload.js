const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcSend', ipcRenderer.send)
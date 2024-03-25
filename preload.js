const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendToMain: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    ipcRenderer: ipcRenderer
});
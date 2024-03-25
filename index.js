const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { Client } = require('discord-rpc');

let mainWindow;
let openedFileName;
const clientId = '1221435094921777222';
const rpc = new Client({ transport: 'ipc' });

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        icon: path.join(__dirname, 'src', 'assets', 'logo.png'),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    rpc.login({ clientId }).catch(console.error);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('control-window', (event, control) => {
  if (control === 'minimize') {
    mainWindow.minimize();
  } else if (control === 'maximize') {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  } else if (control === 'close') {
    mainWindow.close();
  }
});

ipcMain.on('file-opened', (event, fileName, fileContent) => {
    openedFileName = fileName;
    console.log('Name of opened file:', openedFileName);
    mainWindow.webContents.send('update-editor', fileContent);
    updateRPC();
});

ipcMain.on('update-editor', (event, fileContent) => {
    mainWindow.webContents.send('update-editor', fileContent);
});

function updateRPC() {
    rpc.setActivity({
        details: openedFileName,
        state: 'Open Source IDE',
        startTimestamp: new Date().getTime(),
        largeImageKey: 'aura',
        largeImageText: 'JavaScript', //name of Language whats editing
        smallImageKey: 'aura',
        smallImageText: 'Aura IDE 0.2',
    });
}

rpc.on('ready', () => {
    console.log('Discord RPC connected!');
    updateRPC();
});
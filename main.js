const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { Client } = require('discord-rpc');
const fetch = require('node-fetch');

let mainWindow;
let openedFileName;
const clientId = '1221435094921777222';
const rpc = new Client({ transport: 'ipc' });

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
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
    mainWindow.webContents.openDevTools()
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

ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }).then((result) => {
        if (!result.canceled) {
            event.sender.send('selected-file', result.filePaths[0]);
        }
    }).catch((err) => {
        console.error(err);
    });
  });

    let fileName = "Being Idle"; // Výchozí hodnota pro details

    ipcMain.on('file-opened', (event, data) => {
        fileName = data.fileName;
        updateRPC(fileName);
    });
  
    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
  
    function updateRPC(fileName) {
        let detailsText = fileName === "Being Idle" ? fileName : 'Editing: ' + fileName;
        let fileExtension = fileName === "Being Idle" ? '' : getFileExtension(fileName);
        let largeImageText = fileExtension ? fileExtension.toUpperCase() : 'None';

        let buttons = [
            { label: "Download", url: "https://auraide.net//download/latest" },
            { label: "GitHub Repository", url: "https://github.com/Aura-IDE/Aura" }
        ];

        rpc.setActivity({
            details: detailsText, 
            state: 'Workspace: ?',
            startTimestamp: new Date().getTime(),
            largeImageKey: 'aura',
            largeImageText: largeImageText,
            smallImageKey: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Icon_Bird_512x512.png',
            smallImageText: 'Aura IDE 0.2',
            buttons: buttons
        });
    }

rpc.on('ready', () => {
    console.log('Discord RPC connected!');
    updateRPC(fileName);
});
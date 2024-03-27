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


ipcMain.on('showSaveDialog', async (event) => {
    try {
        const { filePath } = await dialog.showSaveDialog({
            defaultPath: 'Untitled.txt',
            filters: [{ name: 'Text Files', extensions: ['txt'] }]
        });
        return filePath;
    } catch (error) {
        console.error('Error showing save dialog:', error);
        return null;
    }
});

ipcMain.on('saveFile', async (event, filePath, fileContent) => {
    try {
        await fs.promises.writeFile(filePath, fileContent);
        return true;
    } catch (error) {
        console.error('Error saving file:', error);
        return false;
    }
});



    let fileName = "💤・Being Idle";

    ipcMain.on('file-opened', (event, data) => {
        fileName = data.fileName;
        updateRPC(fileName);
    });
  
    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
  
    function updateRPC(fileName) {
        let detailsText = fileName === "💤・Being Idle" ? fileName : '📄・Editing: ' + fileName;
        let fileExtension = fileName === "💤・Being Idle" ? '' : getFileExtension(fileName);
        let largeImageText = fileExtension ? fileExtension.toUpperCase() : 'None';
        let largeImageKey = fileExtension ? fileExtension : 'unknown';
        if(fileName === "💤・Being Idle") {
            largeImageKey = "idle"
        }

        let buttons = [
            { label: "Download", url: "https://auraide.net/download/latest" },
            { label: "GitHub Repository", url: "https://github.com/Aura-IDE/Aura" }
        ];

        rpc.setActivity({
            details: detailsText, 
            state: '📍・Workspace: Aura',
            startTimestamp: new Date().getTime(),
            largeImageKey: largeImageKey,
            largeImageText: largeImageText,
            smallImageKey: 'aura',
            smallImageText: 'Aura IDE 0.9',
            buttons: buttons
        });
    }

rpc.on('ready', () => {
    console.log('Discord RPC connected!');
    updateRPC(fileName);
});
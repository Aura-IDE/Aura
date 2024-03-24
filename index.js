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

ipcMain.on('file-opened', (event, fileName) => {
    openedFileName = fileName;
    console.log('Název otevřeného souboru:', openedFileName);
    updateRPC();
});

function updateRPC() {
    rpc.setActivity({
        details: openedFileName,
        state: 'State',
        startTimestamp: new Date().getTime(),
        largeImageKey: path.join(__dirname, 'src', 'assets', 'logo.png'),
        largeImageText: 'Large image text',
        smallImageKey: 'aura',
        smallImageText: 'Small image text',
    });
}

rpc.on('ready', () => {
    console.log('Discord RPC connected!');
    updateRPC();
});
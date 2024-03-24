const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const { Client } = require('discord-rpc');

let openedFileName;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: path.join(__dirname, 'src', 'assets', 'logo.png'),
    webPreferences: {
      nodeIntegration: true
    }

  });
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('./src/index.html');
  updateRPC();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Zpracování otevření dialogového okna pro výběr souboru
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

  ipcMain.on('file-opened', (event, fileName) => {
    // Uložení názvu otevřeného souboru do globální proměnné
    openedFileName = fileName;
    console.log('Název otevřeného souboru:', openedFileName);
  });
  

  const clientId = '1221435094921777222'; // Nahraďte YOUR_CLIENT_ID skutečným ID vaší aplikace v Discord Developer Portal

const rpc = new Client({ transport: 'ipc' });

rpc.login({ clientId }).catch(console.error);

function updateRPC() {
  rpc.setActivity({
    details: openedFileName,
    state: 'State',
    startTimestamp: new Date().getTime(),
    largeImageKey: './src/assets/logo.png',
    largeImageText: 'Large image text',
    smallImageKey: 'aura',
    smallImageText: 'Small image text',
  });
}

rpc.on('ready', () => {
  console.log('Discord RPC connected!');
  updateRPC();
});
});

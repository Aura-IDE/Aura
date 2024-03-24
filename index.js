const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    icon: './src/assets/logo.png',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  ipcMain.on('minimize', event => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.minimize();
	})

	ipcMain.on('maximize', event => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.maximize();
	})

	ipcMain.on('close', event => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.close();
	})

  mainWindow.loadFile('./src/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

app.on('ready', createWindow);
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
  openedFileName = fileName;
  console.log('Název otevřeného souboru:', openedFileName);
});

const clientId = '1221435094921777222';
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
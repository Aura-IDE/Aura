const { ipcRenderer } = require('electron');
// Funkce pro otevření souboru
function openFile() {
    ipcRenderer.send('open-file-dialog');
}

// Přijímání cesty k vybranému souboru a načtení do editoru
ipcRenderer.on('selected-file', (event, path) => {
    const fs = require('fs');
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        editor.setValue(data);
    });
});
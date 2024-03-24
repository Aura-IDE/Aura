const { ipcRenderer } = require('electron');

function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name; // Získání názvu souboru
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
        // Poslání názvu souboru do hlavního procesu pomocí IPC
        ipcRenderer.send('file-opened', fileName);
    }
    reader.readAsText(file);
    console.log('Název otevřeného souboru:', fileName);
}
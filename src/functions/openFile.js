const { ipcRenderer } = require('electron');

function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = editor.target.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
        ipcRenderer.send('file-opened', fileName);
    }
    reader.readAsText(file);
    console.log('Název otevřeného souboru:', fileName);
}
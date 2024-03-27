const { ipcRenderer } = require('electron');

function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
        ipcRenderer.send('file-opened', fileName);
    }
    reader.readAsText(file);
    console.log('Name of opend file:', fileName);
}
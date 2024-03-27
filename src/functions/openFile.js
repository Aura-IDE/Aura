function openFile(event) {
    window.electronAPI.sendToMain('open-file-dialog');
    console.log("file upload success")
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
        window.electronAPI.sendToMain('file-opened', { fileName });
        console.log('Nahrán soubor:', fileName);
    }
    reader.readAsText(file);
}
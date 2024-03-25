function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        window.electronAPI.sendToMain('file-opened', fileName, fileContent);
    }
    reader.readAsText(file);
}
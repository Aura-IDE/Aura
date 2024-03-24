function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = reader.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
        const fileOpenedEvent = new CustomEvent('file-opened', { detail: fileName });
        document.dispatchEvent(fileOpenedEvent);
    }
    reader.readAsText(file);
    console.log('Název otevřeného souboru:', fileName);
}
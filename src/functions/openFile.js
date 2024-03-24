function openFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const fileContent = e.target.result;
        const editor = ace.edit("editor");
        editor.setValue(fileContent);
    }
    reader.readAsText(file);
}
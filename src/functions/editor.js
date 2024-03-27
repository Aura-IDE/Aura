var editor = ace.edit("editor");
editor.setShowPrintMargin(false);
editor.setTheme("ace/theme/chaos");
editor.session.mergeUndoDeltas = true; 
editor.session.insert({row: 0, column:0}, Date()+"");
editor.getSession().setMode("ace/mode/html");
//editor.renderer.setShowGutter();
editor.getSession().setUseWorker(false);
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
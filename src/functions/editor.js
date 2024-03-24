var editor = ace.edit("editor");
        editor.setTheme("ace/theme/chaos");
        editor.getSession().setMode("ace/mode/html");
        editor.renderer.setShowGutter();
        editor.getSession().setUseWorker(false);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

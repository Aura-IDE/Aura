var editor = ace.edit("editor");
        editor.setTheme("ace/theme/twilight");

        editor.getSession().setMode("ace/mode/html");
        editor.getSession().setUseWorker(false);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
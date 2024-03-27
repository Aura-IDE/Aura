const fs = require('fs');

function readAurScript(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (err) {
        console.error('Nepodařilo se načíst soubor:', err);
        return null;
    }
}

function log(text) {
    console.log(text);
}

const aura = 'index.aur';
const config = readAurScript(aura);

if (config !== null) {
    const theme = config.theme;
    const tabSize = config.tabSize;
    const rpc = config.discordRpc;
    log("Theme, " + theme + "\nTab Spacing Size: " + tabSize + "\nDiscord RPC: " + rpc);
}

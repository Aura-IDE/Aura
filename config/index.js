const fs = require('fs');

// Funkce pro čtení obsahu souboru
function readAurScript(filePath) {
    try {
        // Načtení obsahu souboru
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content); // Parsování obsahu jako JSON
    } catch (err) {
        console.error('Nepodařilo se načíst soubor:', err);
        return null;
    }
}

// Funkce pro logování textu
function log(text) {
    console.log(text);
}

// Cesta k vašemu index.aur souboru
const aura = 'index.aur';

// Načtení obsahu souboru index.aur jako JSON
const config = readAurScript(aura);

if (config !== null) {
    // Použití hodnot z načteného JSONu
    const theme = config.theme;
    const tabSize = config.tabSize;
    const rpc = config.discordRpc;

    // Použití proměnných
    log("Theme, " + theme + "\nTab Spacing Size: " + tabSize + "\nDiscord RPC: " + rpc);
}

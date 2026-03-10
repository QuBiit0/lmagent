const fs = require('fs');
const os = require('os');
const path = require('path');

// HOME_PATHS: Rutas globales de configuración de cada agente en el HOME del usuario
// Se usan SOLO para DETECCIÓN (saber si el agente está instalado en el sistema)
const HOME_PATHS = {
    'cursor': ['.cursor'],
    'windsurf': ['.windsurf', '.codeium/windsurf'],
    'vscode': ['.github', '.vscode'],
    'gemini': ['.gemini'],
    'codex': ['.codex'],
    'continue': ['.continue'],
    'goose': ['.config/goose'],
    'junie': ['.junie'],
    'claude': ['.claude'],
    'cline': ['.cline'],
    'roo': ['.roo'],
    'trae': ['.trae'],
    'zed': ['.config/zed'],
    'augment': ['.augment'],
    'opencode': ['.opencode'],
    'openhands': ['.openhands'],
    'antigravity': ['.gemini/antigravity', '.agent'],
    'codebuddy': ['.codebuddy'],
    'command-code': ['.commandcode'],
    'crush': ['.crush'],
    'droid': ['.factory'],
    'iflow': ['.iflow'],
    'kilo': ['.kilocode'],
    'kiro': ['.kiro'],
    'kode': ['.kode'],
    'mcpjam': ['.mcpjam'],
    'mistral': ['.vibe'],
    'mux': ['.mux'],
    'pi': ['.pi'],
    'qoder': ['.qoder'],
    'qwen': ['.qwen'],
    'trae-cn': ['.trae-cn'],
    'zencoder': ['.zencoder'],
    'neovate': ['.neovate'],
    'pochi': ['.pochi'],
    'adal': ['.adal']
};

/**
 * Helper: Detectar agentes instalados GLOBALMENTE en el HOME del usuario
 * Retorna un Set con los values de los agentes detectados
 */
function detectGlobalAgents() {
    const homeDir = os.homedir();
    const globallyDetected = new Set();

    for (const [agentValue, paths] of Object.entries(HOME_PATHS)) {
        for (const p of paths) {
            const fullPath = path.join(homeDir, p);
            if (fs.existsSync(fullPath)) {
                globallyDetected.add(agentValue);
                break;
            }
        }
    }
    return globallyDetected;
}

module.exports = {
    HOME_PATHS,
    detectGlobalAgents
};

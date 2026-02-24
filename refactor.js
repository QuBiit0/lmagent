const fs = require('fs');
let code = fs.readFileSync('install.js', 'utf8');

// 1. Uninstall detection map
let oldUninstall = `        // Detectar qué agentes están instalados en el proyecto
        const installedIdes = IDE_CONFIGS.filter(ide => {
            if (ide.value === 'custom' || ide.value === 'generic') return false;
            const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
            const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
            const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
            return markerInProject || rulesDirInProject || skillsDirInProject;
        });

        if (installedIdes.length === 0) {
            console.log(chalk.yellow('⚠️  No se detectó ningún agente instalado en este proyecto.'));
            return;
        }`;

let newUninstall = `        // Detectar qué agentes están instalados o dejaron rastro en el proyecto
        // Al desinstalar, también incluimos 'generic' para volar .agents/
        const installedIdes = IDE_CONFIGS.filter(ide => {
            if (ide.value === 'custom') return false;
            const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
            const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
            const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
            return markerInProject || rulesDirInProject || skillsDirInProject || ide.value === 'generic';
        });

        const rootFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules', '.windsurfrules', '.continuerules', '.goosehints', 'openclaw.json'];
        const existingRootFiles = rootFiles.filter(f => fs.existsSync(path.join(projectRoot, f)));

        if (installedIdes.length === 0 && existingRootFiles.length === 0) {
            console.log(chalk.yellow('⚠️  No se detectó ningún rastro del framework en este proyecto.'));
            return;
        }`;

// We normalize newlines for exact match
function fixString(s) {
    return s.replace(/\r\n/g, '\n');
}
code = fixString(code);
if (code.indexOf(fixString(oldUninstall)) !== -1) {
    code = code.replace(fixString(oldUninstall), fixString(newUninstall));
    console.log("Replaced Uninstall block 1");
} else {
    console.log("Could not find Uninstall block 1");
}

let oldGeneric = `            const agentSpecificDirs = [ide.skillsDir, ide.workflowsDir];
            if (ide.rulesDir && !['rules', '.github/instructions'].includes(ide.rulesDir)) {
                agentSpecificDirs.push(ide.rulesDir);
            }

            // Determinar el directorio raíz del agente (ej: .cursor, .windsurf, .claude)
            const agentRootDir = ide.markerFile && !ide.markerFile.includes('.') ? null
                : ide.rulesDir ? ide.rulesDir.split('/')[0] : null;`;

let newGeneric = `            const agentSpecificDirs = [ide.skillsDir, ide.workflowsDir];
            if (ide.rulesDir && !['rules', '.github/instructions'].includes(ide.rulesDir)) {
                agentSpecificDirs.push(ide.rulesDir);
            }
            if (ide.value === 'generic') {
                agentSpecificDirs.push('.agents');
            }

            // Determinar el directorio raíz del agente (ej: .cursor, .windsurf, .claude)
            const agentRootDir = ide.markerFile && !ide.markerFile.includes('.') ? null
                : ide.rulesDir ? ide.rulesDir.split('/')[0] : null;`;

if (code.indexOf(fixString(oldGeneric)) !== -1) {
    code = code.replace(fixString(oldGeneric), fixString(newGeneric));
    console.log("Replaced Generic block 2");
}

let oldDetection = `        // 3. Auto-Detect IDEs
        // Mapa de rutas de instalación global por agente (donde el IDE instala sus archivos en ~/)
        // HOME_PATHS: rutas de instalación global de cada agente en el sistema del usuario
        // Cubre los 37 agentes soportados. Se verifica si alguna de las rutas existe en ~/
        const HOME_PATHS = {
            // IDEs principales
            'cursor': ['.cursor'],
            'windsurf': ['.windsurf'],
            'cline': ['.vscode/extensions', '.cline'],
            'roo': ['.vscode/extensions', '.roo'],
            'vscode': ['.vscode'],
            'trae': ['.trae'],
            'trae-cn': ['.trae-cn', '.trae'],
            'claude': ['.claude'],
            'zed': ['.config/zed', '.zed'],
            // Agentes CLI & autónomos
            'antigravity': ['.gemini/antigravity'],
            'gemini': ['.gemini'],
            'augment': ['.augment'],
            'continue': ['.continue'],
            'codex': ['.codex'],
            'goose': ['.config/goose', '.goose'],
            'junie': ['.junie'],
            'kilo': ['.kilocode'],
            'kiro': ['.kiro'],
            'opencode': ['.opencode'],
            'openhands': ['.openhands'],
            'amp': ['.agents'],
            'zencoder': ['.zencoder'],
            'codebuddy': ['.codebuddy'],
            'crush': ['.crush'],
            'droid': ['.factory'],
            'mux': ['.mux'],
            'qwen': ['.qwen'],
            // Agentes menores / nicho
            'openclaw': ['.config/openclaw', '.openclaw'],
            'command-code': ['.commandcode'],
            'iflow': ['.iflow'],
            'kode': ['.kode'],
            'mcpjam': ['.mcpjam'],
            'mistral': ['.vibe', '.mistral'],
            'pi': ['.pi'],
            'qoder': ['.qoder'],
            'neovate': ['.neovate'],
            'pochi': ['.pochi'],
            'adal': ['.adal'],
        };

        const detectedIdes = IDE_CONFIGS.filter(ide => {
            if (ide.value === 'custom' || ide.value === 'generic') return false;

            // Check Project Root: usar markerFile primero (más preciso), luego rulesDir como fallback
            const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
            const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
            const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
            const inProject = markerInProject || rulesDirInProject || skillsDirInProject;

            // Check User Home: usar mapa explícito de rutas de instalación global
            const homePaths = HOME_PATHS[ide.value] || [];
            const inHome = homePaths.some(p => fs.existsSync(path.join(userHome, p)));

            return inProject || inHome;
        });`;

let newDetection = `        // 3. Auto-Detect IDEs (Strictly Local)
        // Ya no iteraremos sobre rutas HOME_PATHS del sistema para no alterar el nivel global;
        // La detección del LMAgent Framework V3 debe ser obligatoriamente por proyecto para evitar side-effects
        const detectedIdes = IDE_CONFIGS.filter(ide => {
            if (ide.value === 'custom' || ide.value === 'generic') return false;

            // Check Project Root: usar markerFile primero (más preciso), luego rulesDir como fallback
            const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
            const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
            const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
            const inProject = markerInProject || rulesDirInProject || skillsDirInProject;

            return inProject;
        });`;

if (code.indexOf(fixString(oldDetection)) !== -1) {
    code = code.replace(fixString(oldDetection), fixString(newDetection));
    console.log("Replaced Detection block 3");
} else {
    console.log("Could not find Detection block 3");
}

fs.writeFileSync('install.js', code);
console.log("Done");

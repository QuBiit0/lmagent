#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const figlet = require('figlet');
const gradient = require('gradient-string');

const program = new Command();
const PKG_VERSION = require('./package.json').version;

// Configuración: Directorios fuente del paquete
const PACKAGE_SKILLS_DIR = path.join(__dirname, '.agents', 'skills');
const PACKAGE_RULES_DIR = path.join(__dirname, '.agents', 'rules');
const PACKAGE_WORKFLOWS_DIR = path.join(__dirname, '.agents', 'workflows');
const PACKAGE_CONFIG_DIR = path.join(__dirname, '.agents', 'config');
const PACKAGE_TEMPLATES_DIR = path.join(__dirname, '.agents', 'templates');
const PACKAGE_DOCS_DIR = path.join(__dirname, '.agents', 'docs');
const PACKAGE_MEMORY_DIR = path.join(__dirname, '.agents', 'memory');

// Archivos de proyecto que init copia a la raíz
// Usan {{VERSION}} como placeholder; se reemplaza dinámicamente al instalar
const INIT_FILES = [
    { src: 'AGENTS.md', desc: 'Catálogo de capacidades LMAgent (Entry Point Universal)', versionTemplate: false },
    // CLAUDE.md y GEMINI.md NO van aquí — se despliegan solo cuando su agente está detectado/seleccionado,
    // para evitar conflictos de contexto duplicado en agentes como Cursor y Zed que leen múltiples .md del raíz.
];

// Directorios core a verificar en .agents/ (usado por doctor)
const CORE_DIRS = [
    { src: 'skills', desc: 'Skills especializados' },
    { src: 'rules', desc: 'Reglas de comportamiento' },
    { src: 'workflows', desc: 'SOPs y Procedimientos' },
    { src: 'config', desc: 'Configuración del framework' },
    { src: 'docs', desc: 'Documentación extendida' },
    { src: 'memory', desc: 'Contexto persistente' },
];

// HOME_PATHS: Rutas globales de configuración de cada agente en el HOME del usuario
// Se usan SOLO para DETECCIÓN (saber si el agente está instalado en el sistema)
// La instalación del framework siempre va al directorio del proyecto
const HOME_PATHS = {
    'cursor': ['.cursor'],
    'windsurf': ['.windsurf', '.codeium/windsurf'],
    'claude': ['.claude'],
    'cline': ['.cline'],
    'roo': ['.roo'],
    'vscode': ['.vscode'],
    'trae': ['.trae'],
    'zed': ['.config/zed'],
    'augment': ['.augment'],
    'gemini': ['.gemini'],
    'codex': ['.codex'],
    'continue': ['.continue'],
    'goose': ['.config/goose'],
    'junie': ['.junie'],
    'opencode': ['.opencode'],
    'openhands': ['.openhands'],
    'antigravity': ['.agent'],
};

// Helper: Detectar agentes instalados GLOBALMENTE en el HOME del usuario
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


// IDE_CONFIGS: Lista ÚNICA y DEDUPLICADA de todos los agentes soportados
const IDE_CONFIGS = [
    // --- IDEs Principales (Auto-Detectados) ---
    // Cursor: usa .cursor/rules/*.mdc (formato MDC con frontmatter)
    { name: 'Cursor', value: 'cursor', rulesDir: '.cursor/rules', skillsDir: '.cursor/rules/skills', workflowsDir: '.cursor/workflows', configFile: null, bridgeFile: '00-lmagent.mdc', markerFile: '.cursorrules', forceCopy: true },
    // Windsurf Wave 8+: usa .windsurf/rules/*.md
    { name: 'Windsurf', value: 'windsurf', rulesDir: '.windsurf/rules', skillsDir: '.windsurf/skills', workflowsDir: '.windsurf/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.windsurf', forceCopy: true },
    // Cline: usa .clinerules/ (directorio con .md files)
    { name: 'Cline', value: 'cline', rulesDir: '.clinerules', skillsDir: '.cline/skills', workflowsDir: '.cline/workflows', configFile: null, bridgeFile: '00-lmagent.md', markerFile: '.clinerules', forceCopy: true },
    // Roo Code: usa .roo/rules/
    { name: 'Roo Code', value: 'roo', rulesDir: '.roo/rules', skillsDir: '.roo/skills', workflowsDir: '.roo/workflows', configFile: null, bridgeFile: '00-lmagent.md', markerFile: '.roo', forceCopy: true },
    // GitHub Copilot: usa .github/copilot-instructions.md + .github/instructions/*.md
    { name: 'VSCode Copilot', value: 'vscode', rulesDir: '.github/instructions', skillsDir: '.github/skills', workflowsDir: '.github/copilot-workflows', configFile: '.github/copilot-instructions.md', bridgeFile: null, markerFile: '.vscode' },
    { name: 'Trae', value: 'trae', rulesDir: '.trae/rules', skillsDir: '.trae/skills', workflowsDir: '.trae/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.trae', forceCopy: true },
    // Claude Code: usa .claude/
    { name: 'Claude Code', value: 'claude', rulesDir: '.claude/rules', skillsDir: '.claude/skills', workflowsDir: '.claude/workflows', configFile: 'CLAUDE.md', bridgeFile: null, markerFile: '.claude', forceCopy: true },
    { name: 'Zed', value: 'zed', rulesDir: '.rules', skillsDir: '.rules/skills', workflowsDir: '.rules/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.zed' },

    // --- Agentes CLI & Autónomos ---
    { name: 'Amp / Kimi / Replit', value: 'amp', rulesDir: '.agents/rules', skillsDir: '.agents/skills', workflowsDir: '.agents/workflows', configFile: null, bridgeFile: null, markerFile: '.agents' },
    // Antigravity (Google Deepmind)
    { name: 'Antigravity', value: 'antigravity', rulesDir: '.agent/rules', skillsDir: '.agent/skills', workflowsDir: '.agent/workflows', configFile: 'GEMINI.md', bridgeFile: null, markerFile: '.agent' },
    { name: 'Augment', value: 'augment', rulesDir: '.augment/rules', skillsDir: '.augment/skills', workflowsDir: '.augment/workflows', configFile: null, bridgeFile: null, markerFile: '.augment' },
    // Gemini CLI
    { name: 'Gemini CLI', value: 'gemini', rulesDir: '.gemini/rules', skillsDir: '.gemini/skills', workflowsDir: '.gemini/workflows', configFile: 'GEMINI.md', bridgeFile: null, markerFile: '.gemini' },
    { name: 'OpenClaw / Envoid', value: 'openclaw', rulesDir: 'rules', skillsDir: 'skills', workflowsDir: 'workflows', configFile: 'openclaw.json', configTemplate: 'openclaw.json', bridgeFile: null, markerFile: 'openclaw.json' },
    { name: 'CodeBuddy', value: 'codebuddy', rulesDir: '.codebuddy/rules', skillsDir: '.codebuddy/skills', workflowsDir: '.codebuddy/workflows', configFile: null, bridgeFile: null, markerFile: '.codebuddy', forceCopy: true },
    // Codex CLI (OpenAI)
    { name: 'Codex', value: 'codex', rulesDir: '.codex', skillsDir: '.codex/skills', workflowsDir: '.codex/workflows', configFile: 'AGENTS.md', bridgeFile: null, markerFile: '.codex' },
    { name: 'Command Code', value: 'command-code', rulesDir: '.commandcode/rules', skillsDir: '.commandcode/skills', workflowsDir: '.commandcode/workflows', configFile: null, bridgeFile: null, markerFile: '.commandcode' },
    // Continue
    { name: 'Continue', value: 'continue', rulesDir: '.continue/rules', skillsDir: '.continue/skills', workflowsDir: '.continue/workflows', configFile: '.continue/continuerules', configTemplate: 'continuerules.md', bridgeFile: '00-lmagent.md', markerFile: '.continue' },
    { name: 'Crush', value: 'crush', rulesDir: '.crush/rules', skillsDir: '.crush/skills', workflowsDir: '.crush/workflows', configFile: null, bridgeFile: null, markerFile: '.crush' },
    { name: 'Droid', value: 'droid', rulesDir: '.factory/rules', skillsDir: '.factory/skills', workflowsDir: '.factory/workflows', configFile: null, bridgeFile: null, markerFile: '.factory' },
    // Goose (Block)
    // Goose: .goosehints va en la RAÍZ del proyecto (no en .goose/), según docs oficiales
    { name: 'Goose', value: 'goose', rulesDir: '.goose', skillsDir: '.goose/skills', workflowsDir: '.goose/workflows', configFile: '.goosehints', configTemplate: 'goosehints.md', bridgeFile: null, markerFile: '.goose' },
    // Junie (JetBrains)
    { name: 'Junie', value: 'junie', rulesDir: '.junie', skillsDir: '.junie/skills', workflowsDir: '.junie/workflows', configFile: '.junie/guidelines.md', configTemplate: 'junie-guidelines.md', bridgeFile: null, markerFile: '.junie' },
    { name: 'iFlow CLI', value: 'iflow', rulesDir: '.iflow/rules', skillsDir: '.iflow/skills', workflowsDir: '.iflow/workflows', configFile: null, bridgeFile: null, markerFile: '.iflow' },
    { name: 'Kilo Code', value: 'kilo', rulesDir: '.kilocode/rules', skillsDir: '.kilocode/skills', workflowsDir: '.kilocode/workflows', configFile: null, bridgeFile: null, markerFile: '.kilocode' },
    { name: 'Kiro CLI', value: 'kiro', rulesDir: '.kiro/rules', skillsDir: '.kiro/skills', workflowsDir: '.kiro/workflows', configFile: null, bridgeFile: null, markerFile: '.kiro' },
    { name: 'Kode', value: 'kode', rulesDir: '.kode/rules', skillsDir: '.kode/skills', workflowsDir: '.kode/workflows', configFile: null, bridgeFile: null, markerFile: '.kode' },
    { name: 'MCPJam', value: 'mcpjam', rulesDir: '.mcpjam/rules', skillsDir: '.mcpjam/skills', workflowsDir: '.mcpjam/workflows', configFile: null, bridgeFile: null, markerFile: '.mcpjam' },
    { name: 'Mistral Vibe', value: 'mistral', rulesDir: '.vibe/rules', skillsDir: '.vibe/skills', workflowsDir: '.vibe/workflows', configFile: null, bridgeFile: null, markerFile: '.vibe' },
    { name: 'Mux', value: 'mux', rulesDir: '.mux/rules', skillsDir: '.mux/skills', workflowsDir: '.mux/workflows', configFile: null, bridgeFile: null, markerFile: '.mux' },
    { name: 'OpenCode', value: 'opencode', rulesDir: '.opencode/rules', skillsDir: '.opencode/skills', workflowsDir: '.opencode/workflows', configFile: null, bridgeFile: null, markerFile: '.opencode' },
    // OpenHands: usa .openhands/microagents/repo.md
    { name: 'OpenHands', value: 'openhands', rulesDir: '.openhands/microagents', skillsDir: '.openhands/skills', workflowsDir: '.openhands/workflows', configFile: '.openhands/microagents/repo.md', configTemplate: 'openhands-repo.md', bridgeFile: null, markerFile: '.openhands' },
    { name: 'Pi', value: 'pi', rulesDir: '.pi/rules', skillsDir: '.pi/skills', workflowsDir: '.pi/workflows', configFile: null, bridgeFile: null, markerFile: '.pi' },
    { name: 'Qoder', value: 'qoder', rulesDir: '.qoder/rules', skillsDir: '.qoder/skills', workflowsDir: '.qoder/workflows', configFile: null, bridgeFile: null, markerFile: '.qoder' },
    { name: 'Qwen Code', value: 'qwen', rulesDir: '.qwen/rules', skillsDir: '.qwen/skills', workflowsDir: '.qwen/workflows', configFile: null, bridgeFile: null, markerFile: '.qwen' },
    { name: 'Trae CN', value: 'trae-cn', rulesDir: '.trae-cn/rules', skillsDir: '.trae-cn/skills', workflowsDir: '.trae-cn/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.trae-cn' },
    { name: 'Zencoder', value: 'zencoder', rulesDir: '.zencoder/rules', skillsDir: '.zencoder/skills', workflowsDir: '.zencoder/workflows', configFile: null, bridgeFile: null, markerFile: '.zencoder' },
    { name: 'Neovate', value: 'neovate', rulesDir: '.neovate/rules', skillsDir: '.neovate/skills', workflowsDir: '.neovate/workflows', configFile: null, bridgeFile: null, markerFile: '.neovate' },
    { name: 'Pochi', value: 'pochi', rulesDir: '.pochi/rules', skillsDir: '.pochi/skills', workflowsDir: '.pochi/workflows', configFile: null, bridgeFile: null, markerFile: '.pochi' },
    { name: 'AdaL', value: 'adal', rulesDir: '.adal/rules', skillsDir: '.adal/skills', workflowsDir: '.adal/workflows', configFile: null, bridgeFile: null, markerFile: '.adal' },

    // --- Opciones Especiales ---
    { name: 'Generic/Other', value: 'generic', rulesDir: '.agents/rules', skillsDir: '.agents/skills', workflowsDir: '.agents/workflows', configFile: null, bridgeFile: null, markerFile: '.agents' },
    { name: 'Custom Path (Manual)', value: 'custom', rulesDir: '', skillsDir: '', workflowsDir: '', configFile: null, bridgeFile: null, markerFile: '' },
];

program
    .name('lmagent')
    .description('CLI para instalar skills y reglas de LMAgent')
    .version(PKG_VERSION);

program.command('install')
    .description('Instalar skills, rules y workflows en el IDE del proyecto')
    .option('-f, --force', 'Forzar instalación')
    .option('-y, --yes', 'Instalar todo sin preguntar')
    .action((options) => {
        runInstall(options);
    });

program.command('update')
    .description('Actualizar skills y reglas en el proyecto (alias de install)')
    .option('-f, --force', 'Forzar actualización')
    .option('-y, --yes', 'Instalar todo sin preguntar')
    .action((options) => {
        console.log(chalk.blue('ℹ Iniciando actualización...'));
        runInstall(options);
    });

program.command('init')
    .description('Inicializar proyecto con LMAgent (alias de install)')
    .option('-f, --force', 'Sobrescribir archivos existentes')
    .option('-y, --yes', 'No preguntar, instalar todo')
    .action((options) => {
        console.log(chalk.blue('ℹ `init` es ahora alias de `install`. Ejecutando instalación unificada...'));
        runInstall(options);
    });

program.command('doctor')
    .description('Verificar que el proyecto está correctamente configurado')
    .action(() => {
        runDoctor();
    });

program.command('validate')
    .description('Validar integridad de todos los skills (frontmatter, estructura)')
    .argument('[skill]', 'Nombre parcial del skill a validar (opcional)')
    .action((skill) => {
        const { execSync } = require('child_process');
        const scriptPath = path.join(__dirname, 'scripts', 'validate_skills.js');
        const args = skill ? ` ${skill}` : '';
        try {
            execSync(`node "${scriptPath}"${args}`, { stdio: 'inherit' });
        } catch (e) {
            process.exit(e.status || 1);
        }
    });

program.command('create-skill')
    .description('Crear un nuevo skill interactivamente')
    .action(() => {
        const { execSync } = require('child_process');
        const scriptPath = path.join(__dirname, 'scripts', 'create_skill.js');
        try {
            execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
        } catch (e) {
            process.exit(e.status || 1);
        }
    });

program.command('tokens')
    .description('Analizar consumo de tokens del framework instalado en el proyecto')
    .option('--json', 'Salida en formato JSON')
    .option('--report', 'Generar reporte en .agents/token-report.md')
    .action((options) => {
        const { execSync } = require('child_process');
        const scriptPath = path.join(__dirname, 'scripts', 'token-analyzer.js');
        const args = [options.json ? '--json' : '', options.report ? '--report' : ''].filter(Boolean).join(' ');
        try {
            execSync(`node "${scriptPath}" ${args}`, { stdio: 'inherit' });
        } catch (e) {
            process.exit(e.status || 1);
        }
    });

program.command('skills')
    .description('Gestionar skills externos desde GitHub (compatible con el estándar skills.sh)')
    .argument('<action>', 'Acción: add')
    .argument('<source>', 'Repositorio GitHub: owner/repo o URL completa')
    .option('--skill <name>', 'Nombre específico del skill a instalar (opcional)')
    .action(async (action, source, opts) => {
        if (action !== 'add') {
            console.error(chalk.red(`❌ Acción desconocida: ${action}. Usa: lmagent skills add <owner/repo>`));
            process.exit(1);
        }
        const { execSync } = require('child_process');
        const repoSlug = source.replace('https://github.com/', '').replace(/\.git$/, '');
        const [owner, repo] = repoSlug.split('/');
        if (!owner || !repo) {
            console.error(chalk.red('❌ Formato inválido. Usa: lmagent skills add owner/repo'));
            process.exit(1);
        }
        const tmpDir = path.join(os.tmpdir(), `lmagent-skill-${Date.now()}`);
        const targetSkillsDir = path.join(process.cwd(), '.agents', 'skills');
        console.log(chalk.cyan(`📦 Descargando skill desde github.com/${owner}/${repo}...`));
        try {
            execSync(`git clone --depth 1 https://github.com/${owner}/${repo} "${tmpDir}"`, { stdio: 'pipe' });
            const skillsPath = fs.existsSync(path.join(tmpDir, 'skills')) ? path.join(tmpDir, 'skills') : tmpDir;
            const items = fs.readdirSync(skillsPath).filter(i => {
                const p = path.join(skillsPath, i);
                return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
            });
            if (items.length === 0) {
                console.log(chalk.yellow('⚠️  No se encontraron skills con SKILL.md en el repositorio.'));
                fs.rmSync(tmpDir, { recursive: true, force: true });
                return;
            }
            const toInstall = opts.skill ? items.filter(i => i.includes(opts.skill)) : items;
            if (!fs.existsSync(targetSkillsDir)) fs.mkdirSync(targetSkillsDir, { recursive: true });
            for (const skill of toInstall) {
                const src = path.join(skillsPath, skill);
                const dest = path.join(targetSkillsDir, skill);
                copyRecursiveSync(src, dest, true);
                console.log(`  ${chalk.green('✔')} ${skill}/`);
            }
            fs.rmSync(tmpDir, { recursive: true, force: true });
            console.log(chalk.green(`✨ ${toInstall.length} skill(s) instalado(s) en .agents/skills/`));
            console.log(chalk.dim('   Ejecuta `lmagent install` para sincronizarlos a tu agente.'));
        } catch (e) {
            console.error(chalk.red(`❌ Error al instalar skill: ${e.message}`));
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) { }
            process.exit(1);
        }
    });

program.command('uninstall')
    .description('Eliminar todos los archivos instalados por LMAgent del proyecto')
    .option('-f, --force', 'No pedir confirmación, eliminar directamente')
    .option('--all', 'También eliminar entry points raíz (CLAUDE.md, GEMINI.md, AGENTS.md)')
    .action(async (options) => {
        console.clear();
        const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
        console.log(gradient.pastel.multiline(branding));
        console.log(gradient.cristal('                              Uninstall - Limpieza\n'));

        const projectRoot = process.cwd();

        // Detectar qué agentes están instalados o dejaron rastro en el proyecto
        // Al desinstalar, también incluimos 'generic' para volar .agents/
        const installedIdes = IDE_CONFIGS.filter(ide => {
            if (ide.value === 'custom') return false;
            const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
            const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
            const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
            return markerInProject || rulesDirInProject || skillsDirInProject || ide.value === 'generic';
        });

        const rootEntryFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md', '.cursorrules', '.windsurfrules', '.windsurfrules.md', '.continuerules', '.goosehints', 'openclaw.json'];
        const existingRootFiles = rootEntryFiles.filter(f => fs.existsSync(path.join(projectRoot, f)));

        if (installedIdes.length === 0 && existingRootFiles.length === 0) {
            console.log(chalk.yellow('⚠️  No se detectó ningún rastro del framework en este proyecto.'));
            return;
        }

        console.log(chalk.bold('🔍 Agentes detectados en este proyecto:\n'));
        for (const ide of installedIdes) {
            const parts = [];
            if (ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir))) parts.push(chalk.gray(ide.rulesDir));
            if (ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir))) parts.push(chalk.gray(ide.skillsDir));
            if (ide.configFile && fs.existsSync(path.join(projectRoot, ide.configFile))) parts.push(chalk.gray(ide.configFile));
            console.log(`  ${chalk.cyan('•')} ${chalk.bold(ide.name)}: ${parts.join(', ')}`);
        }

        // Entry points raíz (ya calculados arriba como rootEntryFiles)

        if (options.all && existingRootFiles.length > 0) {
            console.log(chalk.bold('\n📄 Entry points raíz que también se eliminarán:'));
            for (const f of existingRootFiles) {
                console.log(`  ${chalk.red('•')} ${f}`);
            }
        }

        console.log('');

        if (!options.force) {
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: chalk.red(`⚠️  ¿Eliminar todos los archivos de LMAgent de este proyecto? Esta acción no se puede deshacer.`),
                default: false
            }]);
            if (!confirm) {
                console.log(chalk.gray('Cancelado.'));
                return;
            }
        }

        console.log('');
        let removed = 0;
        let errors = 0;

        // Eliminar directorios y archivos de cada agente
        for (const ide of installedIdes) {
            const toRemove = [];

            // Directorios del agente (skills, rules, workflows) — solo si son específicos del agente
            // No eliminar directorios genéricos como .github, rules/, skills/ que pueden tener otros usos
            const agentSpecificDirs = [ide.skillsDir, ide.workflowsDir];
            if (ide.rulesDir && !['rules', '.github/instructions'].includes(ide.rulesDir)) {
                agentSpecificDirs.push(ide.rulesDir);
            }
            if (ide.value === 'generic') {
                agentSpecificDirs.push('.agents');
            }

            // Determinar el directorio raíz del agente (ej: .cursor, .windsurf, .claude)
            const agentRootDir = ide.markerFile && !ide.markerFile.includes('.') ? null
                : ide.rulesDir ? ide.rulesDir.split('/')[0] : null;
            if (agentRootDir && agentRootDir.startsWith('.') && fs.existsSync(path.join(projectRoot, agentRootDir))) {
                // Eliminar el directorio raíz completo del agente
                toRemove.push({ path: path.join(projectRoot, agentRootDir), type: 'dir', label: agentRootDir + '/' });
            } else {
                // Eliminar subdirectorios individualmente
                for (const dir of agentSpecificDirs) {
                    if (dir && fs.existsSync(path.join(projectRoot, dir))) {
                        toRemove.push({ path: path.join(projectRoot, dir), type: 'dir', label: dir + '/' });
                    }
                }
            }

            // Archivos de configuración específicos del agente (markerFile si es un archivo)
            if (ide.markerFile && ide.markerFile.includes('.') && fs.existsSync(path.join(projectRoot, ide.markerFile))) {
                const markerStat = fs.statSync(path.join(projectRoot, ide.markerFile));
                if (markerStat.isFile()) {
                    toRemove.push({ path: path.join(projectRoot, ide.markerFile), type: 'file', label: ide.markerFile });
                }
            }

            for (const item of toRemove) {
                try {
                    if (item.type === 'dir') {
                        fs.rmSync(item.path, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(item.path);
                    }
                    console.log(`  ${chalk.red('✘')} ${ide.name}: ${chalk.gray(item.label)} eliminado`);
                    removed++;
                } catch (e) {
                    console.error(`  ${chalk.red('❌')} Error eliminando ${item.label}: ${e.message}`);
                    errors++;
                }
            }
        }

        // Eliminar entry points raíz si --all
        if (options.all) {
            for (const f of existingRootFiles) {
                try {
                    fs.unlinkSync(path.join(projectRoot, f));
                    console.log(`  ${chalk.red('✘')} ${chalk.gray(f)} eliminado`);
                    removed++;
                } catch (e) {
                    console.error(`  ${chalk.red('❌')} Error eliminando ${f}: ${e.message}`);
                    errors++;
                }
            }
        }

        console.log('');
        if (errors === 0) {
            console.log(gradient.pastel(`\n✨ Limpieza completada. ${removed} elemento(s) eliminado(s).\n`));
            if (!options.all) {
                console.log(chalk.dim('   💡 Usa `lmagent uninstall --all` para también eliminar CLAUDE.md, GEMINI.md y AGENTS.md.'));
            }
        } else {
            console.log(chalk.yellow(`\n⚠️  ${removed} eliminado(s), ${errors} error(es).\n`));
        }
    });

// CLI entry point is handled at the bottom of the file (require.main === module)

function arePathsEqual(p1, p2) {
    if (!p1 || !p2) return false;
    return path.resolve(p1).toLowerCase() === path.resolve(p2).toLowerCase();
}

// Helper to deploy AGENTS.md, CLAUDE.md y GEMINI.md to project root
// Los archivos con versionTemplate:true tienen {{VERSION}} que se reemplaza dinámicamente
async function deployCorePillars(options, projectRoot) {
    console.log(chalk.bold('\n🚀 Desplegando Pilares de Inteligencia (Contexto Root):'));
    for (const file of INIT_FILES) {
        const srcPath = path.join(__dirname, file.src);
        const destPath = path.join(projectRoot, file.src);

        if (fs.existsSync(srcPath)) {
            let shouldCopy = false;
            if (!fs.existsSync(destPath)) {
                shouldCopy = true;
                console.log(`  ${chalk.green('✔')} ${file.src} (Creado en la raíz)`);
            } else {
                // Si ya existe pero tiene versión vieja, actualizar automáticamente
                const existingContent = fs.readFileSync(destPath, 'utf8');
                const hasOldVersion = existingContent.includes('{{VERSION}}') ||
                    (file.versionTemplate && !existingContent.includes(`v${PKG_VERSION}`));

                if (options.force || hasOldVersion) {
                    shouldCopy = true;
                    const reason = hasOldVersion ? 'Actualizando versión' : 'Sobrescribiendo por --force';
                    console.log(`  ${chalk.yellow('✎')} ${file.src} (${reason})`);
                } else if (options.yes) {
                    console.log(`  ${chalk.blue('ℹ')} ${file.src} ya existe v${PKG_VERSION} (OK)`);
                } else {
                    const answer = await inquirer.prompt([{
                        type: 'confirm',
                        name: 'overwrite',
                        message: `⚠️  ${file.src} ya existe. ¿Deseas actualizarlo?`,
                        default: false
                    }]);
                    shouldCopy = answer.overwrite;
                    if (shouldCopy) console.log(`  ${chalk.yellow('✎')} ${file.src} (Actualizado)`);
                }
            }

            if (shouldCopy) {
                let content = fs.readFileSync(srcPath, 'utf8');
                // Inyectar versión dinámica si el archivo usa template
                if (file.versionTemplate) {
                    content = content.replace(/\{\{VERSION\}\}/g, PKG_VERSION);
                }
                fs.writeFileSync(destPath, content, 'utf8');
            }
        }
    }
}

async function runInstall(options) {
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                                      by QuBit\n'));

    const projectRoot = process.cwd();

    // ── PASO 1: Desplegar Pilares (AGENTS.md) ──
    await deployCorePillars(options, projectRoot);

    // ── PASO 2: Detección Automática de Agentes (Global + Proyecto) ──
    // Detección global: busca agentes instalados en el HOME del usuario
    const globalAgents = detectGlobalAgents();
    // Detección en proyecto: busca marcadores en el directorio del proyecto
    const detectedIdes = IDE_CONFIGS.filter(ide => {
        if (ide.value === 'custom' || ide.value === 'generic') return false;
        const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
        const rulesDirRoot = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir.split('/')[0]));
        const installedGlobally = globalAgents.has(ide.value);
        return markerInProject || rulesDirRoot || installedGlobally;
    });

    let targetIdes = [];
    let selectedSkills = [];
    let selectedRules = [];
    let selectedWorkflows = [];
    let installDirs = { config: true, templates: true, docs: true, memory: true };

    if (options.yes) {
        // ── Modo No Interactivo ──
        console.log(chalk.yellow('⚡ Modo: No interactivo'));
        targetIdes = detectedIdes.length > 0 ? detectedIdes : [IDE_CONFIGS.find(i => i.value === 'cursor')];
        selectedSkills = getAllItems(PACKAGE_SKILLS_DIR, true);
        selectedRules = getAllItems(PACKAGE_RULES_DIR, false);
        selectedWorkflows = getAllItems(PACKAGE_WORKFLOWS_DIR, false);
    } else {
        // ── Modo Interactivo ──
        console.log(chalk.gray('================================================================'));
        console.log(chalk.cyan('🔹 Instalación Unificada LMAgent'));
        console.log(chalk.gray('================================================================'));
        console.log(`📍 Destino: ${chalk.green(projectRoot)}`);
        console.log(`🔧 Core:    ${chalk.green('.agents/ (centralizado)')}`);
        console.log('');

        // Auto-Detect IDEs
        if (detectedIdes.length === 0) {
            console.log(chalk.yellow('⚠️  No se detectaron agentes en este proyecto.'));
            console.log(chalk.blue('ℹ  Se creará estructura base + Cursor por defecto.\n'));
            targetIdes = [IDE_CONFIGS.find(i => i.value === 'cursor')];
        } else {
            const names = detectedIdes.map(i => i.name).join(', ');
            console.log(chalk.green(`🚀 Agentes Detectados: ${chalk.bold(names)}\n`));
            targetIdes = detectedIdes;
        }

        const availableSkills = getAllItems(PACKAGE_SKILLS_DIR, true);
        const availableRules = getAllItems(PACKAGE_RULES_DIR, false);
        const availableWorkflows = getAllItems(PACKAGE_WORKFLOWS_DIR, false);

        const quickInstall = await inquirer.prompt([{
            type: 'confirm',
            name: 'all',
            message: '⚡ ¿Instalar TODO (Skills, Rules, Workflows, Memory, Config, Docs)?',
            default: true
        }]);

        if (quickInstall.all) {
            selectedSkills = availableSkills;
            selectedRules = availableRules;
            selectedWorkflows = availableWorkflows;
        } else {
            // Selección manual de componentes
            const skillsAnswer = await inquirer.prompt([{
                type: 'checkbox', name: 'skills',
                message: '🧩 Skills:', pageSize: 15,
                choices: availableSkills.map(s => ({ name: s, checked: true }))
            }]);
            selectedSkills = skillsAnswer.skills;

            const rulesAnswer = await inquirer.prompt([{
                type: 'checkbox', name: 'rules',
                message: '📜 Rules:', pageSize: 15,
                choices: availableRules.map(r => ({ name: r, checked: true }))
            }]);
            selectedRules = rulesAnswer.rules;

            const workflowsAnswer = await inquirer.prompt([{
                type: 'checkbox', name: 'workflows',
                message: '🔄 Workflows:', pageSize: 15,
                choices: availableWorkflows.map(w => ({ name: w, checked: true }))
            }]);
            selectedWorkflows = workflowsAnswer.workflows;

            const dirsAnswer = await inquirer.prompt([{
                type: 'checkbox', name: 'dirs',
                message: '📁 Directorios adicionales:',
                choices: [
                    { name: 'config/ - Configuración del framework', value: 'config', checked: true },
                    { name: 'templates/ - Plantillas de proyecto', value: 'templates', checked: true },
                    { name: 'docs/ - Documentación', value: 'docs', checked: true },
                    { name: 'memory/ - Contexto persistente', value: 'memory', checked: true },
                ]
            }]);
            installDirs = {
                config: dirsAnswer.dirs.includes('config'),
                templates: dirsAnswer.dirs.includes('templates'),
                docs: dirsAnswer.dirs.includes('docs'),
                memory: dirsAnswer.dirs.includes('memory'),
            };
        }

        const { confirm } = await inquirer.prompt([{
            type: 'confirm', name: 'confirm',
            message: '¿Proceder con la instalación?', default: true
        }]);
        if (!confirm) return;
    }

    // ── PASO 3: Instalar CORE en .agents/ (ÚNICA ubicación) ──
    const coreDir = path.join(projectRoot, '.agents');
    if (!fs.existsSync(coreDir)) fs.mkdirSync(coreDir, { recursive: true });

    console.log(chalk.bold('\n📦 Instalando Core en .agents/ (centralizado):'));

    // Skills
    if (selectedSkills.length > 0) {
        const targetDir = path.join(coreDir, 'skills');
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        for (const skill of selectedSkills) {
            const src = path.join(PACKAGE_SKILLS_DIR, skill);
            const dest = path.join(targetDir, skill);
            if (fs.existsSync(src)) {
                copyRecursiveSync(src, dest, true);
            }
        }
        console.log(`  ${chalk.green('✔')} Skills: ${selectedSkills.length} instalados en .agents/skills/`);
    }

    // Rules
    if (selectedRules.length > 0) {
        const targetDir = path.join(coreDir, 'rules');
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        for (const rule of selectedRules) {
            const src = path.join(PACKAGE_RULES_DIR, rule);
            const dest = path.join(targetDir, rule);
            if (fs.existsSync(src)) fs.copyFileSync(src, dest);
        }
        console.log(`  ${chalk.green('✔')} Rules: ${selectedRules.length} instaladas en .agents/rules/`);
    }

    // Workflows
    if (selectedWorkflows.length > 0) {
        const targetDir = path.join(coreDir, 'workflows');
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        for (const wf of selectedWorkflows) {
            const src = path.join(PACKAGE_WORKFLOWS_DIR, wf);
            const dest = path.join(targetDir, wf);
            if (fs.existsSync(src)) fs.copyFileSync(src, dest);
        }
        console.log(`  ${chalk.green('✔')} Workflows: ${selectedWorkflows.length} instalados en .agents/workflows/`);
    }

    // Directorios adicionales (config, templates, docs, memory)
    if (installDirs.config && fs.existsSync(PACKAGE_CONFIG_DIR)) {
        copyRecursiveSync(PACKAGE_CONFIG_DIR, path.join(coreDir, 'config'), true);
        console.log(`  ${chalk.green('✔')} Config copiado a .agents/config/`);
    }
    if (installDirs.templates && fs.existsSync(PACKAGE_TEMPLATES_DIR)) {
        copyRecursiveSync(PACKAGE_TEMPLATES_DIR, path.join(coreDir, 'templates'), true);
        console.log(`  ${chalk.green('✔')} Templates copiado a .agents/templates/`);
    }
    if (installDirs.docs && fs.existsSync(PACKAGE_DOCS_DIR)) {
        copyRecursiveSync(PACKAGE_DOCS_DIR, path.join(coreDir, 'docs'), true);
        console.log(`  ${chalk.green('✔')} Docs copiado a .agents/docs/`);
    }
    if (installDirs.memory && fs.existsSync(PACKAGE_MEMORY_DIR)) {
        const memTarget = path.join(coreDir, 'memory');
        if (!fs.existsSync(memTarget)) {
            copyRecursiveSync(PACKAGE_MEMORY_DIR, memTarget, true);
            console.log(`  ${chalk.green('✔')} Memory copiado a .agents/memory/`);
        } else {
            // Solo copiar archivos que no existan (no sobrescribir contexto del usuario)
            const memFiles = fs.readdirSync(PACKAGE_MEMORY_DIR);
            let newCount = 0;
            for (const mf of memFiles) {
                const dest = path.join(memTarget, mf);
                if (!fs.existsSync(dest)) {
                    fs.copyFileSync(path.join(PACKAGE_MEMORY_DIR, mf), dest);
                    newCount++;
                }
            }
            console.log(`  ${chalk.cyan('ℹ')} Memory: ${newCount} nuevos (existentes preservados)`);
        }
    }

    // ── PASO 4: Limpieza de Root ──
    console.log(chalk.bold('\n🧹 Limpieza de archivos root:'));
    const allRootFiles = [
        '.cursorrules', '.windsurfrules', '.windsurfrules.md', '.continuerules',
        '.goosehints', '.roorules'
    ];
    const requiredRootFiles = new Set(['AGENTS.md']);
    for (const ide of targetIdes) {
        if (ide.configFile && !ide.configFile.includes('/')) requiredRootFiles.add(ide.configFile);
    }
    for (const file of allRootFiles) {
        if (!requiredRootFiles.has(file)) {
            const filePath = path.join(projectRoot, file);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`  ${chalk.green('✔')} Eliminado: ${chalk.cyan(file)}`);
                } catch (e) {
                    console.error(`  ${chalk.red('❌')} Error eliminando ${file}: ${e.message}`);
                }
            }
        }
    }

    // ── PASO 5: Desplegar Bridge Files y ConfigFiles por Agente ──
    console.log(chalk.bold('\n🔗 Configurando Agentes Detectados:'));
    const skillCount = selectedSkills.length;
    const ruleCount = selectedRules.length;
    const wfCount = selectedWorkflows.length;

    for (const ide of targetIdes) {
        // 5a. Limpiar skills/rules/workflows legacy copiados en carpetas de agente
        if (ide.value !== 'generic' && ide.value !== 'amp') {
            const legacyDirs = [ide.skillsDir, ide.workflowsDir].filter(d => d && !arePathsEqual(path.join(projectRoot, d), path.join(coreDir, 'skills')) && !arePathsEqual(path.join(projectRoot, d), path.join(coreDir, 'workflows')));
            for (const ld of legacyDirs) {
                const legacyPath = path.join(projectRoot, ld);
                if (fs.existsSync(legacyPath)) {
                    try {
                        fs.rmSync(legacyPath, { recursive: true, force: true });
                        console.log(`  ${chalk.yellow('🗑')} ${ide.name}: Eliminado ${ld}/ (legacy, ahora en .agents/)`);
                    } catch (e) { }
                }
            }
        }

        // 5b. ConfigFile (CLAUDE.md, GEMINI.md, etc.)
        if (ide.configFile) {
            if (ide.configFile.endsWith('.json') || ide.configFile.endsWith('.yaml') || ide.configFile.endsWith('.yml')) {
                // Structured configs: use template if exists
                const AGENT_CONFIGS_TEMPLATE_DIR = path.join(__dirname, '.agents', 'templates', 'agent-configs');
                const templateFile = ide.configTemplate ? path.join(AGENT_CONFIGS_TEMPLATE_DIR, ide.configTemplate) : null;
                if (templateFile && fs.existsSync(templateFile)) {
                    const configPath = path.join(projectRoot, ide.configFile);
                    if (!fs.existsSync(configPath) || options.force) {
                        const content = fs.readFileSync(templateFile, 'utf8')
                            .replace(/\{\{VERSION\}\}/g, PKG_VERSION)
                            .replace(/\{\{MAJOR\}\}/g, PKG_VERSION.split('.')[0]);
                        if (!fs.existsSync(path.dirname(configPath))) fs.mkdirSync(path.dirname(configPath), { recursive: true });
                        fs.writeFileSync(configPath, content);
                        console.log(`  ${chalk.green('✔')} ${ide.name}: ${ide.configFile} (config)`);
                    }
                }
            } else {
                // Markdown configs (CLAUDE.md, GEMINI.md, copilot-instructions, etc.)
                const configPath = path.join(projectRoot, ide.configFile);
                const AGENT_CONFIGS_TEMPLATE_DIR = path.join(__dirname, '.agents', 'templates', 'agent-configs');
                const templateFile = ide.configTemplate
                    ? path.join(AGENT_CONFIGS_TEMPLATE_DIR, ide.configTemplate)
                    : path.join(AGENT_CONFIGS_TEMPLATE_DIR, '_generic.md');

                let content;
                if (fs.existsSync(templateFile)) {
                    content = fs.readFileSync(templateFile, 'utf8')
                        .replace(/\{\{VERSION\}\}/g, PKG_VERSION)
                        .replace(/\{\{MAJOR\}\}/g, PKG_VERSION.split('.')[0])
                        .replace(/\{\{SKILLS_DIR\}\}/g, '.agents/skills')
                        .replace(/\{\{RULES_DIR\}\}/g, '.agents/rules')
                        .replace(/\{\{WORKFLOWS_DIR\}\}/g, '.agents/workflows');
                } else {
                    content = generateMinimalConfig(ide, PKG_VERSION);
                }

                // Si es un archivo raíz (CLAUDE.md, GEMINI.md), usar contenido del paquete
                if (!ide.configFile.includes('/')) {
                    const srcFile = path.join(__dirname, ide.configFile);
                    if (fs.existsSync(srcFile)) {
                        content = fs.readFileSync(srcFile, 'utf8')
                            .replace(/\{\{VERSION\}\}/g, PKG_VERSION)
                            .replace(/\{\{MAJOR\}\}/g, PKG_VERSION.split('.')[0]);
                    }
                }

                try {
                    if (!fs.existsSync(path.dirname(configPath))) fs.mkdirSync(path.dirname(configPath), { recursive: true });
                    if (!fs.existsSync(configPath) || options.force) {
                        fs.writeFileSync(configPath, content);
                        console.log(`  ${chalk.green('✔')} ${ide.name}: ${ide.configFile}`);
                    } else {
                        const existingContent = fs.readFileSync(configPath, 'utf8');
                        if (!existingContent.includes('AGENTS.md')) {
                            fs.appendFileSync(configPath, '\n' + content);
                            console.log(`  ${chalk.blue('ℹ')} ${ide.name}: ${ide.configFile} (actualizado)`);
                        } else {
                            console.log(`  ${chalk.cyan('✔')} ${ide.name}: ${ide.configFile} (OK)`);
                        }
                    }
                } catch (e) {
                    console.error(chalk.red(`  ❌ Error con ${ide.configFile}: ${e.message}`));
                }
            }
        }

        // 5c. Bridge File (ligero, solo para agentes sin configFile)
        const bridgeFile = ide.bridgeFile || (ide.rulesDir && !ide.configFile ? '00-lmagent.md' : null);
        if (bridgeFile && !ide.configFile) {
            if (ide.rulesDir && !fs.existsSync(path.join(projectRoot, ide.rulesDir))) {
                fs.mkdirSync(path.join(projectRoot, ide.rulesDir), { recursive: true });
            }
            const bridgePath = path.join(projectRoot, ide.rulesDir, bridgeFile);
            const relCatalog = getRelLink(path.join(ide.rulesDir, bridgeFile), 'AGENTS.md');

            let bridgeContent;
            if (bridgeFile.endsWith('.mdc')) {
                bridgeContent = `---
description: LMAgent Framework Entry Point - Read AGENTS.md for full context
globs: **/*
---

# 🤖 LMAgent v${PKG_VERSION}
> **LEE [AGENTS.md](${relCatalog})** para obtener tu contexto completo.

## Rutas del Framework
- **Skills**: \`.agents/skills/\` (${skillCount} skills)
- **Rules**: \`.agents/rules/\` (${ruleCount} reglas)
- **Workflows**: \`.agents/workflows/\` (${wfCount} workflows)
- **Memory**: \`.agents/memory/\`

!! SYSTEM NOTE: You MUST read AGENTS.md at startup. !!
`;
            } else {
                bridgeContent = `# 🤖 LMAgent v${PKG_VERSION}
> **LEE [AGENTS.md](${relCatalog})** para obtener tu contexto completo.

## Rutas del Framework
- **Skills**: \`.agents/skills/\` (${skillCount} skills)
- **Rules**: \`.agents/rules/\` (${ruleCount} reglas)
- **Workflows**: \`.agents/workflows/\` (${wfCount} workflows)
- **Memory**: \`.agents/memory/\`
`;
            }

            try {
                if (!fs.existsSync(path.dirname(bridgePath))) fs.mkdirSync(path.dirname(bridgePath), { recursive: true });
                fs.writeFileSync(bridgePath, bridgeContent);
                console.log(`  ${chalk.green('✔')} ${ide.name}: ${bridgeFile} (bridge)`);
            } catch (e) {
                console.error(chalk.red(`  ❌ Error bridge ${ide.name}: ${e.message}`));
            }
        }
    }

    // ── PASO 6: Sincronizar Catálogo ──
    await syncSkillCatalog(projectRoot);

    // ── Resumen Final ──
    console.log(gradient.pastel.multiline('\n✨ Instalación Finalizada ✨'));
    console.log(chalk.gray('================================================================'));
    console.log(chalk.bold.green('🎉 ¡Todo listo!'));
    console.log('');
    const ideNames = targetIdes.map(i => i.name).join(', ');
    console.log(chalk.cyan(`🤖  Agentes: ${chalk.bold(ideNames)}`));
    console.log(chalk.cyan(`📦  Core:    ${chalk.bold('.agents/')} (${skillCount} skills, ${ruleCount} rules, ${wfCount} workflows)`));
    console.log('');
    console.log(chalk.white('    1. Abre tu agente — leerá el contexto automáticamente.'));
    console.log(chalk.white('    2. Usa triggers: /dev /front /arch /fix /pm /orch'));
    console.log('');
    console.log(chalk.dim('    💡 `lmagent doctor` para verificar | `lmagent tokens` para ver consumo'));
    console.log(chalk.gray('================================================================'));
}

// Helper: Genera config mínimo si no hay template
function generateMinimalConfig(ide, version) {
    return `# 🤖 LMAgent Framework v${version}
> LEE [AGENTS.md](./AGENTS.md) para obtener tu contexto completo.
> Skills: \`.agents/skills/\` | Rules: \`.agents/rules/\` | Workflows: \`.agents/workflows/\`
`;
}

// ─── Sincronización Dinámica del Catálogo de Skills ───────────────────────────
// Escanea .agents/skills/*/SKILL.md, extrae frontmatter y regenera las tablas
// entre <!-- SKILLS_CATALOG_START --> y <!-- SKILLS_CATALOG_END --> en:
//   - AGENTS.md (tabla de skills con trigger, nombre y directorio)
//   - .agents/rules/00-master.md (tabla de skills con trigger y descripción)
async function syncSkillCatalog(projectRoot) {
    const skillsDir = path.join(projectRoot, '.agents', 'skills');
    if (!fs.existsSync(skillsDir)) return;

    // 1. Escanear todos los SKILL.md y extraer frontmatter
    const skills = [];
    const skillDirs = fs.readdirSync(skillsDir).filter(d => {
        const p = path.join(skillsDir, d);
        return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
    });

    for (const dir of skillDirs) {
        const skillMdPath = path.join(skillsDir, dir, 'SKILL.md');
        try {
            const content = fs.readFileSync(skillMdPath, 'utf8');
            const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
            if (!fmMatch) continue;

            const fm = fmMatch[1];
            const name = (fm.match(/^name:\s*(.+)$/m) || [])[1]?.trim() || dir;
            const description = (fm.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || '';

            // Extract triggers array from YAML
            const triggersMatch = fm.match(/triggers:\s*\n((?:\s+-\s*.+\n?)+)/);
            let triggers = [];
            if (triggersMatch) {
                triggers = triggersMatch[1].match(/\s+-\s*(.+)/g)?.map(t => t.replace(/^\s+-\s*/, '').trim().replace(/["']/g, '')) || [];
            }

            skills.push({ slug: dir, name, description, triggers });
        } catch (e) {
            // Silently skip malformed skills
        }
    }

    if (skills.length === 0) return;

    console.log(chalk.bold(`\n📚 Sincronizando Catálogo de Skills (${skills.length} skills detectados)...`));

    // 2. Generar tabla para AGENTS.md (formato: Trigger | Skill | Directorio)
    const agentsTableLines = skills.map(s => {
        const trigger = s.triggers.length > 0 ? `\`${s.triggers[0]}\`` : `\`/${s.slug.split('-')[0]}\``;
        return `| ${trigger} | **${s.slug}** | \`.agents/skills/${s.slug}/\` |`;
    });

    const agentsTableContent = `| Trigger | Skill | Directorio |
|:---|:---|:---|
${agentsTableLines.join('\n')}`;

    // 3. Generar tabla para 00-master.md (formato: Skill | Triggers | Descripción)
    const masterTableLines = skills.map(s => {
        const triggerStr = s.triggers.length > 0
            ? s.triggers.map(t => `\`${t}\``).join(', ')
            : `\`/${s.slug.split('-')[0]}\``;
        return `| **${s.slug}** | ${triggerStr} | ${s.description} |`;
    });

    const masterTableContent = `| Skill | Triggers | Descripción |
|-------|----------|-------------|
${masterTableLines.join('\n')}`;

    // 4. Inyectar en AGENTS.md
    const agentsPath = path.join(projectRoot, 'AGENTS.md');
    if (fs.existsSync(agentsPath)) {
        let agentsContent = fs.readFileSync(agentsPath, 'utf8');
        const agentsRegex = /<!-- SKILLS_CATALOG_START -->[\s\S]*?<!-- SKILLS_CATALOG_END -->/;
        if (agentsRegex.test(agentsContent)) {
            const newSection = `<!-- SKILLS_CATALOG_START -->\n${agentsTableContent}\n<!-- SKILLS_CATALOG_END -->`;
            agentsContent = agentsContent.replace(agentsRegex, newSection);
            fs.writeFileSync(agentsPath, agentsContent, 'utf8');
            console.log(`  ${chalk.green('✔')} AGENTS.md — Catálogo actualizado (${skills.length} skills)`);
        }
    }

    // 5. Inyectar en 00-master.md (buscar en project's .agents/rules/)
    const masterPath = path.join(projectRoot, '.agents', 'rules', '00-master.md');
    if (fs.existsSync(masterPath)) {
        let masterContent = fs.readFileSync(masterPath, 'utf8');
        const masterRegex = /<!-- SKILLS_CATALOG_START -->[\s\S]*?<!-- SKILLS_CATALOG_END -->/;
        if (masterRegex.test(masterContent)) {
            const newSection = `<!-- SKILLS_CATALOG_START -->\n${masterTableContent}\n<!-- SKILLS_CATALOG_END -->`;
            masterContent = masterContent.replace(masterRegex, newSection);
            fs.writeFileSync(masterPath, masterContent, 'utf8');
            console.log(`  ${chalk.green('✔')} 00-master.md — Catálogo actualizado (${skills.length} skills)`);
        }
    }
}



function copyRecursiveSync(src, dest, overwrite) {
    if (fs.cpSync) {
        try {
            fs.cpSync(src, dest, { recursive: true, force: overwrite, errorOnExist: false });
        } catch (e) {
            console.error(chalk.red(`Error copying(cpSync) ${path.basename(src)}: ${e.message} `));
            // Fallback manual implementation just in case
            if (fs.existsSync(src)) {
                const stat = fs.statSync(src);
                if (stat.isDirectory()) {
                    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
                    fs.readdirSync(src).forEach(child => {
                        copyRecursiveSync(path.join(src, child), path.join(dest, child), overwrite);
                    });
                } else {
                    fs.copyFileSync(src, dest);
                }
            }
        }
    } else {
        // Fallback for older Node versions
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(function (childItemName) {
                copyRecursiveSync(path.join(src, childItemName),
                    path.join(dest, childItemName), overwrite);
            });
        } else {
            if (overwrite || !fs.existsSync(dest)) {
                fs.copyFileSync(src, dest);
            }
        }
    }
}

function getAllItems(dir, isNested) {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);
    if (isNested) {
        return items.filter(item => {
            const p = path.join(dir, item);
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'SKILL.md'));
        });
    } else {
        return items.filter(item => item.endsWith('.md') || item.endsWith('.txt') || item.endsWith('.cursorrules') || item.endsWith('.toml'));
    }
}

// runInit() eliminada en v3.4.0 — unificada en runInstall()
// El comando `init` ahora es alias de `install`








// ============================================
// DOCTOR: Verificar configuración del proyecto
// ============================================

async function runDoctor() {
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                              Doctor - Diagnóstico\n'));

    const projectRoot = process.cwd();
    let issues = 0;
    let ok = 0;

    console.log(chalk.bold('🔍 Verificando proyecto en: ' + chalk.cyan(projectRoot) + '\n'));

    // 1. Archivos de entry point
    console.log(chalk.bold('📄 Entry Points:'));
    for (const file of INIT_FILES) {
        const exists = fs.existsSync(path.join(projectRoot, file.src));
        if (exists) {
            console.log(`  ${chalk.green('✔')} ${file.src}`);
            ok++;
        } else {
            console.log(`  ${chalk.red('✘')} ${file.src} - ${chalk.red('FALTANTE')} → ejecuta ${chalk.bold('lmagent install')}`);
            issues++;
        }
    }

    // 2. Core centralizado en .agents/
    console.log(chalk.bold('\n📦 Core (.agents/):'));
    const coreDir = path.join(projectRoot, '.agents');
    if (fs.existsSync(coreDir)) {
        console.log(`  ${chalk.green('✔')} .agents/ existe`);
        ok++;

        for (const dir of CORE_DIRS) {
            const dirPath = path.join(coreDir, dir.src);
            if (fs.existsSync(dirPath)) {
                let count = 0;
                try {
                    const items = fs.readdirSync(dirPath);
                    count = items.filter(i => !i.startsWith('.')).length;
                } catch (e) { }
                console.log(`  ${chalk.green('✔')} ${dir.src}/ (${count} elementos)`);
                ok++;
            } else {
                console.log(`  ${chalk.yellow('⚠')} ${dir.src}/ - No encontrado → ejecuta ${chalk.bold('lmagent install')}`);
            }
        }

        // Verificar conteo de skills
        const skillsDir = path.join(coreDir, 'skills');
        if (fs.existsSync(skillsDir)) {
            const installedSkills = fs.readdirSync(skillsDir)
                .filter(item => fs.statSync(path.join(skillsDir, item)).isDirectory());
            const expectedSkillsCount = getAllItems(PACKAGE_SKILLS_DIR, true).length;

            if (installedSkills.length < expectedSkillsCount) {
                console.log(`    ${chalk.yellow('⚠')} Solo ${installedSkills.length}/${expectedSkillsCount} skills → ejecuta ${chalk.bold('lmagent install')}`);
            } else {
                console.log(`    ${chalk.green('✔')} ${installedSkills.length}/${expectedSkillsCount} skills completos`);
            }
        }
    } else {
        console.log(`  ${chalk.red('✘')} .agents/ NO existe → ejecuta ${chalk.bold('lmagent install')}`);
        issues++;
    }

    // 3. Detectar agentes (Global + Proyecto)
    console.log(chalk.bold('\n🔧 Agentes detectados:'));
    const globalAgents = detectGlobalAgents();
    let ideFound = false;
    for (const ide of IDE_CONFIGS) {
        if (ide.value === 'custom' || ide.value === 'generic') continue;
        const markerExist = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
        const rulesExist = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
        const isGlobal = globalAgents.has(ide.value);
        const bridgeExists = ide.bridgeFile && ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir, ide.bridgeFile));
        const configExists = ide.configFile && fs.existsSync(path.join(projectRoot, ide.configFile));

        if (markerExist || rulesExist || isGlobal) {
            ideFound = true;
            const parts = [];
            if (isGlobal && !markerExist && !rulesExist) parts.push(chalk.blue('global'));
            if (bridgeExists) parts.push(chalk.green('bridge ✔'));
            else if (configExists) parts.push(chalk.green('config ✔'));
            else parts.push(chalk.yellow('sin bridge'));

            console.log(`  ${chalk.green('✔')} ${ide.name} (${parts.join(', ')})`);
            ok++;
        }
    }
    if (!ideFound) {
        console.log(`  ${chalk.red('✘')} Ningún agente detectado → ejecuta ${chalk.bold('lmagent install')}`);
        issues++;
    }

    // 4. Verificar .gitignore
    console.log(chalk.bold('\n🔒 Seguridad:'));
    const gitignoreExists = fs.existsSync(path.join(projectRoot, '.gitignore'));
    if (gitignoreExists) {
        const gitignore = fs.readFileSync(path.join(projectRoot, '.gitignore'), 'utf-8');
        if (gitignore.includes('.env')) {
            console.log(`  ${chalk.green('✔')} .env está en .gitignore`);
            ok++;
        } else {
            console.log(`  ${chalk.yellow('⚠')} .env no está en .gitignore`);
        }
    } else {
        console.log(`  ${chalk.yellow('⚠')} .gitignore no encontrado`);
    }

    // Resumen
    console.log('');
    if (issues === 0) {
        console.log(gradient.pastel(`\n✨ Todo en orden! ${ok} verificaciones pasadas.\n`));
    } else {
        console.log(chalk.yellow(`\n⚠️  ${issues} problema(s) encontrado(s), ${ok} verificaciones OK.\n`));
    }
}

// Helper: Calculate relative Markdown link
function getRelLink(fromRelPath, toRelPath) {
    const fromDir = path.dirname(fromRelPath);
    let rel = path.relative(fromDir, toRelPath);
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel.replace(/\\/g, '/'); // Force forward slashes for Markdown
}

// Helper: Contar archivos recursivamente
function getAllItemsFlat(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getAllItemsFlat(fullPath));
        } else {
            results.push(fullPath);
        }
    }
    return results;
}


// Execute CLI only if run directly
if (require.main === module) {
    if (process.argv.length === 2) {
        runInstall({});
    } else {
        program.parse(process.argv);
    }
}

module.exports = { IDE_CONFIGS };

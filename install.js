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

// Configuración: Directorios fuente del paquete
const PACKAGE_SKILLS_DIR = path.join(__dirname, '.agents', 'skills');
const PACKAGE_RULES_DIR = path.join(__dirname, '.agents', 'rules');
const PACKAGE_WORKFLOWS_DIR = path.join(__dirname, '.agents', 'workflows');
const PACKAGE_CONFIG_DIR = path.join(__dirname, '.agents', 'config');
const PACKAGE_TEMPLATES_DIR = path.join(__dirname, '.agents', 'templates');
const PACKAGE_DOCS_DIR = path.join(__dirname, '.agents', 'docs');

// Archivos de proyecto que init copia a la raíz
const INIT_FILES = [
    { src: 'CLAUDE.md', desc: 'Instrucciones para Claude Code' },
    { src: 'AGENTS.md', desc: 'Catálogo de capacidades LMAgent' },
];

const INIT_DIRS = [
    { src: 'config', desc: 'Configuración del framework' },
    { src: 'templates', desc: 'Templates de proyecto' },
    { src: 'docs', desc: 'Documentación extendida' },
    { src: 'workflows', desc: 'SOPs y Procedimientos' },
];

// Configuración: IDEs y Agentes soportados
// Configuración: IDEs y Agentes soportados
const IDE_CONFIGS = [
    // --- IDEs & Tiers Principales (Auto-Detected) ---
    { name: 'Cursor', value: 'cursor', rulesDir: '.cursor/rules', skillsDir: '.cursor/skills', workflowsDir: '.cursor/workflows', configFile: '.cursorrules', bridgeFile: 'lmagent.mdc', markerFile: '.cursorrules', forceCopy: true },
    { name: 'Windsurf', value: 'windsurf', rulesDir: '.windsurf/rules', skillsDir: '.windsurf/skills', workflowsDir: '.windsurf/workflows', configFile: '.windsurfrules', bridgeFile: 'lmagent.md', markerFile: '.windsurfrules', forceCopy: true },
    { name: 'Cline', value: 'cline', rulesDir: '.clinerules', skillsDir: '.cline/skills', workflowsDir: '.cline/workflows', configFile: null, bridgeFile: '00-lmagent.md', markerFile: '.clinerules', forceCopy: true },
    { name: 'Roo Code', value: 'roo', rulesDir: '.clinerules', skillsDir: '.roo/skills', workflowsDir: '.roo/workflows', configFile: null, bridgeFile: '00-lmagent.md', markerFile: '.roo', forceCopy: true },
    { name: 'VSCode Copilot', value: 'vscode', rulesDir: '.github/instructions', skillsDir: '.github/skills', workflowsDir: '.github/workflows', configFile: '.github/copilot-instructions.md', markerFile: '.vscode' },
    { name: 'Trae', value: 'trae', rulesDir: '.trae/rules', skillsDir: '.trae/skills', workflowsDir: '.trae/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.trae', forceCopy: true },
    { name: 'Claude Code', value: 'claude', rulesDir: '.claude/rules', skillsDir: '.claude/skills', workflowsDir: '.claude/workflows', configFile: 'CLAUDE.md', markerFile: '.claude', forceCopy: true },

    // --- Expanded Agent Support (Manual/Config Injection) ---
    { name: 'Amp / Kimi / Replit', value: 'amp', rulesDir: '.agents/rules', skillsDir: '.agents/skills', workflowsDir: '.agents/workflows', configFile: null, markerFile: '.agents' },
    { name: 'Antigravity', value: 'antigravity', rulesDir: '.agent/rules', skillsDir: '.agent/skills', workflowsDir: '.agent/workflows', configFile: null, markerFile: '.agent' },
    { name: 'Augment', value: 'augment', rulesDir: '.augment/rules', skillsDir: '.augment/skills', workflowsDir: '.augment/workflows', configFile: null, markerFile: '.augment' },
    { name: 'OpenClaw', value: 'openclaw', rulesDir: 'rules', skillsDir: 'skills', workflowsDir: 'workflows', configFile: null, markerFile: 'openclaw.yaml' },
    { name: 'CodeBuddy', value: 'codebuddy', rulesDir: '.codebuddy/rules', skillsDir: '.codebuddy/skills', workflowsDir: '.codebuddy/workflows', configFile: null, markerFile: '.codebuddy' },
    { name: 'Codex', value: 'codex', rulesDir: '.codex/rules', skillsDir: '.codex/skills', workflowsDir: '.codex/workflows', configFile: null, markerFile: '.codex' },
    { name: 'Command Code', value: 'command-code', rulesDir: '.commandcode/rules', skillsDir: '.commandcode/skills', workflowsDir: '.commandcode/workflows', configFile: null, markerFile: '.commandcode' },
    { name: 'Continue', value: 'continue', rulesDir: '.continue/rules', skillsDir: '.continue/skills', workflowsDir: '.continue/workflows', configFile: null, bridgeFile: '00-lmagent.md', markerFile: '.continue' },
    { name: 'Crush', value: 'crush', rulesDir: '.crush/rules', skillsDir: '.crush/skills', workflowsDir: '.crush/workflows', configFile: null, markerFile: '.crush' },
    { name: 'Droid', value: 'droid', rulesDir: '.factory/rules', skillsDir: '.factory/skills', workflowsDir: '.factory/workflows', configFile: null, markerFile: '.factory' },
    { name: 'Gemini CLI', value: 'gemini', rulesDir: '.agents/rules', skillsDir: '.agents/skills', workflowsDir: '.agents/workflows', configFile: null, markerFile: '.gemini' },
    { name: 'Goose', value: 'goose', rulesDir: '.goose/rules', skillsDir: '.goose/skills', workflowsDir: '.goose/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.goose' },
    { name: 'Junie', value: 'junie', rulesDir: '.junie/rules', skillsDir: '.junie/skills', workflowsDir: '.junie/workflows', configFile: null, markerFile: '.junie' },
    { name: 'iFlow CLI', value: 'iflow', rulesDir: '.iflow/rules', skillsDir: '.iflow/skills', workflowsDir: '.iflow/workflows', configFile: null, markerFile: '.iflow' },
    { name: 'Kilo Code', value: 'kilo', rulesDir: '.kilocode/rules', skillsDir: '.kilocode/skills', workflowsDir: '.kilocode/workflows', configFile: null, markerFile: '.kilocode' },
    { name: 'Kiro CLI', value: 'kiro', rulesDir: '.kiro/rules', skillsDir: '.kiro/skills', workflowsDir: '.kiro/workflows', configFile: null, markerFile: '.kiro' },
    { name: 'Kode', value: 'kode', rulesDir: '.kode/rules', skillsDir: '.kode/skills', workflowsDir: '.kode/workflows', configFile: null, markerFile: '.kode' },
    { name: 'MCPJam', value: 'mcpjam', rulesDir: '.mcpjam/rules', skillsDir: '.mcpjam/skills', workflowsDir: '.mcpjam/workflows', configFile: null, markerFile: '.mcpjam' },
    { name: 'Mistral Vibe', value: 'mistral', rulesDir: '.vibe/rules', skillsDir: '.vibe/skills', workflowsDir: '.vibe/workflows', configFile: null, markerFile: '.vibe' },
    { name: 'Mux', value: 'mux', rulesDir: '.mux/rules', skillsDir: '.mux/skills', workflowsDir: '.mux/workflows', configFile: null, markerFile: '.mux' },
    { name: 'OpenCode', value: 'opencode', rulesDir: '.opencode/rules', skillsDir: '.opencode/skills', workflowsDir: '.opencode/workflows', configFile: null, markerFile: '.opencode' },
    { name: 'OpenHands', value: 'openhands', rulesDir: '.openhands/microagents', skillsDir: '.openhands/skills', workflowsDir: '.openhands/workflows', configFile: null, bridgeFile: 'repo.md', markerFile: '.openhands' },
    { name: 'Pi', value: 'pi', rulesDir: '.pi/rules', skillsDir: '.pi/skills', workflowsDir: '.pi/workflows', configFile: null, markerFile: '.pi' },
    { name: 'Qoder', value: 'qoder', rulesDir: '.qoder/rules', skillsDir: '.qoder/skills', workflowsDir: '.qoder/workflows', configFile: null, markerFile: '.qoder' },
    { name: 'Qwen Code', value: 'qwen', rulesDir: '.qwen/rules', skillsDir: '.qwen/skills', workflowsDir: '.qwen/workflows', configFile: null, markerFile: '.qwen' },
    { name: 'Trae CN', value: 'trae-cn', rulesDir: '.trae-cn/rules', skillsDir: '.trae-cn/skills', workflowsDir: '.trae-cn/workflows', configFile: null, bridgeFile: 'lmagent.md', markerFile: '.trae-cn' },
    { name: 'Zencoder', value: 'zencoder', rulesDir: '.zencoder/rules', skillsDir: '.zencoder/skills', workflowsDir: '.zencoder/workflows', configFile: null, markerFile: '.zencoder' },
    { name: 'Neovate', value: 'neovate', rulesDir: '.neovate/rules', skillsDir: '.neovate/skills', workflowsDir: '.neovate/workflows', configFile: null, markerFile: '.neovate' },
    { name: 'Pochi', value: 'pochi', rulesDir: '.pochi/rules', skillsDir: '.pochi/skills', workflowsDir: '.pochi/workflows', configFile: null, markerFile: '.pochi' },
    { name: 'AdaL', value: 'adal', rulesDir: '.adal/rules', skillsDir: '.adal/skills', workflowsDir: '.adal/workflows', configFile: null, markerFile: '.adal' },

    {
        name: 'Gemini CLI',
        value: 'gemini',
        rulesDir: '.agents/rules',
        skillsDir: '.gemini/skills',
        workflowsDir: '.agents/workflows',
        configFile: '.gemini/config',
        markerFile: '.gemini'
    },
    {
        name: 'Continue',
        value: 'continue',
        rulesDir: '.continue/rules',
        skillsDir: '.continue/skills',
        workflowsDir: '.continue/workflows',
        configFile: '.continue/config.json',
        markerFile: '.continue'
    },
    {
        name: 'OpenCode',
        value: 'opencode',
        rulesDir: '.agents/rules',
        skillsDir: '.config/opencode/skills',
        workflowsDir: '.agents/workflows',
        configFile: '.opencode/config',
        markerFile: '.opencode'
    },
    {
        name: 'OpenHands',
        value: 'openhands',
        rulesDir: '.openhands/rules',
        skillsDir: '.openhands/skills',
        workflowsDir: '.openhands/workflows',
        configFile: '.openhands/config',
        markerFile: '.openhands'
    },
    {
        name: 'Goose',
        value: 'goose',
        rulesDir: '.goose/rules',
        skillsDir: '.goose/skills',
        workflowsDir: '.goose/workflows',
        configFile: '.goose/config',
        markerFile: '.goose'
    },
    {
        name: 'Mistral Vibe',
        value: 'vibe',
        rulesDir: '.vibe/rules',
        skillsDir: '.vibe/skills',
        workflowsDir: '.vibe/workflows',
        configFile: '.vibe/config',
        markerFile: '.vibe'
    },
    {
        name: 'Zed',
        value: 'zed',
        rulesDir: '.rules',
        skillsDir: '.rules/skills',
        workflowsDir: '.rules/workflows',
        configFile: '.rules/config',
        markerFile: '.zed'
    },
    {
        name: 'Envoid (OpenClaw / Moltbot)',
        value: 'openclaw',
        rulesDir: 'rules',
        skillsDir: 'skills',
        workflowsDir: 'workflows',
        configFile: 'openclaw.json',
        markerFile: 'openclaw.json'
    },
    {
        name: 'CodeBuddy',
        value: 'codebuddy',
        rulesDir: '.codebuddy/rules',
        skillsDir: '.codebuddy/skills',
        workflowsDir: '.codebuddy/workflows',
        configFile: '.codebuddy/config',
        markerFile: '.codebuddy',
        forceCopy: true
    },
    {
        name: 'Command Code',
        value: 'command-code',
        rulesDir: '.commandcode/rules',
        skillsDir: '.commandcode/skills',
        workflowsDir: '.commandcode/workflows',
        configFile: '.commandcode/config',
        markerFile: '.commandcode'
    },
    {
        name: 'Crush',
        value: 'crush',
        rulesDir: '.crush/rules',
        skillsDir: '.crush/skills',
        workflowsDir: '.crush/workflows',
        configFile: '.crush/config',
        markerFile: '.crush'
    },
    {
        name: 'Droid',
        value: 'droid',
        rulesDir: '.factory/rules',
        skillsDir: '.factory/skills',
        workflowsDir: '.factory/workflows',
        configFile: '.factory/config',
        markerFile: '.factory'
    },
    {
        name: 'Junie',
        value: 'junie',
        rulesDir: '.junie/rules',
        skillsDir: '.junie/skills',
        workflowsDir: '.junie/workflows',
        configFile: '.junie/config',
        markerFile: '.junie'
    },
    {
        name: 'iFlow',
        value: 'iflow',
        rulesDir: '.iflow/rules',
        skillsDir: '.iflow/skills',
        workflowsDir: '.iflow/workflows',
        configFile: '.iflow/config',
        markerFile: '.iflow'
    },
    {
        name: 'Kilo Code',
        value: 'kilo',
        rulesDir: '.kilocode/rules',
        skillsDir: '.kilocode/skills',
        workflowsDir: '.kilocode/workflows',
        configFile: '.kilocode/config',
        markerFile: '.kilocode'
    },
    {
        name: 'Kiro',
        value: 'kiro',
        rulesDir: '.kiro/rules',
        skillsDir: '.kiro/skills',
        workflowsDir: '.kiro/workflows',
        configFile: '.kiro/config',
        markerFile: '.kiro'
    },
    {
        name: 'Kode',
        value: 'kode',
        rulesDir: '.kode/rules',
        skillsDir: '.kode/skills',
        workflowsDir: '.kode/workflows',
        configFile: '.kode/config',
        markerFile: '.kode'
    },
    {
        name: 'MCPJam',
        value: 'mcpjam',
        rulesDir: '.mcpjam/rules',
        skillsDir: '.mcpjam/skills',
        workflowsDir: '.mcpjam/workflows',
        configFile: '.mcpjam/config',
        markerFile: '.mcpjam'
    },
    {
        name: 'Mux',
        value: 'mux',
        rulesDir: '.mux/rules',
        skillsDir: '.mux/skills',
        workflowsDir: '.mux/workflows',
        configFile: '.mux/config',
        markerFile: '.mux'
    },
    {
        name: 'Pi',
        value: 'pi',
        rulesDir: '.pi/rules',
        skillsDir: '.pi/skills',
        workflowsDir: '.pi/workflows',
        configFile: '.pi/config',
        markerFile: '.pi'
    },
    {
        name: 'Qoder',
        value: 'qoder',
        rulesDir: '.qoder/rules',
        skillsDir: '.qoder/skills',
        workflowsDir: '.qoder/workflows',
        configFile: '.qoder/config',
        markerFile: '.qoder'
    },
    {
        name: 'Qwen Code',
        value: 'qwen',
        rulesDir: '.qwen/rules',
        skillsDir: '.qwen/skills',
        workflowsDir: '.qwen/workflows',
        configFile: '.qwen/config',
        markerFile: '.qwen'
    },
    {
        name: 'Trae CN',
        value: 'trae-cn',
        rulesDir: '.trae-cn/rules',
        skillsDir: '.trae-cn/skills',
        workflowsDir: '.trae-cn/workflows',
        configFile: '.trae-cn/config',
        markerFile: '.trae-cn'
    },
    {
        name: 'Zencoder',
        value: 'zencoder',
        rulesDir: '.zencoder/rules',
        skillsDir: '.zencoder/skills',
        workflowsDir: '.zencoder/workflows',
        configFile: '.zencoder/config',
        markerFile: '.zencoder'
    },
    {
        name: 'Neovate',
        value: 'neovate',
        rulesDir: '.neovate/rules',
        skillsDir: '.neovate/skills',
        workflowsDir: '.neovate/workflows',
        configFile: '.neovate/config',
        markerFile: '.neovate'
    },
    {
        name: 'Pochi',
        value: 'pochi',
        rulesDir: '.pochi/rules',
        skillsDir: '.pochi/skills',
        workflowsDir: '.pochi/workflows',
        configFile: '.pochi/config',
        markerFile: '.pochi'
    },
    {
        name: 'AdaL',
        value: 'adal',
        rulesDir: '.adal/rules',
        skillsDir: '.adal/skills',
        workflowsDir: '.adal/workflows',
        configFile: '.adal/config',
        markerFile: '.adal'
    },
    {
        name: 'Generic/Other',
        value: 'generic',
        rulesDir: '.agents/rules',
        skillsDir: '.agents/skills',
        workflowsDir: '.agents/workflows',
        configFile: 'AGENTS.md',
        markerFile: '.agents'
    },
    {
        name: 'Custom Path (Manual)',
        value: 'custom',
        rulesDir: '',
        skillsDir: '',
        workflowsDir: '',
        markerFile: ''
    }
];

program
    .name('lmagent')
    .description('CLI para instalar skills y reglas de LMAgent')
    .version('3.0.0');

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
    .description('Inicializar proyecto con LMAgent (copia CLAUDE.md, AGENTS.md, config, etc.)')
    .option('-f, --force', 'Sobrescribir archivos existentes')
    .option('-y, --yes', 'No preguntar, instalar todo')
    .action((options) => {
        runInit(options);
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

if (process.argv.length === 2) {
    runInstall({});
} else {
    program.parse();
}

// Helper for Windows-proof path comparison
function arePathsEqual(p1, p2) {
    if (!p1 || !p2) return false;
    return path.resolve(p1).toLowerCase() === path.resolve(p2).toLowerCase();
}

async function runInstall(options) {
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                                      by QuBit\n'));

    const projectRoot = process.cwd();
    const userHome = os.homedir();
    const globalAgentDir = path.join(userHome, '.agents');
    const globalSkillsDir = path.join(globalAgentDir, 'skills');
    const globalRulesDir = path.join(globalAgentDir, 'rules');
    const globalWorkflowsDir = path.join(globalAgentDir, 'workflows'); // New

    // 1. Sincronizar (Copiar) Package -> Global Repo (~/.agents)
    console.log(chalk.cyan('🔄 Sincronizando repositorio global (~/.agents)...'));
    try {
        if (!fs.existsSync(globalAgentDir)) fs.mkdirSync(globalAgentDir, { recursive: true });

        if (fs.existsSync(PACKAGE_SKILLS_DIR)) {
            copyRecursiveSync(PACKAGE_SKILLS_DIR, globalSkillsDir, true);
        }
        if (fs.existsSync(PACKAGE_RULES_DIR)) {
            copyRecursiveSync(PACKAGE_RULES_DIR, globalRulesDir, true);
        }
        if (fs.existsSync(PACKAGE_WORKFLOWS_DIR)) {
            copyRecursiveSync(PACKAGE_WORKFLOWS_DIR, globalWorkflowsDir, true);
        }
        console.log(chalk.green('✔ Repositorio global sincronizado correctamente.'));
    } catch (e) {
        console.error(chalk.red(`❌ Error al sincronizar repositorio global: ${e.message}`));
    }
    console.log('');

    const SOURCE_SKILLS = fs.existsSync(globalSkillsDir) ? globalSkillsDir : PACKAGE_SKILLS_DIR;
    const SOURCE_RULES = fs.existsSync(globalRulesDir) ? globalRulesDir : PACKAGE_RULES_DIR;
    const SOURCE_WORKFLOWS = fs.existsSync(globalWorkflowsDir) ? globalWorkflowsDir : PACKAGE_WORKFLOWS_DIR;

    let targetIdes = [];
    let selectedSkills = [];
    let selectedRules = [];
    let selectedWorkflows = []; // New
    let installMethod = 'symlink';
    let installTarget = 'project';
    let targetRoot = projectRoot;

    if (options.yes) {
        console.log(chalk.yellow('⚡ Modo: No interactivo'));
        targetIdes = IDE_CONFIGS.filter(ide =>
            ide.value !== 'custom' && (fs.existsSync(path.join(projectRoot, ide.rulesDir ? ide.rulesDir.split('/')[0] : '')) || (ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile))))
        );
        if (targetIdes.length === 0 && options.force) {
            targetIdes = [IDE_CONFIGS.find(i => i.value === 'cursor')];
        }
        selectedSkills = getAllItems(SOURCE_SKILLS, true);
        selectedRules = getAllItems(SOURCE_RULES, false);
        selectedWorkflows = getAllItems(SOURCE_WORKFLOWS, false);
    } else {
        console.log(chalk.gray('================================================================'));
        console.log(chalk.cyan('🔹 Configuración de Instalación'));
        console.log(chalk.gray('================================================================'));

        const targetAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'target',
                message: '¿Dónde quieres instalar los artefactos?',
                choices: [
                    { name: 'En este Proyecto (./) (Recomendado)', value: 'project' },
                    { name: 'En mi Usuario / Global IDE Config (~/) (No Recomendado - Sin Contexto)', value: 'user' }
                ]
            }
        ]);
        installTarget = targetAnswer.target;
        targetRoot = (installTarget === 'user') ? userHome : projectRoot;

        console.log('');
        const methodAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'method',
                message: 'Método de Instalación:',
                choices: [
                    { name: 'Symlink (Recomendado - Live Updates)', value: 'symlink' },
                    { name: 'Copia Física (Archivos independientes)', value: 'copy' }
                ],
                default: 'symlink'
            }
        ]);
        installMethod = methodAnswer.method;

        console.log('');
        console.log(chalk.gray('--- Selección de Agentes ---'));
        const ideAnswer = await inquirer.prompt([{
            type: 'checkbox',
            name: 'ides',
            message: `¿En qué Agentes/IDEs quieres instalar? (Target: ${installTarget === 'project' ? 'Project' : 'User Home'})`,
            choices: IDE_CONFIGS.map(ide => {
                const searchPath = ide.rulesDir ? path.join(targetRoot, ide.rulesDir.split('/')[0]) : null;
                const detected = searchPath && fs.existsSync(searchPath);
                const markerDetected = ide.markerFile && fs.existsSync(path.join(targetRoot, ide.markerFile));

                return {
                    name: ide.name + ((detected || markerDetected) ? chalk.green(' (Detectado)') : ''),
                    value: ide.value,
                    checked: (detected || markerDetected)
                };
            })
        }]);

        if (ideAnswer.ides.length === 0) {
            console.log(chalk.yellow('⚠️  Ningún IDE seleccionado. Saliendo...'));
            return;
        }

        targetIdes = [];
        for (const ideValue of ideAnswer.ides) {
            if (ideValue === 'custom') {
                const customPath = await inquirer.prompt([{
                    type: 'input',
                    name: 'path',
                    message: 'Ingresa la ruta de Rules:',
                    validate: (input) => input.length > 0 ? true : 'Requerido'
                }, {
                    type: 'input',
                    name: 'skillsPath',
                    message: 'Ingresa la ruta de Skills (Opcional):'
                }, {
                    type: 'input',
                    name: 'workflowsPath',
                    message: 'Ingresa la ruta de Workflows (Opcional):'
                }]);
                targetIdes.push({
                    name: 'Custom',
                    value: 'custom',
                    rulesDir: customPath.path,
                    skillsDir: customPath.skillsPath || customPath.path,
                    workflowsDir: customPath.workflowsPath || customPath.path // fallback to rules
                });
            } else {
                targetIdes.push(IDE_CONFIGS.find(i => i.value === ideValue));
            }
        }

        const availableSkills = getAllItems(SOURCE_SKILLS, true);
        const availableRules = getAllItems(SOURCE_RULES, false);
        const availableWorkflows = getAllItems(SOURCE_WORKFLOWS, false);

        console.log('');
        console.log(chalk.gray('--- Selección de Contenido ---'));
        // Seleccionar Skills
        console.log(chalk.bold('\n🔹 Skills Disponibles:'));
        const skillsAnswer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'skills',
                message: 'Selecciona:',
                choices: availableSkills.map(s => ({ name: s, checked: true })),
                pageSize: 15
            }
        ]);
        selectedSkills = skillsAnswer.skills;

        // Seleccionar Rules
        console.log(chalk.bold('\n🔹 Reglas Disponibles:'));
        const rulesAnswer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'rules',
                message: 'Selecciona:',
                choices: availableRules.map(r => ({ name: r, checked: true })),
                pageSize: 15
            }
        ]);
        selectedRules = rulesAnswer.rules;

        // Seleccionar Workflows
        console.log(chalk.bold('\n🔹 Workflows Disponibles:'));
        const workflowsAnswer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'workflows',
                message: 'Selecciona:',
                choices: availableWorkflows.map(w => ({ name: w, checked: true })),
                pageSize: 15
            }
        ]);
        selectedWorkflows = workflowsAnswer.workflows;

        console.log('');
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: '¿Proceder con la instalación?',
            default: true
        }]);
        if (!confirm) return;
    }

    console.log('');
    for (const ide of targetIdes) {
        let currentInstallMethod = installMethod;
        if (ide.forceCopy && currentInstallMethod === 'symlink') {
            console.log(chalk.yellow(`⚠️  ${ide.name} detectado: Forzando método 'copy' (Mejor compatibilidad)`));
            currentInstallMethod = 'copy';
        }


        if (selectedSkills.length > 0 && ide.skillsDir) {
            const targetDir = path.join(targetRoot, ide.skillsDir);

            // OPTIMIZATION: If target is Global Repo, we entered "Global Sync" mode
            if (arePathsEqual(targetDir, globalSkillsDir)) {
                console.log(chalk.blue(`\n  ℹ  ${ide.name}: Skills updated via Global Sync`));
            } else {
                console.log(chalk.bold(`\nInstalling Skills to ${chalk.cyan(targetDir)}:`));

                try {
                    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                    for (const skill of selectedSkills) {
                        const srcFolder = path.join(SOURCE_SKILLS, skill);
                        const destFolder = path.join(targetDir, skill);

                        if (fs.existsSync(srcFolder)) {
                            await applyFile(srcFolder, destFolder, currentInstallMethod);
                            console.log(`  ${chalk.green('✔')} ${skill}/`);
                        }
                    }
                } catch (e) {
                    console.error(chalk.red(`❌ Error installing skills for ${ide.name}: ${e.message}`));
                }
            }
        }

        // 4. Generate/Update Global Config File (Bootstrap)
        let bootstrapStatus = 'SKIP';
        if (ide.configFile) {
            // Safety: Don't inject Markdown into JSON/YAML
            if (ide.configFile.endsWith('.json') || ide.configFile.endsWith('.yaml') || ide.configFile.endsWith('.yml')) {
                // console.log(chalk.gray(`  ℹ Skipping bootstrap for ${ide.name} (Structured Config)`));
                bootstrapStatus = 'SKIP';
            } else {
                const configPath = path.join(targetRoot, ide.configFile);
                const relativeRulesPath = getRelLink(ide.configFile, '.agents/rules/00-master.md');
                const relativeCatalogPath = getRelLink(ide.configFile, 'AGENTS.md');
                const relativeContextPath = getRelLink(ide.configFile, 'CLAUDE.md');

                // console.log(chalk.bold(`\nConfiguring ${ide.name} auto-detect:`));
                try {
                    let content = `
# 🤖 LMAgent Framework v3.0.0
> Contexto Activo: Este proyecto utiliza el estándar LMAgent V3.

## 🚨 SOURCE OF TRUTH (CEREBRO)
**TU CONTEXTO Y REGLAS VIVEN AQUÍ 👉 [AGENTS.md](${relativeCatalogPath})**
*Lee este archivo INMEDIATAMENTE para obtener tu identidad, skills y reglas operativas.*

## ⚡ QUICK START TRIGGERS (Menu Rápido)
Use estos comandos para activar su rol. Para detalles, consulte \`AGENTS.md\`.

| Trigger | Rol / Skill | Objetivo |
|:--- |:--- |:--- |
| \`/orch\` | **Orchestrator** | Clasificar y delegar. |
| \`/dev\` | **Backend** | APIs y Lógica. |
| \`/front\` | **Frontend** | UI/UX, React. |
| \`/pm\` | **Product** | PRDs y Roadmap. |
| \`/fix\` | **Debugger** | Análisis de bugs. |
| \`/arch\` | **Architect** | Diseño de sistemas. |

!! SYSTEM NOTE: Read AGENTS.md to understand how to execute these roles. !!
`;
                    // If file exists, check if we need to append
                    if (fs.existsSync(configPath)) {
                        // Check if it's a directory (Edge case: Cline legacy folders)
                        if (fs.statSync(configPath).isDirectory()) {
                            console.error(chalk.red(`  ❌ Cannot bootstrap ${ide.configFile}: Is a directory.`));
                            bootstrapStatus = 'ERROR';
                        } else {
                            const existingContent = fs.readFileSync(configPath, 'utf8');
                            if (!existingContent.includes('QUICK START TRIGGERS')) {
                                fs.appendFileSync(configPath, '\n' + content);
                                bootstrapStatus = 'UPDATED';
                            } else {
                                bootstrapStatus = 'OK';
                            }
                        }
                    } else {
                        // Create parent dir if needed (for .github/copilot... etc)
                        if (!fs.existsSync(path.dirname(configPath))) fs.mkdirSync(path.dirname(configPath), { recursive: true });
                        fs.writeFileSync(configPath, content);
                        bootstrapStatus = 'CREATED';
                    }
                } catch (e) {
                    console.error(chalk.red(`  ❌ Error bootstrapping ${ide.name}: ${e.message}`));
                    bootstrapStatus = 'ERROR';
                }
            }
        }

        if (bootstrapStatus !== 'SKIP' && bootstrapStatus !== 'OK') {
            console.log(`  ${bootstrapStatus === 'CREATED' ? chalk.green('✔') : chalk.blue('ℹ')} ${ide.name} Bootstrap: ${bootstrapStatus}`);
        }

        // 4.1 Generate Bridge Rule if supported
        const bridgeFile = ide.bridgeFile || 'lmagent.md';
        if (ide.rulesDir && bridgeFile) {
            const bridgePath = path.join(targetRoot, ide.rulesDir, bridgeFile);
            const relativeBridgeToRoot = path.join(ide.rulesDir, bridgeFile);
            const relContext = getRelLink(relativeBridgeToRoot, 'CLAUDE.md');
            const relCatalog = getRelLink(relativeBridgeToRoot, 'AGENTS.md');
            const relRules = getRelLink(relativeBridgeToRoot, '.agents/rules/00-master.md');

            let bridgeContent = '';

            if (bridgeFile.endsWith('.mdc')) {
                // Cursor MDC Format
                bridgeContent = `---
description: LMAgent Framework Entry Point - Use this rule to understand how to interact with the project skills and rules.
globs: **/*
---

# 🤖 LMAgent Bridge Rule

Este proyecto está potenciado por **LMAgent v3.0.0**.

## 🚨 SOURCE OF TRUTH (CEREBRO)
**TU CONTEXTO Y REGLAS VIVEN AQUÍ 👉 [AGENTS.md](${relCatalog})**
*Lee este archivo INMEDIATAMENTE para obtener tu identidad, skills y reglas operativas.*

## ⚡ QUICK START TRIGGERS (Menu Rápido)
Use estos comandos para activar su rol. Para detalles, consulte \`AGENTS.md\`.

| Trigger | Rol / Skill | Objetivo |
|:--- |:--- |:--- |
| \`/orch\` | **Orchestrator** | Clasificar y delegar. |
| \`/dev\` | **Backend** | APIs y Lógica. |
| \`/front\` | **Frontend** | UI/UX, React. |
| \`/pm\` | **Product** | PRDs y Roadmap. |
| \`/fix\` | **Debugger** | Análisis de bugs. |
| \`/arch\` | **Architect** | Diseño de sistemas. |

!! SYSTEM NOTE: Read AGENTS.md to understand how to execute these roles. !!
`;
            } else {
                // Standard Markdown (Universal & Cline/Windsurf)
                bridgeContent = `# 🤖 LMAgent Framework Entry Point

Este proyecto utiliza **LMAgent v3.0.0**.

## 🚨 SOURCE OF TRUTH (CEREBRO)
**TU CONTEXTO Y REGLAS VIVEN AQUÍ 👉 [AGENTS.md](${relCatalog})**
*Lee este archivo INMEDIATAMENTE para obtener tu identidad, skills y reglas operativas.*

## ⚡ QUICK START TRIGGERS (Menu Rápido)
Use estos comandos para activar su rol. Para detalles, consulte \`AGENTS.md\`.

| Trigger | Rol / Skill | Objetivo |
|:--- |:--- |:--- |
| \`/orch\` | **Orchestrator** | Clasificar y delegar. |
| \`/dev\` | **Backend** | APIs y Lógica. |
| \`/front\` | **Frontend** | UI/UX, React. |
| \`/pm\` | **Product** | PRDs y Roadmap. |
| \`/fix\` | **Debugger** | Análisis de bugs. |
| \`/arch\` | **Architect** | Diseño de sistemas. |
`;
            }

            try {
                if (!fs.existsSync(path.dirname(bridgePath))) fs.mkdirSync(path.dirname(bridgePath), { recursive: true });
                fs.writeFileSync(bridgePath, bridgeContent);
                console.log(`  ${chalk.green('✔')} ${ide.name} Bridge Rule: ${bridgeFile}`);
            } catch (e) {
                console.error(chalk.red(`  ❌ Error creating bridge for ${ide.name}: ${e.message}`));
            }
        }
        // 2. Install RULES (Files)
        if (selectedRules.length > 0 && ide.rulesDir) {
            const targetDir = path.join(targetRoot, ide.rulesDir);

            // OPTIMIZATION: If target is Global Repo, skip redundant copy
            if (arePathsEqual(targetDir, globalRulesDir)) {
                console.log(chalk.blue(`  ℹ  ${ide.name}: Rules updated via Global Sync`));
            } else {
                console.log(chalk.bold(`\nInstalling Rules to ${chalk.cyan(targetDir)}:`));

                try {
                    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });


                    // CLEANUP: Remove legacy rules (V2)
                    const legacyRules = ['_bootstrap.md', '_bootstrap.mdc', '00-bootstrap.md'];
                    for (const legacy of legacyRules) {
                        const legacyPath = path.join(targetDir, legacy);
                        if (fs.existsSync(legacyPath)) {
                            fs.unlinkSync(legacyPath);
                            console.log(`  ${chalk.yellow('🗑  Eliminado regla obsoleta:')} ${legacy}`);
                        }
                    }

                    for (const rule of selectedRules) {
                        const srcVal = path.join(SOURCE_RULES, rule);
                        const destVal = path.join(targetDir, rule);

                        if (fs.existsSync(srcVal)) {
                            await applyFile(srcVal, destVal, currentInstallMethod);
                            console.log(`  ${chalk.blue('✔')} ${rule}`);
                        }
                    }
                } catch (e) {
                    console.error(chalk.red(`❌ Error installing rules for ${ide.name}: ${e.message}`));
                }
            }
        }

        // 3. Install WORKFLOWS (Files)
        if (selectedWorkflows.length > 0 && ide.workflowsDir) {
            const targetDir = path.join(targetRoot, ide.workflowsDir);

            // OPTIMIZATION: If target is Global Repo, skip redundant copy
            if (arePathsEqual(targetDir, globalWorkflowsDir)) {
                console.log(chalk.blue(`  ℹ  ${ide.name}: Workflows updated via Global Sync`));
            } else {
                console.log(chalk.bold(`\nInstalling Workflows to ${chalk.cyan(targetDir)}:`));

                try {
                    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                    for (const wf of selectedWorkflows) {
                        const srcVal = path.join(SOURCE_WORKFLOWS, wf);
                        const destVal = path.join(targetDir, wf);

                        if (fs.existsSync(srcVal)) {
                            await applyFile(srcVal, destVal, currentInstallMethod);
                            console.log(`  ${chalk.magenta('✔')} ${wf}`);
                        }
                    }
                } catch (e) {
                    console.error(chalk.red(`❌ Error installing workflows for ${ide.name}: ${e.message}`));
                }
            }
        }
    }
    console.log(gradient.pastel.multiline('\n✨ Instalación Finalizada ✨'));

    console.log(chalk.gray('================================================================'));
    console.log(chalk.bold.green('🎉 ¡Todo listo! Aquí tienes cómo usar tus nuevos superpoderes:'));
    console.log('');
    console.log(chalk.cyan('🤖  Para Cursor / Windsurf / Trae:'));
    console.log(chalk.white('    1. Tus skills aparecen como Reglas (.cursorrules, etc.)'));
    console.log(chalk.white('    2. En el Chat (Ctrl+L) o Composer (Ctrl+I), simplemente pídelo.'));
    console.log(chalk.gray('       Ej: "Crea un nuevo componente de React" (El agente usará frontend-engineer automáticamente)'));
    console.log('');
    console.log(chalk.magenta('🧠  Para Antigravity / Claude Code / Agentes Autónomos:'));
    console.log(chalk.white('    1. El agente lee automáticamente tu carpeta .agent/ o configuración local.'));
    console.log(chalk.white('    2. Escribe tu petición en lenguaje natural.'));
    console.log(chalk.gray('       Ej: "Analiza la base de datos" (El agente buscará y usará backend-engineer/data-engineer)'));
    console.log(chalk.gray('================================================================'));
}

async function applyFile(source, dest, method) {
    const srcPath = path.resolve(source);
    const destPath = path.resolve(dest);

    // Case-insensitive check for Windows compatibility
    if (srcPath.toLowerCase() === destPath.toLowerCase()) {
        // console.log(chalk.gray(`    (Skipping self-install: ${path.basename(source)})`));
        return;
    }
    if (fs.existsSync(dest) || (fs.existsSync(path.dirname(dest)) && fs.readdirSync(path.dirname(dest)).includes(path.basename(dest)))) {
        try {
            const stat = fs.statSync(dest);
            if (stat.isDirectory()) {
                fs.rmSync(dest, { recursive: true, force: true });
            } else {
                fs.unlinkSync(dest);
            }
        } catch (e) { }
    }

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const srcStat = fs.statSync(source);
    const isDir = srcStat.isDirectory();

    if (method === 'symlink') {
        try {
            const type = isDir ? 'junction' : 'file';
            fs.symlinkSync(source, dest, type);
        } catch (e) {
            try {
                if (isDir) {
                    copyRecursiveSync(source, dest, true);
                } else {
                    fs.copyFileSync(source, dest);
                }
                const isWindows = os.platform() === 'win32';
                const msg = isWindows && !isDir
                    ? `(Symlink falló [Requiere Admin/DevMode en Win]. Copiado.)`
                    : `(Symlink falló, se usó copia)`;
                console.log(chalk.yellow(`    ${msg}`));
            } catch (err) {
                console.error(chalk.red(`    Error copiando ${path.basename(dest)}: ${err.message}`));
            }
        }
    } else {
        if (isDir) {
            copyRecursiveSync(source, dest, true);
        } else {
            fs.copyFileSync(source, dest);
        }
    }
}

function copyRecursiveSync(src, dest, overwrite) {
    if (fs.cpSync) {
        try {
            fs.cpSync(src, dest, { recursive: true, force: overwrite, errorOnExist: false });
        } catch (e) {
            console.error(chalk.red(`Error copying (cpSync) ${path.basename(src)}: ${e.message}`));
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

// ============================================
// INIT: Inicializar proyecto con LMAgent
// ============================================

async function runInit(options) {
    let targetIdes = []; // Initialize targetIdes
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                                      by QuBit\n'));

    const projectRoot = process.cwd();
    const targetRoot = projectRoot; // Fix for ReferenceError in runInit
    console.log(chalk.cyan(`📦 Inicializando proyecto LMAgent en: ${chalk.bold(projectRoot)}\n`));

    // Verificar si ya está inicializado
    const agentsExists = fs.existsSync(path.join(projectRoot, 'AGENTS.md'));
    if (agentsExists && !options.force) {
        console.log(chalk.yellow('⚠️  Este proyecto ya tiene AGENTS.md'));
        if (!options.yes) {
            const { overwrite } = await inquirer.prompt([{
                type: 'confirm',
                name: 'overwrite',
                message: '¿Sobrescribir archivos existentes?',
                default: false
            }]);
            if (!overwrite) {
                console.log(chalk.yellow('Cancelado. Usa --force para forzar.'));
                return;
            }
        }
    }

    let filesToCopy = [...INIT_FILES];
    let dirsToCopy = [...INIT_DIRS];

    // Modo interactivo: preguntar qué copiar
    if (!options.yes) {
        const answers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'files',
                message: 'Archivos de entry point a copiar:',
                choices: INIT_FILES.map(f => ({
                    name: `${f.src} - ${f.desc}`,
                    value: f.src,
                    checked: true
                }))
            },
            {
                type: 'checkbox',
                name: 'dirs',
                message: 'Directorios a copiar:',
                choices: INIT_DIRS.map(d => ({
                    name: `${d.src}/ - ${d.desc}`,
                    value: d.src,
                    checked: true
                }))
            }
        ]);
        dirsToCopy = INIT_DIRS.filter(d => answers.dirs.includes(d.src));

        // Seleccionar IDE para destino de archivos
        console.log('');
        const ideAnswer = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'ides',
                message: 'Selecciona tu IDE principal (para ubicar las carpetas):',
                choices: IDE_CONFIGS.filter(i => i.value !== 'custom').map(i => ({
                    name: i.name,
                    value: i.value,
                    checked: i.value === 'cursor'
                }))
            }
        ]);
        targetIdes = IDE_CONFIGS.filter(i => ideAnswer.ides.includes(i.value));
    } else {
        // Defaults for non-interactive
        targetIdes = [IDE_CONFIGS.find(i => i.value === 'cursor')];
    }

    // Copiar archivos del framework a la carpeta del Agente (Clean Root)
    console.log(chalk.bold('\n📦 Instalando framework en directorios de Agente:'));

    for (const ide of targetIdes) {
        if (!ide.skillsDir) continue; // Skip custom/manual if no dir defined

        // Determinar "Agent Root" (ej: .cursor/ o .github/)
        // Asume que skillsDir es "root/skills", así que dirname obtiene "root"
        const agentRootDir = path.join(targetRoot, path.dirname(ide.skillsDir));

        console.log(chalk.dim(`   Destino: ${agentRootDir}`));

        // Crear directorio root si no existe
        if (!fs.existsSync(agentRootDir)) fs.mkdirSync(agentRootDir, { recursive: true });

        // Copiar Archivos (AGENTS.md, CLAUDE.md van a root)
        for (const file of filesToCopy) {
            if (file.src === 'CLAUDE.md' || file.src === 'AGENTS.md') {
                // Se copian a projectRoot para visibilidad inmediata
                const dest = path.join(projectRoot, file.src);
                if (fs.existsSync(path.join(__dirname, file.src))) {
                    fs.copyFileSync(path.join(__dirname, file.src), dest);
                    console.log(`   ${chalk.green('✔')} ${file.src} (Project Root)`);
                }
                continue;
            }

            const src = path.join(__dirname, file.src);
            const dest = path.join(agentRootDir, file.src);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                console.log(`   ${chalk.green('✔')} ${file.src} -> ${path.dirname(ide.skillsDir)}/${file.src}`);
            }
        }

        // Copiar Directorios (docs, config, templates)
        for (const dir of dirsToCopy) {
            const src = path.join(__dirname, dir.src);
            const dest = path.join(agentRootDir, dir.src);
            if (fs.existsSync(src)) {
                copyRecursiveSync(src, dest, true); // Force overwrite
                console.log(`   ${chalk.green('✔')} ${dir.src}/ -> ${path.dirname(ide.skillsDir)}/${dir.src}/`);

                // CLEANUP: If docs, remove assets (legacy logo, etc.)
                if (dir.src === 'docs') {
                    const assetsDir = path.join(dest, 'assets');
                    if (fs.existsSync(assetsDir)) {
                        try {
                            fs.rmSync(assetsDir, { recursive: true, force: true });
                            console.log(`   ${chalk.yellow('🗑  Eliminado assets heredados (logo, etc.)')}`);
                        } catch (e) { }
                    }
                }
            }
        }
    }

    // Crear .env.example si no existe
    const envExampleDest = path.join(projectRoot, '.env.example');
    if (!fs.existsSync(envExampleDest)) {
        const envContent = `# ============================================
# LMAgent Project - Environment Variables
# ============================================
# Copiar este archivo a .env y completar los valores

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=change-this-to-a-strong-secret-minimum-32-characters

# LLM API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...

# n8n (si aplica)
N8N_WEBHOOK_URL=https://n8n.yourserver.com/webhook

# Environment
ENVIRONMENT=development
DEBUG=true
`;
        fs.writeFileSync(envExampleDest, envContent);
        console.log(`  ${chalk.green('✔')} .env.example ${chalk.green('(nuevo)')}`);
    } else {
        console.log(`  ${chalk.blue('ℹ')} .env.example ya existe, no se sobrescribe`);
    }

    // Resumen
    console.log(gradient.pastel.multiline('\n✨ Proyecto inicializado con LMAgent v3.0.0 ✨'));
    console.log('');
    console.log(chalk.cyan('Próximos pasos:'));
    console.log(`  1. ${chalk.bold('lmagent install')} - Instalar skills/rules/workflows en tu IDE`);
    console.log(`  2. Editar ${chalk.bold('.env.example')} → ${chalk.bold('.env')} con tus credenciales`);
    console.log(`  3. Leer ${chalk.bold('AGENTS.md')} para conocer las capacidades disponibles`);
    console.log('');

    // Preguntar si quiere ejecutar install también
    if (!options.yes) {
        const { runInstallNow } = await inquirer.prompt([{
            type: 'confirm',
            name: 'runInstallNow',
            message: '¿Ejecutar lmagent install ahora para conectar al IDE?',
            default: true
        }]);
        if (runInstallNow) {
            console.log('');
            await runInstall(options);
        }
    } else {
        console.log(chalk.cyan('💡 Ejecuta `lmagent install` para conectar al IDE.\n'));
    }
}

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
            console.log(`  ${chalk.red('✘')} ${file.src} - ${chalk.red('FALTANTE')} → ejecuta ${chalk.bold('lmagent init')}`);
            issues++;
        }
    }

    // 2. Directorios de configuración
    console.log(chalk.bold('\n📁 Configuración:'));
    for (const dir of INIT_DIRS) {
        const exists = fs.existsSync(path.join(projectRoot, dir.src));
        if (exists) {
            console.log(`  ${chalk.green('✔')} ${dir.src}/`);
            ok++;
        } else {
            console.log(`  ${chalk.yellow('⚠')} ${dir.src}/ - Opcional, ejecuta ${chalk.bold('lmagent init')} para copiar`);
        }
    }

    // 3. Detectar IDEs configurados
    console.log(chalk.bold('\n🔧 IDEs detectados:'));
    let ideFound = false;
    for (const ide of IDE_CONFIGS) {
        if (ide.value === 'custom') continue;
        const rulesExist = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
        const skillsExist = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
        const markerExist = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));

        if (rulesExist || skillsExist || markerExist) {
            ideFound = true;
            const parts = [];
            if (rulesExist) parts.push('rules');
            if (skillsExist) parts.push('skills');
            console.log(`  ${chalk.green('✔')} ${ide.name} (${parts.join(', ')})`);
            ok++;

            // Verificar que tiene los skills correctos
            if (skillsExist) {
                const installedSkills = fs.readdirSync(path.join(projectRoot, ide.skillsDir))
                    .filter(item => fs.statSync(path.join(projectRoot, ide.skillsDir, item)).isDirectory());

                // Calcular skills esperados dinámicamente
                const expectedSkillsCount = getAllItems(PACKAGE_SKILLS_DIR, true).length;
                const skillCount = installedSkills.length;

                if (skillCount < expectedSkillsCount) {
                    console.log(`    ${chalk.yellow('⚠')} Solo ${skillCount}/${expectedSkillsCount} skills instalados → ejecuta ${chalk.bold('lmagent install')}`);
                } else {
                    console.log(`    ${chalk.green('✔')} ${skillCount} skills instalados`);
                }
            }
        }
    }
    if (!ideFound) {
        console.log(`  ${chalk.red('✘')} Ningún IDE detectado → ejecuta ${chalk.bold('lmagent install')}`);
        issues++;
    }

    // 4. Verificar .env
    console.log(chalk.bold('\n🔒 Seguridad:'));
    const envExists = fs.existsSync(path.join(projectRoot, '.env'));
    const envExampleExists = fs.existsSync(path.join(projectRoot, '.env.example'));
    const gitignoreExists = fs.existsSync(path.join(projectRoot, '.gitignore'));

    if (envExampleExists) {
        console.log(`  ${chalk.green('✔')} .env.example existe`);
        ok++;
    } else {
        console.log(`  ${chalk.yellow('⚠')} .env.example no encontrado`);
    }

    if (envExists) {
        console.log(`  ${chalk.green('✔')} .env existe`);
        ok++;
    } else {
        console.log(`  ${chalk.yellow('⚠')} .env no encontrado (necesario para ejecutar)`);
    }

    if (gitignoreExists) {
        const gitignore = fs.readFileSync(path.join(projectRoot, '.gitignore'), 'utf-8');
        if (gitignore.includes('.env')) {
            console.log(`  ${chalk.green('✔')} .env está en .gitignore`);
            ok++;
        } else {
            console.log(`  ${chalk.red('✘')} .env NO está en .gitignore → ${chalk.red('RIESGO DE SEGURIDAD')}`);
            issues++;
        }
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


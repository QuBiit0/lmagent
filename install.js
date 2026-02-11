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
const PACKAGE_SKILLS_DIR = path.join(__dirname, 'skills');
const PACKAGE_RULES_DIR = path.join(__dirname, 'rules');
const PACKAGE_WORKFLOWS_DIR = path.join(__dirname, 'workflows');
const PACKAGE_CONFIG_DIR = path.join(__dirname, 'config');
const PACKAGE_TEMPLATES_DIR = path.join(__dirname, 'templates');
const PACKAGE_DOCS_DIR = path.join(__dirname, 'docs');

// Archivos de proyecto que init copia a la raíz
const INIT_FILES = [
    { src: 'CLAUDE.md', desc: 'Instrucciones para Claude Code' },
    { src: 'AGENTS.md', desc: 'Catálogo de capacidades LMAgent' },
];

const INIT_DIRS = [
    { src: 'config', desc: 'Configuración del framework' },
    { src: 'templates', desc: 'Templates de proyecto' },
    { src: 'docs', desc: 'Documentación extendida' },
];

// Configuración: IDEs soportados
const IDE_CONFIGS = [
    {
        name: 'Cursor',
        value: 'cursor',
        rulesDir: '.cursor/rules',
        skillsDir: '.cursor/skills',
        workflowsDir: '.cursor/workflows', // New
        markerFile: '.cursorrules'
    },
    {
        name: 'Windsurf',
        value: 'windsurf',
        rulesDir: '.windsurf/rules',
        skillsDir: '.windsurf/skills',
        workflowsDir: '.windsurf/workflows', // New
        markerFile: '.windsurf'
    },
    {
        name: 'VSCode / Copilot',
        value: 'vscode',
        rulesDir: '.github/instructions',
        skillsDir: '.github/skills',
        workflowsDir: '.github/agent-workflows', // Avoid conflict with CI/CD
        markerFile: '.vscode'
    },
    {
        name: 'Claude Code',
        value: 'claude',
        rulesDir: '.claude/rules',
        skillsDir: '.claude/skills',
        workflowsDir: '.claude/workflows',
        markerFile: '.claude'
    },
    {
        name: 'Cline / Roo Code',
        value: 'cline',
        rulesDir: '.clinerules',
        skillsDir: '.clineskills',
        workflowsDir: '.clineworkflows',
        markerFile: '.clinerules'
    },
    {
        name: 'Trae',
        value: 'trae',
        rulesDir: '.trae/rules',
        skillsDir: '.trae/skills',
        workflowsDir: '.trae/workflows',
        markerFile: '.trae'
    },
    {
        name: 'Continue',
        value: 'continue',
        rulesDir: '.continue/rules',
        skillsDir: '.continue/skills',
        workflowsDir: '.continue/workflows',
        markerFile: '.continue'
    },
    {
        name: 'Zed',
        value: 'zed',
        rulesDir: '.rules',
        skillsDir: '.rules/skills',
        workflowsDir: '.rules/workflows',
        markerFile: '.zed'
    },
    {
        name: 'Qodo',
        value: 'qodo',
        rulesDir: 'agents',
        skillsDir: 'agents/skills',
        workflowsDir: 'agents/workflows',
        markerFile: 'agent.toml'
    },
    {
        name: 'Antigravity',
        value: 'antigravity',
        rulesDir: '.antigravity/rules',
        skillsDir: '.antigravity/skills',
        workflowsDir: '.antigravity/workflows',
        markerFile: '.antigravity'
    },
    {
        name: 'Custom Path',
        value: 'custom',
        rulesDir: '',
        skillsDir: '',
        workflowsDir: '',
        markerFile: ''
    }
];

program
    .name('lmagent-skills')
    .description('CLI para instalar skills y reglas de LMAgent')
    .version('2.3.0'); // Version bump

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

if (process.argv.length === 2) {
    runInstall({});
} else {
    program.parse();
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
        console.log(chalk.cyan('🔹 Configuración de Instalación'));

        const targetAnswer = await inquirer.prompt([
            {
                type: 'list',
                name: 'target',
                message: '¿Dónde quieres instalar los artefactos?',
                choices: [
                    { name: 'En mi Usuario / Global IDE Config (~/) (Recomendado)', value: 'user' },
                    { name: 'En este Proyecto (./)', value: 'project' }
                ]
            }
        ]);
        installTarget = targetAnswer.target;
        targetRoot = (installTarget === 'user') ? userHome : projectRoot;

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

        const contentAnswers = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'skills',
                message: 'Selecciona los Skills:',
                choices: availableSkills.map(s => ({ name: s, checked: true })),
                pageSize: 15
            },
            {
                type: 'checkbox',
                name: 'rules',
                message: 'Selecciona las Reglas:',
                choices: availableRules.map(r => ({ name: r, checked: true })),
                pageSize: 15
            },
            {
                type: 'checkbox',
                name: 'workflows',
                message: 'Selecciona los Workflows:',
                choices: availableWorkflows.map(w => ({ name: w, checked: true })),
                pageSize: 15
            }
        ]);
        selectedSkills = contentAnswers.skills;
        selectedRules = contentAnswers.rules;
        selectedWorkflows = contentAnswers.workflows;

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

        // 1. Install SKILLS (Folders)
        if (selectedSkills.length > 0 && ide.skillsDir) {
            const targetDir = path.join(targetRoot, ide.skillsDir);
            console.log(chalk.bold(`\nInstalling Skills to ${chalk.cyan(targetDir)}:`));

            try {
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                for (const skill of selectedSkills) {
                    const srcFolder = path.join(SOURCE_SKILLS, skill);
                    const destFolder = path.join(targetDir, skill);

                    if (fs.existsSync(srcFolder)) {
                        await applyFile(srcFolder, destFolder, installMethod);
                        console.log(`  ${chalk.green('✔')} ${skill}/`);
                    }
                }
            } catch (e) {
                console.error(chalk.red(`❌ Error installing skills for ${ide.name}: ${e.message}`));
            }
        }

        // 2. Install RULES (Files)
        if (selectedRules.length > 0 && ide.rulesDir) {
            const targetDir = path.join(targetRoot, ide.rulesDir);
            console.log(chalk.bold(`\nInstalling Rules to ${chalk.cyan(targetDir)}:`));

            try {
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                for (const rule of selectedRules) {
                    const srcVal = path.join(SOURCE_RULES, rule);
                    const destVal = path.join(targetDir, rule);

                    if (fs.existsSync(srcVal)) {
                        await applyFile(srcVal, destVal, installMethod);
                        console.log(`  ${chalk.blue('✔')} ${rule}`);
                    }
                }
            } catch (e) {
                console.error(chalk.red(`❌ Error installing rules for ${ide.name}: ${e.message}`));
            }
        }

        // 3. Install WORKFLOWS (Files)
        if (selectedWorkflows.length > 0 && ide.workflowsDir) {
            const targetDir = path.join(targetRoot, ide.workflowsDir);
            console.log(chalk.bold(`\nInstalling Workflows to ${chalk.cyan(targetDir)}:`));

            try {
                if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                for (const wf of selectedWorkflows) {
                    const srcVal = path.join(SOURCE_WORKFLOWS, wf);
                    const destVal = path.join(targetDir, wf);

                    if (fs.existsSync(srcVal)) {
                        await applyFile(srcVal, destVal, installMethod);
                        console.log(`  ${chalk.magenta('✔')} ${wf}`);
                    }
                }
            } catch (e) {
                console.error(chalk.red(`❌ Error installing workflows for ${ide.name}: ${e.message}`));
            }
        }
    }
    console.log(gradient.pastel.multiline('\n✨ Instalación Finalizada ✨'));
}

async function applyFile(source, dest, method) {
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

function getAllItems(dir, isNested) {
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);
    if (isNested) {
        return items.filter(item => {
            const p = path.join(dir, item);
            return fs.statSync(p).isDirectory() && (
                fs.existsSync(path.join(p, 'SKILL.md')) ||
                fs.readdirSync(p).length > 0
            );
        });
    } else {
        return items.filter(item => item.endsWith('.md') || item.endsWith('.txt') || item.endsWith('.cursorrules') || item.endsWith('.toml'));
    }
}

// ============================================
// INIT: Inicializar proyecto con LMAgent
// ============================================

async function runInit(options) {
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                                      by QuBit\n'));

    const projectRoot = process.cwd();
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
        filesToCopy = INIT_FILES.filter(f => answers.files.includes(f.src));
        dirsToCopy = INIT_DIRS.filter(d => answers.dirs.includes(d.src));
    }

    // Copiar archivos individuales
    console.log(chalk.bold('\n📄 Copiando archivos de proyecto:'));
    for (const file of filesToCopy) {
        const src = path.join(__dirname, file.src);
        const dest = path.join(projectRoot, file.src);
        if (fs.existsSync(src)) {
            const exists = fs.existsSync(dest);
            fs.copyFileSync(src, dest);
            console.log(`  ${chalk.green('✔')} ${file.src} ${exists ? chalk.yellow('(actualizado)') : chalk.green('(nuevo)')}`);
        } else {
            console.log(`  ${chalk.red('✘')} ${file.src} ${chalk.red('(no encontrado en el paquete)')}`);
        }
    }

    // Copiar directorios
    console.log(chalk.bold('\n📁 Copiando directorios:'));
    for (const dir of dirsToCopy) {
        const src = path.join(__dirname, dir.src);
        const dest = path.join(projectRoot, dir.src);
        if (fs.existsSync(src)) {
            const exists = fs.existsSync(dest);
            copyRecursiveSync(src, dest, true);
            const itemCount = getAllItemsFlat(src).length;
            console.log(`  ${chalk.green('✔')} ${dir.src}/ (${itemCount} archivos) ${exists ? chalk.yellow('(actualizado)') : chalk.green('(nuevo)')}`);
        } else {
            console.log(`  ${chalk.red('✘')} ${dir.src}/ ${chalk.red('(no encontrado en el paquete)')}`);
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
    console.log(gradient.pastel.multiline('\n✨ Proyecto inicializado con LMAgent v2.3.0 ✨'));
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
                const skillCount = fs.readdirSync(path.join(projectRoot, ide.skillsDir))
                    .filter(item => fs.statSync(path.join(projectRoot, ide.skillsDir, item)).isDirectory()).length;
                if (skillCount < 21) {
                    console.log(`    ${chalk.yellow('⚠')} Solo ${skillCount}/21 skills instalados → ejecuta ${chalk.bold('lmagent install')}`);
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

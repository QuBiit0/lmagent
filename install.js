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
const PACKAGE_WORKFLOWS_DIR = path.join(__dirname, 'workflows'); // New: Workflows

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
    .description('Instalar skills en el proyecto actual')
    .option('-f, --force', 'Forzar instalación')
    .option('-y, --yes', 'Instalar todo sin preguntar')
    .action((options) => {
        runInstall(options);
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

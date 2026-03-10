const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const gradient = require('gradient-string');
const figlet = require('figlet');

const {
    PKG_VERSION,
    ROOT_DIR,
    PACKAGE_SKILLS_DIR,
    PACKAGE_RULES_DIR,
    PACKAGE_WORKFLOWS_DIR,
    PACKAGE_CONFIG_DIR,
    PACKAGE_TEMPLATES_DIR,
    PACKAGE_DOCS_DIR,
    PACKAGE_MEMORY_DIR,
    INIT_FILES,
    CORE_DIRS
} = require('../core/constants.js');
const { detectGlobalAgents } = require('../core/ide-registry.js');
const { copyRecursiveSync, getAllItems, getAllItemsFlat, getRelLink } = require('../utils/file-system.js');
const IDE_REGISTRY = require('../core/ide-registry.json');
const IDE_CONFIGS = IDE_REGISTRY;

function arePathsEqual(p1, p2) {
    if (!p1 || !p2) return false;
    return path.resolve(p1).toLowerCase() === path.resolve(p2).toLowerCase();
}

// Helper to deploy AGENTS.md, CLAUDE.md y GEMINI.md to project root
// Los archivos con versionTemplate:true tienen {{VERSION}} que se reemplaza dinámicamente
async function deployCorePillars(options, projectRoot) {
    console.log(chalk.bold('\n🚀 Desplegando Pilares de Inteligencia (Contexto Root):'));
    for (const file of INIT_FILES) {
        const srcPath = path.join(ROOT_DIR, file.src);
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

function setupSecurityFiles(projectRoot) {
    const envPath = path.join(projectRoot, '.env');
    const gitignorePath = path.join(projectRoot, '.gitignore');

    // Setup .env
    const envPlaceholder = `# LMAgent Framework Settings\nLMAGENT_API_KEY=\nOPENAI_API_KEY=\n`;
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, envPlaceholder, 'utf8');
        console.log(`  ${chalk.green('✔')} .env (Creado con placeholders secure)`);
    } else {
        const envContent = fs.readFileSync(envPath, 'utf8');
        let appendContent = '';
        if (!envContent.includes('LMAGENT_API_KEY')) appendContent += `LMAGENT_API_KEY=\n`;
        if (!envContent.includes('OPENAI_API_KEY')) appendContent += `OPENAI_API_KEY=\n`;

        if (appendContent) {
            fs.appendFileSync(envPath, `\n# LMAgent Framework Settings\n${appendContent}`, 'utf8');
            console.log(`  ${chalk.yellow('✎')} .env (Actualizado con placeholders LMAgent)`);
        }
    }

    // Setup .gitignore
    const ignoreRules = `\n# LMAgent Security\n.env\n.agents_memory/*.md\n!.agents_memory/01-global.md\n`;
    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, ignoreRules.trim() + '\n', 'utf8');
        console.log(`  ${chalk.green('✔')} .gitignore (Creado con reglas de seguridad)`);
    } else {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        if (!gitignoreContent.includes('.agents_memory')) {
            fs.appendFileSync(gitignorePath, ignoreRules, 'utf8');
            console.log(`  ${chalk.yellow('✎')} .gitignore (Actualizado con reglas de privacidad LMAgent)`);
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

    // ── PASO Seguridad: Generar / Configurar .env y .gitignore ──
    setupSecurityFiles(projectRoot);

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
    const requiredRootFiles = new Set(['AGENTS.md', 'AGENTS_CATALOG.md']);
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
                const AGENT_CONFIGS_TEMPLATE_DIR = path.join(ROOT_DIR, '.agents', 'templates', 'agent-configs');
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
                const AGENT_CONFIGS_TEMPLATE_DIR = path.join(ROOT_DIR, '.agents', 'templates', 'agent-configs');
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
                    const srcFile = path.join(ROOT_DIR, ide.configFile);
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
    return `# LMAgent Framework v${version}
> LEE [AGENTS.md](./AGENTS.md) para obtener tu contexto completo.
> Skills: .agents/skills/ | Rules: .agents/rules/ | Workflows: .agents/workflows/
`;
}

// ─── Sincronización Dinámica del Catálogo de Skills ───────────────────────────
async function syncSkillCatalog(projectRoot) {
    const skillsDir = path.join(projectRoot, '.agents', 'skills');
    if (!fs.existsSync(skillsDir)) return;

    // 1. Escanear todos los directorios de skills
    const skills = [];
    const skillDirs = fs.readdirSync(skillsDir).filter(d => {
        const p = path.join(skillsDir, d);
        return fs.statSync(p).isDirectory() &&
            (fs.existsSync(path.join(p, 'skill.yaml')) || fs.existsSync(path.join(p, 'SKILL.md')));
    });

    for (const dir of skillDirs) {
        const yamlPath = path.join(skillsDir, dir, 'skill.yaml');
        const mdPath = path.join(skillsDir, dir, 'SKILL.md');
        let content = '';

        try {
            // Prioridad v4.0: Usar skill.yaml
            if (fs.existsSync(yamlPath)) {
                content = fs.readFileSync(yamlPath, 'utf8');
            }
            // Fallback v3.x: Parsear YAML Frontmatter en SKILL.md
            else if (fs.existsSync(mdPath)) {
                const fullMd = fs.readFileSync(mdPath, 'utf8');
                const fmMatch = fullMd.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                if (fmMatch) {
                    content = fmMatch[1];
                } else {
                    continue; // Skip si no es legible
                }
            } else {
                continue; // Skip si no tiene ni YAML ni MD
            }

            const name = (content.match(/^name:\s*(.+)$/m) || [])[1]?.trim() || dir;
            let description = (content.match(/^description:\s*(.+)$/m) || [])[1]?.trim() || '';
            description = description.replace(/^["']|["']$/g, '');

            const triggersMatch = content.match(/triggers:\s*\n((?:\s+-\s*.+\n?)+)/);
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

    console.log(chalk.bold('\n[+] Sincronizando Catalogo de Skills (' + skills.length + ' skills detectados)...'));

    // 2. Generar tabla para AGENTS.md (formato: Trigger | Skill | Directorio)
    const b = '\`';
    const agentsTableLines = skills.map(s => {
        const trigger = s.triggers.length > 0 ? b + s.triggers[0] + b : b + '/' + s.slug.split('-')[0] + b;
        return '| ' + trigger + ' | **' + s.slug + '** | ' + b + '.agents/skills/' + s.slug + '/' + b + ' |';
    });

    const agentsTableContent = '| Trigger | Skill | Directorio |\n|:---|:---|:---|\n' + agentsTableLines.join('\n');

    // 3. Generar tabla para 00-master.md (formato: Skill | Triggers | Descripción)
    const masterTableLines = skills.map(s => {
        const triggerStr = s.triggers.length > 0
            ? s.triggers.map(t => b + t + b).join(', ')
            : b + '/' + s.slug.split('-')[0] + b;
        return '| **' + s.slug + '** | ' + triggerStr + ' | ' + s.description + ' |';
    });

    const masterTableContent = '| Skill | Triggers | Descripción |\n|-------|----------|-------------|\n' + masterTableLines.join('\n');

    // 4. Inyectar en AGENTS.md
    const agentsPath = path.join(projectRoot, 'AGENTS.md');
    if (fs.existsSync(agentsPath)) {
        let agentsContent = fs.readFileSync(agentsPath, 'utf8');
        const agentsRegex = /<!-- SKILLS_CATALOG_START -->[\s\S]*?<!-- SKILLS_CATALOG_END -->/;
        if (agentsRegex.test(agentsContent)) {
            const newSection = '<!-- SKILLS_CATALOG_START -->\n' + agentsTableContent + '\n<!-- SKILLS_CATALOG_END -->';
            agentsContent = agentsContent.replace(agentsRegex, newSection);
            fs.writeFileSync(agentsPath, agentsContent, 'utf8');
            console.log('  ' + chalk.green('✔') + ' AGENTS.md — Catálogo actualizado (' + skills.length + ' skills)');
        }
    }

    // 5. Inyectar en 00-master.md (buscar en project's .agents/rules/)
    const masterPath = path.join(projectRoot, '.agents', 'rules', '00-master.md');
    if (fs.existsSync(masterPath)) {
        let masterContent = fs.readFileSync(masterPath, 'utf8');
        const masterRegex = /<!-- SKILLS_CATALOG_START -->[\s\S]*?<!-- SKILLS_CATALOG_END -->/;
        if (masterRegex.test(masterContent)) {
            const newSection = '<!-- SKILLS_CATALOG_START -->\n' + masterTableContent + '\n<!-- SKILLS_CATALOG_END -->';
            masterContent = masterContent.replace(masterRegex, newSection);
            fs.writeFileSync(masterPath, masterContent, 'utf8');
            console.log('  ' + chalk.green('✔') + ' 00-master.md — Catálogo actualizado (' + skills.length + ' skills)');
        }
    }
}
module.exports = runInstall;

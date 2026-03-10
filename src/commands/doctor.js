const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');

const {
    PACKAGE_SKILLS_DIR,
    INIT_FILES,
    CORE_DIRS
} = require('../core/constants.js');

const { detectGlobalAgents } = require('../core/ide-registry.js');
const { getAllItems } = require('../utils/file-system.js');
const { IDE_CONFIGS } = require('../core/ide-registry.json'); // Wait, JSON doesn't export IDE_CONFIGS, it IS an array.

// Wait, the JSON file `ide-registry.json` is an array!
// So const IDE_CONFIGS = require('../core/ide-registry.json');
const IDE_REGISTRY = require('../core/ide-registry.json');

module.exports = async function runDoctor() {
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
    for (const ide of IDE_REGISTRY) {
        if (ide.value === 'custom' || ide.value === 'generic') continue;
        const markerExist = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
        const rulesExist = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
        const isGlobal = globalAgents.has(ide.value);
        const bridgeExists = ide.bridgeFile && ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir, ide.bridgeFile));
        const configExists = ide.configFile && fs.existsSync(path.join(projectRoot, ide.configFile));

        if (markerExist || rulesExist || isGlobal) {
            ideFound = true;
            const parts = [];
            if (isGlobal && !markerExist && !rulesExist) parts.push(chalk.blue('detectado en OS'));
            if (bridgeExists) parts.push(chalk.green('bridge ✔'));
            else if (configExists) parts.push(chalk.green('config ✔'));
            else if (!ide.bridgeFile && !ide.configFile) parts.push(chalk.green('nativo ✔'));
            else parts.push(chalk.yellow('requiere inicializar'));

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
};

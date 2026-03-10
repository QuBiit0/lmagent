#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Command } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const figlet = require('figlet');
const gradient = require('gradient-string');

const { copyRecursiveSync, getAllItems, getAllItemsFlat, getRelLink } = require('./src/utils/file-system.js');

const program = new Command();

const {
    PKG_VERSION,
    PACKAGE_SKILLS_DIR,
    PACKAGE_RULES_DIR,
    PACKAGE_WORKFLOWS_DIR,
    PACKAGE_CONFIG_DIR,
    PACKAGE_TEMPLATES_DIR,
    PACKAGE_DOCS_DIR,
    PACKAGE_MEMORY_DIR,
    INIT_FILES,
    CORE_DIRS
} = require('./src/core/constants.js');

const { detectGlobalAgents } = require('./src/core/ide-registry.js');




// IDE_CONFIGS: Lista ÚNICA y DEDUPLICADA de todos los agentes soportados
const IDE_CONFIGS = require('./src/core/ide-registry.json');


program
    .name('lmagent')
    .description('CLI para instalar skills y reglas de LMAgent')
    .version(PKG_VERSION);

program.command('init')
    .description('Inicializar proyecto e instalar skills, rules y workflows en el IDE')
    .option('-f, --force', 'Sobrescribir archivos existentes')
    .option('-y, --yes', 'No preguntar, instalar todo')
    .action((options) => {
        require('./src/commands/init.js')(options);
    });

program.command('doctor')
    .description('Verificar que el proyecto está correctamente configurado')
    .action(() => {
        require('./src/commands/doctor.js')();
    });

program.command('validate')
    .description('Validar integridad de todos los skills (frontmatter, estructura)')
    .argument('[skill]', 'Nombre parcial del skill a validar (opcional)')
    .action((skill) => {
        require('./src/commands/validate.js')(skill);
    });

program.command('create-skill')
    .description('Crear un nuevo skill interactivamente')
    .action(() => {
        require('./src/commands/create-skill.js')();
    });

program.command('tokens')
    .description('Analizar consumo de tokens del framework instalado en el proyecto')
    .option('--json', 'Salida en formato JSON')
    .option('--report', 'Generar reporte en .agents/token-report.md')
    .action((options) => {
        require('./src/commands/tokens.js')(options);
    });

program.command('skills')
    .description('Gestionar skills externos desde GitHub (compatible con el estándar skills.sh)')
    .argument('<action>', 'Acción: add')
    .argument('<source>', 'Repositorio GitHub: owner/repo o URL completa')
    .option('--skill <name>', 'Nombre específico del skill a instalar (opcional)')
    .action(async (action, source, opts) => {
        require('./src/commands/skills.js')(action, source, opts);
    });

program.command('upgrade')
    .description('Actualizar skills locales desde el repositorio oficial de LMAgent')
    .action(async () => {
        require('./src/commands/upgrade.js')();
    });

program.command('uninstall')
    .description('Eliminar todos los archivos instalados por LMAgent del proyecto')
    .option('-f, --force', 'No pedir confirmación, eliminar directamente')
    .option('--all', 'También eliminar entry points raíz (CLAUDE.md, GEMINI.md, AGENTS.md, AGENTS_CATALOG.md)')
    .action(async (options) => {
        require('./src/commands/uninstall.js')(options);
    });

// CLI entry point is handled at the bottom of the file (require.main === module)

// runInstall() Logic has been encapsulated in src/commands/init.js



program
    .command('workflow <command> [name]')
    .description('Gestionar y ejecutar workflows localmente')
    .action((cmd, name) => {
        if (cmd === 'run') {
            if (!name) {
                console.error('Error: Debes especificar el nombre del workflow a ejecutar (ej: lmagent workflow run mi-workflow)');
                process.exit(1);
            }
            require('./src/commands/workflow.js').runWorkflow(name);
        } else {
            console.error('Comando workflow no reconocido. Usa: lmagent workflow run <name>');
            process.exit(1);
        }
    });
// ============================================
// DOCTOR: Verificar configuración del proyecto
// ============================================






// Execute CLI only if run directly
if (require.main === module) {
    if (process.argv.length === 2) {
        require('./src/commands/init.js')({});
    } else {
        program.parse(process.argv);
    }
}

module.exports = { IDE_CONFIGS: require('./src/core/ide-registry.json') };

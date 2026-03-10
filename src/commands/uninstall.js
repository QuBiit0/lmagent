const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const inquirer = require('inquirer');

// Utilizando la abstracción JSON unificada
const IDE_REGISTRY = require('../core/ide-registry.json');
const { INIT_FILES, ROOT_DIR } = require('../core/constants.js');

module.exports = async function runUninstall(options) {
    console.clear();
    const branding = figlet.textSync('LMAGENT', { font: 'ANSI Shadow' });
    console.log(gradient.pastel.multiline(branding));
    console.log(gradient.cristal('                              Uninstall - Limpieza\n'));

    const projectRoot = process.cwd();

    // Safety check crucial: evitar que el framework se auto-elimine si se corre en su propio repo fuente
    if (projectRoot === ROOT_DIR) {
        console.log(chalk.red('❌ Advertencia de Seguridad: Estás intentando ejecutar uninstall dentro del repositorio fuente de LMAgent. Esta acción destruiría el código fuente. Desinstalación bloqueada.'));
        return;
    }

    // Detectar qué agentes están instalados o dejaron rastro en el proyecto
    // Al desinstalar, también incluimos 'generic' para volar .agents/
    const installedIdes = IDE_REGISTRY.filter(ide => {
        if (ide.value === 'custom') return false;
        const markerInProject = ide.markerFile && fs.existsSync(path.join(projectRoot, ide.markerFile));
        const rulesDirInProject = ide.rulesDir && fs.existsSync(path.join(projectRoot, ide.rulesDir));
        const skillsDirInProject = ide.skillsDir && fs.existsSync(path.join(projectRoot, ide.skillsDir));
        const configInProject = ide.configFile && fs.existsSync(path.join(projectRoot, ide.configFile));
        return markerInProject || rulesDirInProject || skillsDirInProject || configInProject || ide.value === 'generic';
    });

    const rootEntryFilesUrls = INIT_FILES.map(f => f.src);
    const rootEntryFiles = ['CLAUDE.md', 'GEMINI.md', '.cursorrules', '.windsurfrules', '.windsurfrules.md', '.continuerules', '.goosehints', 'openclaw.json'].concat(rootEntryFilesUrls);
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
    console.log('');
    let removed = 0;
    let errors = 0;
    const parentsToClean = new Set();

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

        // En lugar de borrar la carpeta padre (ej. .continue o .github) donde puede haber config ajena
        // borramos SOLO las carpetas hijas inyectadas (rules, skills, workflows).
        for (const dir of agentSpecificDirs) {
            if (dir && fs.existsSync(path.join(projectRoot, dir))) {
                toRemove.push({ path: path.join(projectRoot, dir), type: 'dir', label: dir + '/' });
            }
        }

        // Archivos de configuración específicos del agente (markerFile y configFile)
        if (ide.markerFile && ide.markerFile.includes('.') && fs.existsSync(path.join(projectRoot, ide.markerFile))) {
            const markerStat = fs.statSync(path.join(projectRoot, ide.markerFile));
            if (markerStat.isFile()) {
                toRemove.push({ path: path.join(projectRoot, ide.markerFile), type: 'file', label: ide.markerFile });
            }
        }

        if (ide.configFile && fs.existsSync(path.join(projectRoot, ide.configFile))) {
            const configStat = fs.statSync(path.join(projectRoot, ide.configFile));
            if (configStat.isFile()) {
                toRemove.push({ path: path.join(projectRoot, ide.configFile), type: 'file', label: ide.configFile });
            }
        }

        for (const item of toRemove) {
            try {
                if (item.type === 'dir') {
                    fs.rmSync(item.path, { recursive: true, force: true });
                } else {
                    if (fs.existsSync(item.path)) {
                        fs.unlinkSync(item.path);
                    }
                }
                console.log(`  ${chalk.red('✘')} ${ide.name}: ${chalk.gray(item.label)} eliminado`);
                removed++;

                // Si eliminamos un item, registramos su directorio padre para revisar posteriormente si quedó vacío
                parentsToClean.add(path.dirname(item.path));
            } catch (e) {
                console.error(`  ${chalk.red('❌')} Error eliminando ${item.label}: ${e.message}`);
                errors++;
            }
        }
    }

    // --- Limpieza Recursiva de Directorios Padre Vacíos ---
    // Iteramos repetidamente los 'parentsToClean' subiendo nivel a nivel hasta la raíz
    let queue = Array.from(parentsToClean);
    while (queue.length > 0) {
        let nextQueue = new Set();
        for (const parentDir of queue) {
            // Prevenir borrar la raíz del proyecto o fuera de él
            if (parentDir === projectRoot || !parentDir.startsWith(projectRoot)) continue;

            if (fs.existsSync(parentDir)) {
                try {
                    const dirContent = fs.readdirSync(parentDir);
                    if (dirContent.length === 0) {
                        fs.rmdirSync(parentDir);
                        console.log(`  ${chalk.red('✘')} ${chalk.gray(path.relative(projectRoot, parentDir) + '/')} (directorio vacío) eliminado`);
                        nextQueue.add(path.dirname(parentDir)); // Agregamos el padre del padre para la próxima iteración
                    }
                } catch (e) { } // Fallo silencioso si no se puede leer o borrar
            }
        }
        queue = Array.from(nextQueue);
    }

    // Eliminar entry points raíz si --all
    if (options.all) {
        for (const f of existingRootFiles) {
            const filePath = path.join(projectRoot, f);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log(`  ${chalk.red('✘')} ${chalk.gray(f)} eliminado`);
                    removed++;
                } catch (e) {
                    console.error(`  ${chalk.red('❌')} Error eliminando ${f}: ${e.message}`);
                    errors++;
                }
            }
        }
    }

    if (removed > 0 || options.all) {
        let msg = `\n✅ Se limpiaron exitosamente ${removed} recurso(s) de LMAgent del proyecto.`;
        if (errors > 0) msg += ` Hubo ${errors} errores omitidos.`;
        console.log(chalk.green(msg + '\n'));
        if (!options.all) {
            console.log(chalk.gray(`\nTip: Para eliminar también los docs base (GEMINI.md, AGENTS.md, etc.) usa --all\n`));
        }
    } else {
        console.log(chalk.yellow(`\n⚠️  ${removed} eliminado(s), ${errors} error(es).\n`));
    }
};

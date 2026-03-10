const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

function runWorkflow(workflowName) {
    const projectRoot = process.cwd();
    let workflowPath = path.join(projectRoot, '.agents', 'workflows', workflowName);

    // Auto-detect extension
    if (!workflowPath.endsWith('.md')) {
        workflowPath += '.md';
    }

    if (!fs.existsSync(workflowPath)) {
        console.error(chalk.red(`❌ Workflow no encontrado: ${workflowName}`));
        console.error(chalk.dim(`   Buscado en: ${workflowPath}`));
        process.exit(1);
    }

    console.log(chalk.bold.cyan(`\n🚀 Iniciando Workflow: ${workflowName}`));

    const content = fs.readFileSync(workflowPath, 'utf8');

    // Extraer frontmatter si existe para leer parametros
    let description = 'Sin descripción';
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
        const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
        if (descMatch) description = descMatch[1].replace(/^["']|["']$/g, '');
    }

    console.log(chalk.dim(`   Descripción: ${description}\n`));

    // Extraer bloques de código bash/sh/cmd
    const bashRegex = /```(?:bash|sh|cmd)\n([\s\S]*?)```/g;
    let match;
    const scripts = [];

    while ((match = bashRegex.exec(content)) !== null) {
        scripts.push(match[1].trim());
    }

    if (scripts.length === 0) {
        console.log(chalk.yellow('⚠️  Este workflow no contiene scripts ejecutables (bloques ```bash).'));
        console.log(chalk.white('   Se asume que es un workflow puramente instruccional para el LLM.'));
        process.exit(0);
    }

    console.log(chalk.bold(`Pasos ejecutables detectados: ${scripts.length}\n`));

    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        console.log(chalk.cyan(`[Paso ${i + 1}/${scripts.length}] Ejecutando script...`));
        console.log(chalk.dim(script.split('\n').map(l => '  $ ' + l).join('\n')));

        try {
            // Ejecutar sincrónicamente y mandar IO a la terminal de usuario
            execSync(script, { stdio: 'inherit', cwd: projectRoot });
            console.log(chalk.green(`✔ Paso ${i + 1} completado.\n`));
        } catch (error) {
            console.error(chalk.red(`\n❌ Error ejecutando el Paso ${i + 1}. Workflow abortado.`));
            process.exit(1);
        }
    }

    console.log(chalk.bold.green('✨ Workflow Finalizado con Éxito.'));
}

module.exports = {
    runWorkflow
};

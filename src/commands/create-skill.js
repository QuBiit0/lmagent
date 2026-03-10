const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { ROOT_DIR } = require('../core/constants.js');

module.exports = function runCreateSkill() {
    let scriptPath = path.join(ROOT_DIR, 'scripts', 'create_skill.js');
    if (!fs.existsSync(scriptPath)) {
        console.error(chalk.yellow(`⚠️  El auto-generador de skills requiere el core completo clonado.`));
        console.error(chalk.yellow(`   Manualmente puedes crear la carpeta de tu skill en .agents/skills/`));
        process.exit(1);
    }
    try {
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(e.status || 1);
    }
};

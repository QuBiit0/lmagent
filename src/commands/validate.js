const { execSync } = require('child_process');
const path = require('path');
const { ROOT_DIR } = require('../core/constants.js');

module.exports = function runValidate(skill) {
    const scriptPath = path.join(ROOT_DIR, 'scripts', 'validate_skills.js');
    const args = skill ? ` ${skill}` : '';
    try {
        execSync(`node "${scriptPath}"${args}`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(e.status || 1);
    }
};

const { execSync } = require('child_process');
const path = require('path');

module.exports = function runValidate(skill) {
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'validate_skills.js');
    const args = skill ? ` ${skill}` : '';
    try {
        execSync(`node "${scriptPath}"${args}`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(e.status || 1);
    }
};

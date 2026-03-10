const { execSync } = require('child_process');
const path = require('path');
const { ROOT_DIR } = require('../core/constants.js');

module.exports = function runTokens(options) {
    const scriptPath = path.join(ROOT_DIR, 'scripts', 'token-analyzer.js');
    const args = [options.json ? '--json' : '', options.report ? '--report' : ''].filter(Boolean).join(' ');
    try {
        execSync(`node "${scriptPath}" ${args}`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(e.status || 1);
    }
};

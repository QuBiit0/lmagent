const { execSync } = require('child_process');
const path = require('path');

module.exports = function runTokens(options) {
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'token-analyzer.js');
    const args = [options.json ? '--json' : '', options.report ? '--report' : ''].filter(Boolean).join(' ');
    try {
        execSync(`node "${scriptPath}" ${args}`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(e.status || 1);
    }
};

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', '.agents');
const ROOT_DIR = path.join(__dirname, '..');
const NEW_VERSION = '3.5.0';
const NEW_DATE = '01/03/2026';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function updateFileContent(filepath) {
    if (!filepath.endsWith('.md') && !filepath.endsWith('.yaml') && !filepath.endsWith('.yml')) return;

    let content = fs.readFileSync(filepath, 'utf8');
    let originalContent = content;
    let modified = false;

    // Actualizar versión en metadata (Frontmatter YAML)
    const versionRegex = /version:\s*"(?:3\.\d+\.\d+|3\.\d+)"/g;
    if (versionRegex.test(content)) {
        content = content.replace(versionRegex, `version: "${NEW_VERSION}"`);
        modified = true;
    }

    // Actualizar versión genérica sin comillas (por precaución)
    const versionRegex2 = /version:\s*(?:3\.\d+\.\d+|3\.\d+)/g;
    if (versionRegex2.test(content) && !content.includes(`version: "${NEW_VERSION}"`)) {
        content = content.replace(versionRegex2, `version: "${NEW_VERSION}"`);
        modified = true;
    }

    // LMAgent v3.X references en texto markdown
    const lmagentRefRegex = /LMAgent v3\.\d+\.\d+/gi;
    if (lmagentRefRegex.test(content)) {
        content = content.replace(lmagentRefRegex, `LMAgent v${NEW_VERSION}`);
        modified = true;
    }

    // Archivo AGENTS.md y afines tienen fechas en su header
    const dateRegex = /\(\d{2}\/\d{2}\/\d{4} -/g;
    if (dateRegex.test(content)) {
        content = content.replace(dateRegex, `(${NEW_DATE} -`);
        modified = true;
    }

    if (modified && content !== originalContent) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`✅ Updated: ${path.relative(ROOT_DIR, filepath)}`);
    }
}

console.log("🚀 Iniciando barrido global de versiones a v3.5.0...");

// Barrer todo /agents
if (fs.existsSync(AGENTS_DIR)) {
    walkDir(AGENTS_DIR, updateFileContent);
} else {
    console.log("⚠️ No se encontró la carpeta .agents");
}

console.log("✨ Finalizado.");

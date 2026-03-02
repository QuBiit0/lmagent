const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', '.agents');
const ROOT_DIR = path.join(__dirname, '..');

const pkgPath = path.join(ROOT_DIR, 'package.json');
const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const TARGET_VERSION = pkgContent.version;
const NEW_VERSION = TARGET_VERSION;

// Use current date
const d = new Date();
const NEW_DATE = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const VERSION_REGEX_MD = /version:\s*"(v?\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?)"/g;

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function updateFileContent(filepath) {
    if (!filepath.endsWith('.md') && !filepath.endsWith('.yaml') && !filepath.endsWith('.yml') && !filepath.endsWith('.sh') && !filepath.endsWith('.ps1')) return;

    let content = fs.readFileSync(filepath, 'utf8');
    let originalContent = content;
    let modified = false;

    // Actualizar versión en metadata (Frontmatter YAML)
    // Using VERSION_REGEX_MD as suggested by the snippet, which was versionRegex
    if (VERSION_REGEX_MD.test(content)) {
        content = content.replace(VERSION_REGEX_MD, `version: "${NEW_VERSION}"`);
        modified = true;
    }

    // Actualizar versión genérica sin comillas (por precaución)
    const versionRegex2 = /version:\s*(?:3\.\d+\.\d+|3\.\d+)/g;
    if (versionRegex2.test(content) && !content.includes(`version: "${NEW_VERSION}"`)) {
        content = content.replace(versionRegex2, `version: "${NEW_VERSION}"`);
        modified = true;
    }

    // LMAgent [vV]3.X references en texto markdown / scripts
    const lmagentRefRegex = /LMAgent\s+[vV]\d+\.\d+(?:\.\d+)?\+?/gi;
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

console.log(`🚀 Iniciando barrido global de versiones a v${TARGET_VERSION}...`);

// Barrer todo /agents
if (fs.existsSync(AGENTS_DIR)) {
    walkDir(AGENTS_DIR, updateFileContent);
} else {
    console.log("⚠️ No se encontró la carpeta .agents");
}

// Barrer todo /scripts
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
if (fs.existsSync(SCRIPTS_DIR)) {
    walkDir(SCRIPTS_DIR, updateFileContent);
}

// Actualizar Entry Points en la raíz
const entryFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', 'README.md', 'package.json'];
entryFiles.forEach(file => {
    const fullPath = path.join(ROOT_DIR, file);
    if (fs.existsSync(fullPath)) updateFileContent(fullPath);
});

console.log("✨ Finalizado.");

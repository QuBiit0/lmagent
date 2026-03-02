const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(ROOT_DIR, '.agents');
const SKILLS_DIR = path.join(AGENTS_DIR, 'skills');
const DOCS_TARGETS = [
    path.join(ROOT_DIR, 'AGENTS.md'),
    path.join(AGENTS_DIR, 'rules', '00-master.md')
];

// ─── Extractor de Metadata (Frontmatter) ─────────────────────────────────
function parseMetadata(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    if (!match) return null;

    const metadata = {};
    const lines = match[1].split('\n');
    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            let key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Quitar comillas si existen
            value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
            metadata[key] = value;
        }
    });
    return metadata;
}

// ─── Escáner de Skills ──────────────────────────────────────────────────
function scanSkills() {
    if (!fs.existsSync(SKILLS_DIR)) return [];

    const skills = [];
    const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });

    for (const d of dirs) {
        if (!d.isDirectory()) continue;

        const skillPath = path.join(SKILLS_DIR, d.name, 'SKILL.md');
        if (fs.existsSync(skillPath)) {
            const content = fs.readFileSync(skillPath, 'utf8');
            const meta = parseMetadata(content);
            if (meta && meta.name) {
                skills.push({
                    id: d.name,
                    name: meta.name,
                    description: meta.description || 'Sin descripción',
                    role: meta.role || '-',
                    icon: meta.icon || '🔧',
                    type: meta.type || 'agent_persona'
                });
            }
        }
    }

    // Ordenar alfabéticamente
    return skills.sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Generador de Tablas Markdown ───────────────────────────────────────
function generateSkillsTable(skills) {
    let table = '| ID / Trigger | Skill | Icono & ROL | Descripción |\n';
    table += '|:---|:---|:---|:---|\n';

    skills.forEach(s => {
        table += `| \`/${s.id.split('-')[0]}\` | **${s.name}** | ${s.icon} *${s.role}* | ${s.description} |\n`;
    });

    return table;
}

// ─── Inyector de Markdown ───────────────────────────────────────────────
function injectIntoMarkdown(filePath, markerName, contentToInject) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const startMarker = `<!-- LMAGENT_REGISTRY:${markerName}_START -->`;
    const endMarker = `<!-- LMAGENT_REGISTRY:${markerName}_END -->`;

    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);

    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const before = content.substring(0, startIndex + startMarker.length);
        const after = content.substring(endIndex);
        const newContent = `${before}\n\n${contentToInject}\n\n${after}`;

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Inyectado ${markerName} en: ${path.relative(ROOT_DIR, filePath)}`);
        }
    }
}

// ─── Ejecución Principal ────────────────────────────────────────────────
console.log('🔍 Escaneando Registro de LMAgent...');

const skills = scanSkills();
console.log(`📦 Encontrados ${skills.length} skills.`);

const skillsTable = generateSkillsTable(skills);

DOCS_TARGETS.forEach(docPath => {
    injectIntoMarkdown(docPath, 'SKILLS', skillsTable);
});

console.log('✨ Sincronización finalizada.');

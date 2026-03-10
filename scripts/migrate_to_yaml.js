const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', '.agents', 'skills');
const dirs = fs.readdirSync(skillsDir).filter(d => fs.statSync(path.join(skillsDir, d)).isDirectory());

let migrated = 0;
for (const d of dirs) {
    const mdPath = path.join(skillsDir, d, 'SKILL.md');
    if (!fs.existsSync(mdPath)) continue;

    let content = fs.readFileSync(mdPath, 'utf8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (match) {
        fs.writeFileSync(path.join(skillsDir, d, 'skill.yaml'), match[1], 'utf8');
        // Quitar el frontmatter del archivo Markdown
        const newContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
        fs.writeFileSync(mdPath, newContent, 'utf8');
        console.log('Migrado a skill.yaml:', d);
        migrated++;
    }
}
console.log(`\nMigración completada. ${migrated} skills actualizados.`);

const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '.agents', 'skills');
const skills = fs.readdirSync(skillsDir).filter(x => fs.statSync(path.join(skillsDir, x)).isDirectory());

let totalTokensSaved = 0;

skills.forEach(skill => {
    const filePath = path.join(skillsDir, skill, 'SKILL.md');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');
    const examplesDir = path.join(skillsDir, skill, 'examples');

    // Soporte para \r\n de Windows
    const codeBlockRegex = /```([a-zA-Z0-9_\-]+)?\r?\n([\s\S]*?)```/g;
    let match;
    let newContent = content;
    let fileIndex = 1;
    let modified = false;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        const lang = match[1] || 'txt';
        const code = match[2];
        const lines = code.split(/\r?\n/).length;

        // Si el bloque tiene más de 15 líneas, lo extraemos
        if (lines > 15) {
            if (!fs.existsSync(examplesDir)) {
                fs.mkdirSync(examplesDir, { recursive: true });
            }

            let ext = 'txt';
            if (['typescript', 'ts'].includes(lang)) ext = 'ts';
            else if (['javascript', 'js'].includes(lang)) ext = 'js';
            else if (['python', 'py'].includes(lang)) ext = 'py';
            else if (['bash', 'sh'].includes(lang)) ext = 'sh';
            else if (['json'].includes(lang)) ext = 'json';
            else if (['yaml', 'yml'].includes(lang)) ext = 'yml';
            else if (['sql'].includes(lang)) ext = 'sql';
            else if (['html'].includes(lang)) ext = 'html';
            else if (['css'].includes(lang)) ext = 'css';
            else ext = lang;

            const exampleFilename = `example_${fileIndex}.${ext}`;
            const examplePath = path.join(examplesDir, exampleFilename);

            fs.writeFileSync(examplePath, code.trim(), 'utf-8');

            const bytesSaved = match[0].length;
            totalTokensSaved += bytesSaved;

            const reference = `> 📂 **Ejemplo Extraído**: Ver implementación completa en \`.agents/skills/${skill}/examples/${exampleFilename}\``;

            // Reemplazo exacto usando string replace
            newContent = newContent.replace(match[0], reference);

            fileIndex++;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ ${skill}: Extraidos ${fileIndex - 1} ejemplos`);
    }
});

console.log(`\n🎉 Total estimado ahorrado por ejemplos extraídos: ~${Math.round(totalTokensSaved / 4)} tokens (${Math.round(totalTokensSaved / 1024)}KB)`);

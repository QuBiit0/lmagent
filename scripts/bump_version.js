const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const skillsDir = path.join(projectRoot, '.agents', 'skills');
const oldVersion = '3.6.0';
const newVersion = '4.0.0';

console.log(`🚀 Iniciando Script Bump Version: ${oldVersion} -> ${newVersion}\n`);

// 1. Array de rutas estáticas a modificar (Archivos de Core y Documentación)
const staticFiles = [
    'package.json',
    'package-lock.json',
    'README.md',
    'AGENTS.md',
    'AGENTS_CATALOG.md',
    '.agents/rules/00-master.md',
    '.agents/templates/SKILL_TEMPLATE.yaml',
    'scripts/create_skill.js',
    'scripts/upgrade_skills.js',
    'scripts/validate_skills.js'
];

// Procesar Archivos Estáticos
console.log('--- Archivos Core & Documentación ---');
staticFiles.forEach(relPath => {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`  [SKIP] Archivo no encontrado: ${relPath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const regex = new RegExp(oldVersion.replace(/\./g, '\\.'), 'g');

    if (regex.test(content)) {
        content = content.replace(regex, newVersion);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`  [OK] Actualizado: ${relPath}`);
    } else {
        console.log(`  [SKIP] Versión no hallada en: ${relPath}`);
    }
});

// 2. Procesar Manifiestos YAML Dinámicamente
console.log('\n--- Manifiestos skill.yaml ---');
if (!fs.existsSync(skillsDir)) {
    console.error('❌ Directorio de skills no encontrado.');
    process.exit(1);
}

const skillDirs = fs.readdirSync(skillsDir).filter(d => fs.statSync(path.join(skillsDir, d)).isDirectory());
let updatedSkillsCount = 0;

for (const dir of skillDirs) {
    const yamlPath = path.join(skillsDir, dir, 'skill.yaml');
    if (fs.existsSync(yamlPath)) {
        let content = fs.readFileSync(yamlPath, 'utf8');

        // Buscar la línea exacta version: "3.6.0" en YAML
        const versionRegex = new RegExp(`version:\\s*["']?${oldVersion.replace(/\./g, '\\.')}["']?`, 'g');

        if (versionRegex.test(content)) {
            content = content.replace(versionRegex, `version: "${newVersion}"`);
            fs.writeFileSync(yamlPath, content, 'utf8');
            console.log(`  [OK] ${dir}/skill.yaml`);
            updatedSkillsCount++;
        }
    }
}

console.log(`\n✅ Proceso Completado. Skills actualizados: ${updatedSkillsCount}/${skillDirs.length}`);

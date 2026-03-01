const fs = require('fs');
const path = require('path');

const SKILLS_DIR = path.join(__dirname, '..', '.agents', 'skills');
const VALIDATOR_PATH = path.join(__dirname, 'validate_skills.js');
const CURRENT_VERSION = "3.5.0";

// Mensajes a inyectar
const AGNOSTIC_INJECTION = `
### 🌍 Agnosticismo Tecnológico y Flexibilidad (LMAgent Core Rule)
Eres un experto **tecnológicamente agnóstico**. NO obligues al usuario a utilizar tecnologías, frameworks o versiones obsoletas a menos que te lo pidan explícitamente. Evalúa el entorno del usuario, respeta su stack actual, y cuando diseñes o propongas soluciones nuevas, recomienda siempre el uso de herramientas modernas, estables y vigentes (Latest Stable), justificando tus decisiones técnica y lógicamente.`;

const DOD_INJECTION = `## 📋 Definition of Done
Antes de dar por completada una tarea en tu rol, asegúrate de:
- Haber cumplido tu misión principal sin haber roto reglas de arquitectura.
- Haber considerado la seguridad y el performance en tus decisiones.
- Haber dejado el código o diseño listo para la siguiente fase o revisión del usuario.`;

function processSkill(skillPath) {
    const stats = fs.statSync(skillPath);
    if (!stats.isDirectory()) return;

    const mdPath = path.join(skillPath, 'SKILL.md');
    if (!fs.existsSync(mdPath)) return;

    let content = fs.readFileSync(mdPath, 'utf8');
    let modified = false;

    // --- 1. MODIFICAR FRONTMATTER ---
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
        let frontmatter = frontmatterMatch[1];

        // Fix version
        if (frontmatter.includes('version:')) {
            frontmatter = frontmatter.replace(/version:\s*".*"/, `version: "${CURRENT_VERSION}"`);
        } else {
            frontmatter += `\nversion: "${CURRENT_VERSION}"`;
        }

        // Agregar obligatorios si faltan (valores default seguros)
        const required = ['role', 'type', 'icon', 'expertise', 'activates_on', 'triggers'];
        const defaults = {
            role: "Especialista TBD",
            type: "technical",
            icon: "🤖",
            expertise: "Desarrollo",
            activates_on: "Solicitud del usuario",
            triggers: "[]"
        };

        required.forEach(req => {
            if (!new RegExp(`^${req}:`, 'm').test(frontmatter)) {
                frontmatter += `\n${req}: "${defaults[req]}"`;
            }
        });

        const newFrontmatterBlock = `\n${frontmatter}\n`;
        // Sustituir frontmatter viejo por nuevo
        content = content.replace(/^---\n[\s\S]*?\n---/, `---\n${frontmatter.trim()}\n---`);
        modified = true;
    }


    // --- 2. ASEGURAR SYSTEM PROMPT & AGNOSTICISMO ---
    // Buscar si ya tiene "System Prompt" o similar
    const systemPromptRegex = /##\s*(?:(?:🧠\s*)?System Prompt|Misión|Tu Misión)/i;
    if (!systemPromptRegex.test(content)) {
        // Inyectar justo después del frontmatter si no existe
        content = content.replace(/^---\n[\s\S]*?\n---\n/, `$&## 🧠 System Prompt\n`);
        modified = true;
    }

    // Inyectar Agnosticismo (si no está ya)
    if (!content.includes('Agnosticismo Tecnológico y Flexibilidad')) {
        // Inyectar al final del bloque de System Prompt o restricciones
        // Buscamos el segundo ## (la siguiente sección fuerte)
        const parts = content.split(/^(?=## )/m);
        for (let i = 0; i < parts.length; i++) {
            if (systemPromptRegex.test(parts[i])) {
                parts[i] += '\n' + AGNOSTIC_INJECTION + '\n\n';
                content = parts.join('');
                modified = true;
                break;
            }
        }
    }


    // --- 3. ASEGURAR DEFINITION OF DONE ---
    if (!/##\s*(?:(?:📋\s*)?Definition of Done|Criterios de Éxito)/i.test(content)) {
        content += '\n\n' + DOD_INJECTION + '\n';
        modified = true;
    }

    // --- GUARDAR ---
    if (modified) {
        fs.writeFileSync(mdPath, content, 'utf8');
        console.log(`✅ Transformado: ${path.basename(skillPath)}/SKILL.md`);
    } else {
        console.log(`⏩ Sin cambios necesarios: ${path.basename(skillPath)}/SKILL.md`);
    }
}

// Ejecutar para cada skill
const dirs = fs.readdirSync(SKILLS_DIR);
console.log(`Procesando ${dirs.length} skills...`);
dirs.forEach(dir => processSkill(path.join(SKILLS_DIR, dir)));
console.log("¡Transformación masiva completada!");

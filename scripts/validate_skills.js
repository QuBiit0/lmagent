#!/usr/bin/env node

/**
 * LMAgent Skills Validator — v4.0.0
 *
 * Valida la integridad de todos los skills del framework.
 * Verifica: frontmatter Anthropic Skills v2.0, extensiones lmagent:, estructura de directorio.
 *
 * Uso:
 *   node scripts/validate_skills.js              # Validar todos
 *   node scripts/validate_skills.js backend      # Validar uno específico
 *   node scripts/validate_skills.js --migrate    # Migrar todos de v3.x a v4.0
 *   node scripts/validate_skills.js --migrate backend-engineer  # Migrar uno
 *
 * Exit codes:
 *   0 = Todo OK (o solo warnings)
 *   1 = Errores encontrados
 */

const { readFileSync, readdirSync, existsSync, statSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');

const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, '.agents', 'skills');

const pkgContent = readFileSync(join(ROOT, 'package.json'), 'utf-8');
const CURRENT_VERSION = JSON.parse(pkgContent).version;

// ─── Colores (sin dependencias externas) ─────────────────────
const c = {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
    magenta: (s) => `\x1b[35m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ─── Configuración v4.0 ───────────────────────────────────────
// Campos requeridos Anthropic Skills v2.0 (los soportados oficialmente son:
// name | description | user-invocable | argument-hint | compatibility |
// disable-model-invocation | license | metadata)
const REQUIRED_ANTHROPIC_FIELDS = ['name', 'description', 'user-invocable'];

// Campos requeridos extensiones LMAgent (bajo namespace metadata:)
const REQUIRED_LMAGENT_FIELDS = ['role', 'type', 'triggers'];

const VALID_TYPES = ['agent_persona', 'methodology'];
const VALID_CATEGORIES = ['capability_uplift', 'encoded_preferences'];
const OPTIONAL_DIRS = ['scripts', 'references', 'assets'];

// Herramientas válidas de Claude Code (referencia para validar allowed-tools)
const CLAUDE_CODE_TOOLS = new Set([
    'Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob',
    'WebFetch', 'WebSearch', 'Agent', 'TodoWrite', 'NotebookEdit',
    'ExitPlanMode', 'EnterPlanMode', 'Skill', 'ToolSearch',
]);

// ─── Detección de versión del skill ──────────────────────────
function detectSkillVersion(fm, content) {
    // v4.0 correcto: tiene user-invocable Y metadata con role (formato actual)
    const meta = fm['metadata'];
    if (fm['user-invocable'] !== undefined && meta && typeof meta === 'object' && meta.role) return '4.0';
    // Incompleto/antiguo: tiene user-invocable pero metadata mal formada o usa lmagent:
    if (fm['user-invocable'] !== undefined) return '3.x';
    // v3.x puro: campos planos tipo, role, icon
    if (fm.role || fm.icon || (fm.version && !meta)) return '3.x';
    return 'unknown';
}

// ─── Parser de Frontmatter YAML (sin deps) ───────────────────
// Soporta bloques anidados (metadata:, lmagent:) con 2-space indent
function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const yaml = match[1];
    const result = {};
    let currentRootKey = null;   // clave raíz actual con bloque anidado
    let nestedObj = null;        // objeto anidado activo
    let currentNestedKey = null; // clave actual dentro del bloque anidado

    // Bloques que se parsean como objetos anidados
    const NESTED_BLOCKS = new Set(['metadata', 'lmagent', 'hooks']);

    for (const line of yaml.split(/\r?\n/)) {
        // Omitir comentarios y líneas vacías
        if (!line.trim() || line.trim().startsWith('#')) continue;

        // Sub-lista de bloque anidado: "    - item"
        if (nestedObj !== null) {
            const subListMatch = line.match(/^\s{4,}- (.+)/);
            if (subListMatch && currentNestedKey) {
                if (!Array.isArray(nestedObj[currentNestedKey])) nestedObj[currentNestedKey] = [];
                nestedObj[currentNestedKey].push(subListMatch[1].trim());
                continue;
            }

            // Sub-key de bloque anidado: "  key: value"
            const subKvMatch = line.match(/^\s{2}([\w][\w_-]*)\s*:\s*(.*)/);
            if (subKvMatch) {
                const subKey = subKvMatch[1];
                const subVal = subKvMatch[2].trim().replace(/^["']|["']$/g, '');
                currentNestedKey = subKey;
                nestedObj[subKey] = subVal === '' ? null : subVal;
                continue;
            }

            // Si llegamos a una clave raíz (sin indentación), salir del bloque
            if (/^[\w]/.test(line)) {
                nestedObj = null;
                currentRootKey = null;
                currentNestedKey = null;
                // Caer al parser raíz abajo
            } else {
                continue; // Ignorar líneas indentadas no reconocidas
            }
        }

        // Lista raíz: "  - item"
        const listMatch = line.match(/^\s{2,}- (.+)/);
        if (listMatch && currentRootKey && nestedObj === null) {
            if (!Array.isArray(result[currentRootKey])) result[currentRootKey] = [];
            result[currentRootKey].push(listMatch[1].trim());
            continue;
        }

        // Key-value raíz: "key: value" o "key:" (bloque)
        const kvMatch = line.match(/^([\w][\w_-]*)\s*:\s*(.*)/);
        if (kvMatch) {
            const key = kvMatch[1];
            const rawValue = kvMatch[2].trim();
            currentRootKey = key;
            currentNestedKey = null;

            if (rawValue === '' || rawValue === '|' || rawValue === '>') {
                // Posible bloque anidado
                if (NESTED_BLOCKS.has(key)) {
                    nestedObj = {};
                    result[key] = nestedObj;
                } else {
                    result[key] = null;
                }
            } else {
                nestedObj = null;
                result[key] = rawValue.replace(/^["']|["']$/g, '');
            }
        }
    }

    return result;
}

// ─── Validar un Skill v4.0 ────────────────────────────────────
function validateSkill(skillDir) {
    const skillName = skillDir.split(/[/\\]/).pop();
    const skillMdPath = join(skillDir, 'SKILL.md');
    const errors = [];
    const warnings = [];

    // 1. Verificar SKILL.md existe
    if (!existsSync(skillMdPath)) {
        errors.push('Falta archivo SKILL.md');
        return { skillName, errors, warnings, frontmatter: null, version: 'unknown' };
    }

    // 2. Parsear frontmatter
    const content = readFileSync(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
        errors.push('No se encontró frontmatter YAML (debe empezar con ---)');
        return { skillName, errors, warnings, frontmatter: null, version: 'unknown' };
    }

    // 3. Detectar versión del skill
    const skillVersion = detectSkillVersion(fm, content);

    if (skillVersion === '3.x') {
        warnings.push(`Skill en formato v3.x — ejecuta --migrate para actualizar a v4.0`);
        // Validación básica v3.x
        const v3Required = ['name', 'description', 'role', 'type', 'triggers'];
        for (const field of v3Required) {
            if (!(field in fm) || fm[field] === '' || fm[field] === undefined) {
                warnings.push(`Campo v3.x faltante/vacío: ${field}`);
            }
        }
        const extras = getOptionalDirs(skillDir);
        const lines = content.split(/\r?\n/).length;
        return { skillName, errors, warnings, frontmatter: fm, version: skillVersion, extras, lines };
    }

    // ── Validaciones v4.0 ─────────────────────────────────────

    // 4. Campos obligatorios Anthropic v2.0
    for (const field of REQUIRED_ANTHROPIC_FIELDS) {
        if (!(field in fm) || fm[field] === '' || fm[field] === null || fm[field] === undefined) {
            errors.push(`[Anthropic v2.0] Campo obligatorio faltante/vacío: "${field}"`);
        }
    }

    // 5. Verificar name es kebab-case
    if (fm.name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) {
        warnings.push(`"name" debe ser kebab-case: "${fm.name}"`);
    }

    // 6. Verificar description tiene mínimo 20 chars y describe capability
    if (fm.description) {
        if (fm.description.length < 20) {
            warnings.push(`"description" demasiado corta (${fm.description.length} chars, mín. 20) — debe describir capability`);
        }
        if (fm.name && fm.description.toLowerCase().includes(fm.name.toLowerCase())) {
            warnings.push('"description" contiene el name literal — optimizar para routing (evitar redundancia)');
        }
    }

    // 7. Verificar allowed-tools es array y contiene tools conocidas
    if (fm['allowed-tools']) {
        if (!Array.isArray(fm['allowed-tools'])) {
            errors.push('"allowed-tools" debe ser un array');
        } else {
            if (fm['allowed-tools'].length === 0) {
                warnings.push('"allowed-tools" está vacío — añadir al menos una herramienta');
            }
            const unknownTools = fm['allowed-tools'].filter(t => !CLAUDE_CODE_TOOLS.has(t) && !t.startsWith('#'));
            if (unknownTools.length > 0) {
                warnings.push(`Herramientas no reconocidas en Claude Code: ${unknownTools.join(', ')} (pueden ser válidas en otros IDEs)`);
            }
        }
    }

    // 8. Verificar user-invocable es boolean
    if (fm['user-invocable'] !== undefined) {
        const val = String(fm['user-invocable']);
        if (val !== 'true' && val !== 'false') {
            warnings.push(`"user-invocable" debe ser true o false, se encontró: "${val}"`);
        }
    }

    // 9. Verificar model si presente — no debe ser placeholder
    if (fm.model) {
        if (fm.model.includes('your-provider') || fm.model.includes('provider-recommended')) {
            warnings.push('"model" contiene un placeholder — reemplazar con el modelo real del proveedor activo');
        }
    }

    // 10. Verificar extensiones LMAgent (bajo metadata:)
    const lm = fm['metadata'];
    if (!lm || typeof lm !== 'object') {
        errors.push('[LMAgent] Bloque "metadata:" faltante en frontmatter');
    } else {
        for (const field of REQUIRED_LMAGENT_FIELDS) {
            if (!(field in lm) || lm[field] === '' || lm[field] === null) {
                errors.push(`[LMAgent] Campo faltante en metadata: "${field}"`);
            }
        }

        // Verificar type válido
        if (lm.type) {
            const typeClean = String(lm.type).replace(/^["']|["']$/g, '');
            if (!VALID_TYPES.includes(typeClean)) {
                warnings.push(`metadata.type desconocido: "${typeClean}" (esperado: ${VALID_TYPES.join(' | ')})`);
            }
        }

        // Verificar category
        if (lm.category) {
            const catClean = String(lm.category).replace(/^["']|["']$/g, '');
            if (!VALID_CATEGORIES.includes(catClean)) {
                warnings.push(`metadata.category desconocido: "${catClean}" (esperado: ${VALID_CATEGORIES.join(' | ')})`);
            }
        }

        // Verificar triggers (string CSV o array) — cada trigger empieza con /
        if (lm.triggers) {
            const triggersRaw = String(lm.triggers).replace(/^["']|["']$/g, '');
            const triggerList = triggersRaw.split(',').map(t => t.trim()).filter(Boolean);
            for (const trigger of triggerList) {
                if (!trigger.startsWith('/')) {
                    warnings.push(`Trigger "${trigger}" no empieza con / (convención)`);
                }
            }
        }

        // Verificar metadata.version
        if (lm.version) {
            const ver = String(lm.version).replace(/^["']|["']$/g, '');
            if (ver && ver !== CURRENT_VERSION) {
                warnings.push(`metadata.version "${ver}" ≠ "${CURRENT_VERSION}" (versión actual del framework)`);
            }
        }
    }

    // 11. Verificar secciones de contenido
    const requiredSections = ['System Prompt', 'Definition of Done', 'Evals'];
    for (const section of requiredSections) {
        if (!content.includes(section)) {
            warnings.push(`Sección recomendada faltante: "## ${section}"`);
        }
    }

    // 12. Verificar que Evals tenga al menos una fila de tabla
    if (content.includes('Evals')) {
        const evalsMatch = content.match(/## 🧪 Evals[\s\S]*?\|([^\n]+)\|/);
        const tableRows = (content.match(/\|\s*"[^"]+"\s*\|/g) || []).length;
        if (tableRows < 1) {
            warnings.push('Sección "Evals" existe pero no tiene filas de prueba definidas (recomendado: ≥2)');
        }
    }

    // 13. Verificar tamaño sustancial
    const lines = content.split(/\r?\n/).length;
    if (lines < 80) {
        warnings.push(`SKILL.md tiene solo ${lines} líneas (recomendado: 120+)`);
    }

    // 14. Directorios opcionales
    const extras = getOptionalDirs(skillDir);

    return { skillName, errors, warnings, frontmatter: fm, version: skillVersion, extras, lines };
}

// ─── Leer directorios opcionales ─────────────────────────────
function getOptionalDirs(skillDir) {
    const extras = [];
    for (const dir of OPTIONAL_DIRS) {
        const dirPath = join(skillDir, dir);
        if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
            const files = readdirSync(dirPath);
            if (files.length > 0) extras.push(`${dir}/ (${files.length})`);
        }
    }
    return extras;
}

// ─── Migrar skill v3.x → v4.0 ────────────────────────────────
function migrateSkill(skillDir) {
    const skillName = skillDir.split(/[/\\]/).pop();
    const skillMdPath = join(skillDir, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
        console.log(`  ${c.red('❌')} ${skillName}: SKILL.md no encontrado`);
        return false;
    }

    const content = readFileSync(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
        console.log(`  ${c.red('❌')} ${skillName}: no se pudo parsear frontmatter`);
        return false;
    }

    const version = detectSkillVersion(fm, content);
    if (version === '4.0') {
        console.log(`  ${c.dim('⏭')} ${skillName}: ya está en v4.0 — omitiendo`);
        return true;
    }

    // Extraer campos v3.x
    const name = fm.name || skillName;
    const description = fm.description || `Skill especializado en ${name}`;
    const role = fm.role || `Experto en ${name}`;
    const icon = fm.icon || '🔧';
    const type = VALID_TYPES.includes(fm.type) ? fm.type : 'agent_persona';
    const expertise = Array.isArray(fm.expertise) ? fm.expertise : [];
    const activatesOn = Array.isArray(fm.activates_on) ? fm.activates_on : [];
    const triggers = Array.isArray(fm.triggers) ? fm.triggers : [`/${name.split('-')[0]}`];

    // Mapear old tools → new Claude Code tools
    const toolMap = {
        'view_file': 'Read',
        'view_file_outline': 'Read',
        'grep_search': 'Grep',
        'run_command': 'Bash',
        'replace_file_content': 'Edit',
        'multi_replace_file_content': 'Edit',
        'write_to_file': 'Write',
        'mcp_context7_query-docs': 'WebFetch',
    };

    const oldTools = Array.isArray(fm['allowed-tools']) ? fm['allowed-tools'] : [];
    const newTools = [...new Set(
        oldTools.map(t => toolMap[t] || t).filter(t => CLAUDE_CODE_TOOLS.has(t))
    )];
    if (newTools.length === 0) newTools.push('Read', 'Edit', 'Bash', 'Grep', 'Glob');

    const triggersYaml = triggers.map(t => `    - "${t}"`).join('\n');
    const expertiseYaml = expertise.map(e => `    - "${e}"`).join('\n') || '    - "[Expertise área]"';
    const activatesOnYaml = activatesOn.map(a => `    - "${a}"`).join('\n') || '    - "[Contexto de activación]"';
    const toolsYaml = newTools.map(t => `  - ${t}`).join('\n');

    // Construir nuevo frontmatter (formato v4.0 correcto)
    const triggersStr = triggers.join(', ');
    const newFrontmatter = `---
# ============================================================
# ANTHROPIC SKILLS v2.0 — Campos oficiales soportados
# ============================================================
name: "${name}"
description: "${description}"
user-invocable: true
argument-hint: "[task description]"
compatibility: "Universal - Claude Code, Cursor, Windsurf, Gemini CLI y 33+ IDEs"
license: MIT

# metadata: campo libre — aquí va el metadata LMAgent
metadata:
  author: "QuBiit"
  version: "${CURRENT_VERSION}"
  framework: LMAgent
  icon: "${icon}"
  role: "${role}"
  type: "${type}"
  category: "capability_uplift"
  triggers: "${triggersStr}"
---`;

    // Extraer body (todo lo que está después del frontmatter)
    const bodyMatch = content.match(/^---[\s\S]*?---\r?\n([\s\S]*)/);
    let body = bodyMatch ? bodyMatch[1] : content;

    // Añadir sección Evals si no existe
    let newBody = body;

    // Nota: el body puede contener bloques YAML de activación (```yaml) — son comentarios de docs, no tocar
    if (!body.includes('Evals')) {
        const evalsSection = `\n---\n\n## 🧪 Evals\n\n> Casos de prueba para validar el skill. Completar con prompts y criterios reales.\n\n| Test Prompt | Comportamiento Esperado | Criterio de Éxito |\n|-------------|------------------------|-------------------|\n| "[Prompt de prueba 1]" | [Qué debe hacer el skill] | Contiene: [keyword] |\n| "[Prompt de prueba 2]" | [Comportamiento esperado] | Produce: [artefacto] |\n\n`;
        // Insertar antes de Definition of Done si existe
        if (newBody.includes('Definition of Done')) {
            newBody = newBody.replace(/(## 📋 Definition of Done|## Definition of Done)/, evalsSection + '$1');
        } else {
            newBody = newBody + evalsSection;
        }
    }

    // Actualizar footer de versión
    newBody = newBody.replace(
        /\*Skill version: [\d.x]+ \| LMAgent Framework\*/,
        `*Skill version: ${CURRENT_VERSION} | LMAgent Framework | Anthropic Skills v2.0 compatible*`
    );

    const migratedContent = newFrontmatter + '\n' + newBody;
    writeFileSync(skillMdPath, migratedContent, 'utf-8');

    console.log(`  ${c.green('✅')} ${skillName}: migrado v3.x → v4.0`);
    return true;
}

// ─── Main ─────────────────────────────────────────────────────
function main() {
    const args = process.argv.slice(2);
    const isMigrate = args.includes('--migrate');
    const filterArg = args.find(a => !a.startsWith('--'));

    if (!existsSync(SKILLS_DIR)) {
        console.error(c.red('❌ No se encontró el directorio skills/'));
        process.exit(1);
    }

    // Obtener lista de skills
    let skillDirs = readdirSync(SKILLS_DIR)
        .filter(item => statSync(join(SKILLS_DIR, item)).isDirectory())
        .map(item => join(SKILLS_DIR, item));

    if (filterArg) {
        skillDirs = skillDirs.filter(d => d.includes(filterArg));
        if (skillDirs.length === 0) {
            console.error(c.red(`❌ No se encontró skill que contenga "${filterArg}"`));
            process.exit(1);
        }
    }

    // ── Modo Migración ────────────────────────────────────────
    if (isMigrate) {
        console.log(c.bold(`\n🔄 LMAgent Skill Migrator v${CURRENT_VERSION}`));
        console.log(c.dim('   Migrando skills de formato v3.x → v4.0 (Anthropic Skills v2.0)\n'));

        let migrated = 0;
        let skipped = 0;
        let failed = 0;

        for (const skillDir of skillDirs) {
            const result = migrateSkill(skillDir);
            if (result === true) {
                const content = readFileSync(join(skillDir, 'SKILL.md'), 'utf-8');
                const fm = parseFrontmatter(content);
                const version = detectSkillVersion(fm, content);
                if (version === '4.0') migrated++;
                else skipped++;
            } else {
                failed++;
            }
        }

        console.log(c.bold(`\n${'─'.repeat(50)}`));
        console.log(`   Migrados:  ${c.green(migrated.toString())}`);
        console.log(`   Omitidos:  ${c.dim(skipped.toString())} (ya en v4.0)`);
        console.log(`   Fallidos:  ${failed > 0 ? c.red(failed.toString()) : c.green('0')}`);
        console.log(c.bold(`${'─'.repeat(50)}\n`));

        if (failed > 0) {
            console.log(c.red('❌ Algunos skills no pudieron migrarse.\n'));
            process.exit(1);
        } else {
            console.log(c.green('✅ Migración completada. Ejecuta validate_skills.js para verificar.\n'));
            process.exit(0);
        }
        return;
    }

    // ── Modo Validación ───────────────────────────────────────
    console.log(c.bold(`\n🔍 LMAgent Skill Validator v${CURRENT_VERSION}`));
    console.log(c.dim('   Anthropic Skills v2.0 compatible'));
    console.log(c.dim(`   Directorio: ${SKILLS_DIR}`));
    console.log(c.dim(`   Skills: ${skillDirs.length}`));
    console.log('');

    let totalErrors = 0;
    let totalWarnings = 0;
    const results = [];

    for (const skillDir of skillDirs) {
        const result = validateSkill(skillDir);
        results.push(result);
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
    }

    // ─── Reporte ──────────────────────────────────────────────
    console.log(c.bold(`📊 Resultados:\n`));

    for (const r of results) {
        const hasErrors = r.errors.length > 0;
        const hasWarnings = r.warnings.length > 0;
        const icon = hasErrors ? '❌' : hasWarnings ? '⚠️ ' : '✅';
        const nameColor = hasErrors ? c.red : hasWarnings ? c.yellow : c.green;

        const fm = r.frontmatter;
        const lm = fm && (fm['metadata'] || fm['lmagent']);
        const skillIcon = lm ? (lm.icon || '?') : (fm && fm.icon ? fm.icon : '?');
        const skillType = lm ? (lm.type || '?') : (fm && fm.type ? fm.type : '?');
        const versionBadge = r.version === '4.0' ? c.cyan('v4.0') : c.yellow(`v${r.version}`);

        let info = c.dim(` (${skillIcon} ${skillType} | ${r.lines || '?'} líneas | ${versionBadge})`);
        if (r.extras && r.extras.length > 0) {
            info += c.dim(` [${r.extras.join(', ')}]`);
        }

        console.log(`  ${icon} ${nameColor(r.skillName)}${info}`);

        for (const err of r.errors) {
            console.log(`     ${c.red('ERROR')}: ${err}`);
        }
        for (const warn of r.warnings) {
            console.log(`     ${c.yellow('WARN ')}: ${warn}`);
        }
    }

    // ─── Resumen ──────────────────────────────────────────────
    const v4Count = results.filter(r => r.version === '4.0').length;
    const v3Count = results.filter(r => r.version === '3.x').length;

    console.log(c.bold('\n' + '─'.repeat(60)));
    console.log(c.bold('📋 Resumen:'));
    console.log(`   Skills validados: ${c.cyan(results.length.toString())}`);
    console.log(`   v4.0 (Anthropic): ${c.cyan(v4Count.toString())}`);
    console.log(`   v3.x (legacy):    ${v3Count > 0 ? c.yellow(v3Count.toString()) : c.green('0')}`);
    console.log(`   Errores:          ${totalErrors > 0 ? c.red(totalErrors.toString()) : c.green('0')}`);
    console.log(`   Warnings:         ${totalWarnings > 0 ? c.yellow(totalWarnings.toString()) : c.green('0')}`);

    if (v3Count > 0) {
        console.log(c.yellow(`\n   ⚠️  Hay ${v3Count} skills en formato v3.x — migrar con:`));
        console.log(c.dim('   node scripts/validate_skills.js --migrate'));
    }

    console.log(c.bold('─'.repeat(60) + '\n'));

    if (totalErrors > 0) {
        console.log(c.red('❌ Validación FALLIDA — hay errores que corregir.\n'));
        process.exit(1);
    } else if (totalWarnings > 0) {
        console.log(c.yellow('⚠️  Validación OK con warnings.\n'));
        process.exit(0);
    } else {
        console.log(c.green('✅ Todos los skills son válidos (Anthropic Skills v2.0).\n'));
        process.exit(0);
    }
}

main();

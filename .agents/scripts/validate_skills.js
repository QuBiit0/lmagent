#!/usr/bin/env node

/**
 * LMAgent Skills Validator — v3.0.11
 * 
 * Valida la integridad de todos los skills del framework.
 * Verifica: frontmatter YAML, campos obligatorios, estructura de directorio.
 * 
 * Uso:
 *   node scripts/validate_skills.js          # Validar todos
 *   node scripts/validate_skills.js backend  # Validar uno específico
 * 
 * Exit codes:
 *   0 = Todo OK
 *   1 = Errores encontrados
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import gradient from 'gradient-string';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, 'skills');

// ─── Configuración ────────────────────────────────────────────
const REQUIRED_FIELDS = ['name', 'description', 'role', 'type', 'version', 'icon', 'expertise', 'activates_on', 'triggers'];
const VALID_TYPES = ['agent_persona', 'methodology'];
const CURRENT_VERSION = '3.0.11';
const OPTIONAL_DIRS = ['scripts', 'references', 'assets'];

// ─── Colores (sin dependencias) ───────────────────────────────
const c = {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ─── Parser de Frontmatter YAML (simple, sin deps) ───────────
function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const yaml = match[1];
    const result = {};
    let currentKey = null;
    let currentList = null;

    for (const line of yaml.split(/\r?\n/)) {
        // Lista: "  - item"
        const listMatch = line.match(/^\s{2,}- (.+)/);
        if (listMatch && currentKey) {
            if (!currentList) {
                currentList = [];
                result[currentKey] = currentList;
            }
            currentList.push(listMatch[1].trim());
            continue;
        }

        // Key-value: "key: value"
        const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
        if (kvMatch) {
            currentKey = kvMatch[1];
            const rawValue = kvMatch[2].trim();
            currentList = null;

            if (rawValue === '' || rawValue === '|' || rawValue === '>') {
                // Será un bloque o lista
                result[currentKey] = rawValue;
            } else {
                // Valor simple — limpiar comillas
                result[currentKey] = rawValue.replace(/^["']|["']$/g, '');
            }
        }
    }

    return result;
}

// ─── Validar un Skill ─────────────────────────────────────────
function validateSkill(skillDir) {
    const skillName = skillDir.split(/[/\\]/).pop();
    const skillMdPath = join(skillDir, 'SKILL.md');
    const errors = [];
    const warnings = [];

    // 1. Verificar SKILL.md existe
    if (!existsSync(skillMdPath)) {
        errors.push('Falta archivo SKILL.md');
        return { skillName, errors, warnings, frontmatter: null };
    }

    // 2. Parsear frontmatter
    const content = readFileSync(skillMdPath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
        errors.push('No se encontró frontmatter YAML (debe empezar con ---)');
        return { skillName, errors, warnings, frontmatter: null };
    }

    // 3. Verificar campos obligatorios
    for (const field of REQUIRED_FIELDS) {
        if (!(field in fm)) {
            errors.push(`Campo obligatorio faltante: ${field}`);
        } else if (fm[field] === '' || fm[field] === undefined) {
            errors.push(`Campo obligatorio vacío: ${field}`);
        }
    }

    // 4. Verificar tipo válido
    if (fm.type && !VALID_TYPES.includes(fm.type)) {
        warnings.push(`Tipo desconocido: "${fm.type}" (esperado: ${VALID_TYPES.join(', ')})`);
    }

    // 5. Verificar versión
    if (fm.version) {
        // Force string comparison for semver
        const ver = String(fm.version);
        if (ver !== CURRENT_VERSION) {
            warnings.push(`Versión ${ver} ≠ ${CURRENT_VERSION} (actual del framework)`);
        }
    }

    // 6. Verificar que expertise sea una lista
    if (fm.expertise && !Array.isArray(fm.expertise)) {
        errors.push('Campo "expertise" debe ser una lista (array)');
    }

    // 7. Verificar que activates_on sea una lista
    if (fm.activates_on && !Array.isArray(fm.activates_on)) {
        errors.push('Campo "activates_on" debe ser una lista (array)');
    }

    // 8. Verificar que triggers sea una lista y empiece con /
    if (fm.triggers) {
        if (!Array.isArray(fm.triggers)) {
            errors.push('Campo "triggers" debe ser una lista (array)');
        } else {
            for (const trigger of fm.triggers) {
                if (!trigger.startsWith('/')) {
                    warnings.push(`Trigger "${trigger}" no empieza con / (convención)`);
                }
            }
        }
    }

    // 9. Verificar nombre del directorio vs nombre del skill
    const expectedDirName = fm.name
        ? fm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
        : null;
    // Solo warning, no error, porque los nombres pueden variar razonablemente

    // 10. Verificar secciones del contenido
    const expectedSections = [
        { name: 'System Prompt', alternatives: ['Persona', 'Role Definition'] },
        { name: 'Definition of Done', alternatives: ['Done', 'Criterios de Aceptación'] }
    ];

    for (const section of expectedSections) {
        const found = content.includes(section.name) ||
            section.alternatives.some(alt => content.includes(alt));

        if (!found) {
            warnings.push(`Sección recomendada faltante: "${section.name}" (o alternativas: ${section.alternatives.join(', ')})`);
        }
    }

    // 11. Verificar subdirectorios opcionales
    const extras = [];
    for (const dir of OPTIONAL_DIRS) {
        const dirPath = join(skillDir, dir);
        if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
            const files = readdirSync(dirPath);
            extras.push(`${dir}/ (${files.length} archivos)`);
        }
    }

    // 12. Verificar que el SKILL.md tenga contenido sustancial
    const lines = content.split(/\r?\n/).length;
    if (lines < 50) {
        warnings.push(`SKILL.md tiene solo ${lines} líneas (recomendado: 100+)`);
    }

    return { skillName, errors, warnings, frontmatter: fm, extras, lines };
}

function main() {
    const filterSkill = process.argv[2];

    const c = chalk;

    console.log(c.bold('\n🔍 LMAgent Skill Validator v3.0.0\n'));
    console.log(chalk.dim(`   Directorio: ${SKILLS_DIR}`));
    console.log(chalk.dim(`   Campos obligatorios: ${REQUIRED_FIELDS.length}`));
    console.log('');


    if (!existsSync(SKILLS_DIR)) {
        console.error(c.red('❌ No se encontró el directorio skills/'));
        process.exit(1);
    }

    // Obtener lista de skills
    let skillDirs = readdirSync(SKILLS_DIR)
        .filter(item => {
            const itemPath = join(SKILLS_DIR, item);
            return statSync(itemPath).isDirectory();
        })
        .map(item => join(SKILLS_DIR, item));

    if (filterSkill) {
        skillDirs = skillDirs.filter(d => d.includes(filterSkill));
        if (skillDirs.length === 0) {
            console.error(c.red(`❌ No se encontró skill que contenga "${filterSkill}"`));
            process.exit(1);
        }
    }

    let totalErrors = 0;
    let totalWarnings = 0;
    const results = [];

    for (const skillDir of skillDirs) {
        const result = validateSkill(skillDir);
        results.push(result);
        totalErrors += result.errors.length;
        totalWarnings += result.warnings.length;
    }

    // ─── Reporte ────────────────────────────────────────────────
    console.log(c.bold(`📊 Validando ${results.length} skills...\n`));

    for (const r of results) {
        const hasErrors = r.errors.length > 0;
        const hasWarnings = r.warnings.length > 0;
        const icon = hasErrors ? '❌' : hasWarnings ? '⚠️' : '✅';
        const nameColor = hasErrors ? c.red : hasWarnings ? c.yellow : c.green;

        let info = '';
        if (r.frontmatter) {
            info = c.dim(` (${r.frontmatter.icon || '?'} ${r.frontmatter.type || '?'} | ${r.lines || '?'} líneas)`);
        }
        if (r.extras && r.extras.length > 0) {
            info += c.dim(` [${r.extras.join(', ')}]`);
        }

        console.log(`  ${icon} ${nameColor(r.skillName)}${info}`);

        for (const err of r.errors) {
            console.log(`     ${c.red('ERROR')}: ${err}`);
        }
        for (const warn of r.warnings) {
            console.log(`     ${c.yellow('WARN')}: ${warn}`);
        }
    }

    // ─── Resumen ────────────────────────────────────────────────
    console.log(c.bold('\n' + '─'.repeat(60)));
    console.log(c.bold('📋 Resumen:'));
    console.log(`   Skills validados: ${c.cyan(results.length.toString())}`);
    console.log(`   Errores:          ${totalErrors > 0 ? c.red(totalErrors.toString()) : c.green('0')}`);
    console.log(`   Warnings:         ${totalWarnings > 0 ? c.yellow(totalWarnings.toString()) : c.green('0')}`);
    console.log(c.bold('─'.repeat(60) + '\n'));

    if (totalErrors > 0) {
        console.log(c.red('❌ Validación FALLIDA — hay errores que corregir.\n'));
        process.exit(1);
    } else if (totalWarnings > 0) {
        console.log(c.yellow('⚠️  Validación OK con warnings.\n'));
        process.exit(0);
    } else {
        console.log(c.green('✅ Todos los skills son válidos.\n'));
        process.exit(0);
    }
}

main();

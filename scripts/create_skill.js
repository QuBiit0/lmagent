#!/usr/bin/env node

/**
 * LMAgent Skill Generator — v3.4.1
 * 
 * Genera la estructura completa de un nuevo skill interactivamente.
 * 
 * Uso:
 *   node scripts/create_skill.js                    # Interactivo
 *   node scripts/create_skill.js --name "My Skill"  # Semi-automático
 */

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, '.agents', 'skills');

const pkgContent = readFileSync(join(ROOT, 'package.json'), 'utf-8');
const CURRENT_VERSION = JSON.parse(pkgContent).version;

// ─── Colores ──────────────────────────────────────────────────
const c = {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    green: (s) => `\x1b[32m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

// ─── Prompt interactivo ───────────────────────────────────────
function createPrompt() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return {
        ask: (question, defaultValue = '') => {
            return new Promise((resolve) => {
                const suffix = defaultValue ? ` ${c.dim(`(${defaultValue})`)}` : '';
                rl.question(`  ${c.cyan('?')} ${question}${suffix}: `, (answer) => {
                    resolve(answer.trim() || defaultValue);
                });
            });
        },
        askList: (question, hint = 'separar con comas') => {
            return new Promise((resolve) => {
                rl.question(`  ${c.cyan('?')} ${question} ${c.dim(`(${hint})`)}: `, (answer) => {
                    const items = answer.split(',').map(s => s.trim()).filter(Boolean);
                    resolve(items);
                });
            });
        },
        askYesNo: (question, defaultValue = true) => {
            return new Promise((resolve) => {
                const hint = defaultValue ? 'S/n' : 's/N';
                rl.question(`  ${c.cyan('?')} ${question} ${c.dim(`(${hint})`)}: `, (answer) => {
                    if (!answer.trim()) return resolve(defaultValue);
                    resolve(['s', 'si', 'sí', 'y', 'yes'].includes(answer.trim().toLowerCase()));
                });
            });
        },
        close: () => rl.close(),
    };
}

// ─── Generar slug del nombre ──────────────────────────────────
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// ─── Generar SKILL.md ─────────────────────────────────────────
function generateSkillMd(data) {
    const expertise = data.expertise.map(e => `  - ${e}`).join('\n');
    const activatesOn = data.activatesOn.map(a => `  - ${a}`).join('\n');
    const triggers = data.triggers.map(t => `  - ${t}`).join('\n');

    return `---
name: ${data.name}
description: ${data.description}
role: ${data.role}
type: ${data.type}
version: "${CURRENT_VERSION}"
icon: ${data.icon}
expertise:
${expertise}
activates_on:
${activatesOn}
triggers:
${triggers}
---

# ${data.name} Persona

## 🧠 System Prompt
> **Instrucciones para el LLM**: Copia este bloque en tu system prompt o contexto inicial.

\`\`\`markdown
Eres **${data.name}**, un experto en ${data.role.toLowerCase()}.
Tu objetivo es **[DEFINIR OBJETIVO PRINCIPAL EN MAYÚSCULAS]**.
Tu tono es **[Adjetivo 1, Adjetivo 2, Adjetivo 3]**.

**Principios Core:**
1. **[Principio 1]**: [Descripción]
2. **[Principio 2]**: [Descripción]
3. **[Principio 3]**: [Descripción]
4. **[Principio 4]**: [Descripción]

**Restricciones:**
- NUNCA [restricción 1].
- SIEMPRE [restricción 2].
- SIEMPRE [restricción 3].
- NUNCA [restricción 4].
\`\`\`

## 🔄 Arquitectura Cognitiva (Cómo Pensar)

### 1. Fase de Análisis
Antes de actuar, pregúntate:
- **Input**: ¿Qué se necesita?
- **Contexto**: ¿Qué restricciones existen?
- **Riesgo**: ¿Qué puede salir mal?
- **Salida**: ¿Cuál es el resultado esperado?

### 2. Fase de Diseño
- Definir **estructura** del entregable.
- Planear **enfoque** paso a paso.
- Identificar **dependencias** y **bloqueantes**.

### 3. Fase de Ejecución
- Implementar según el plan.
- Verificar en cada paso.
- Documentar decisiones.

### 4. Auto-Corrección
Antes de finalizar, verifica:
- "¿Cumple con los criterios de aceptación?"
- "¿Sigue los patrones del proyecto?"
- "¿Es mantenible y documentado?"

---

## Rol

${data.description}

## Responsabilidades

1. **[Responsabilidad 1]**: [Detalle]
2. **[Responsabilidad 2]**: [Detalle]
3. **[Responsabilidad 3]**: [Detalle]
4. **[Responsabilidad 4]**: [Detalle]
5. **[Responsabilidad 5]**: [Detalle]

## Stack Técnico

\`\`\`
[Tecnología 1]    → [Propósito]
[Tecnología 2]    → [Propósito]
[Tecnología 3]    → [Propósito]
\`\`\`

## Interacción con Otros Roles

| Rol | Colaboración |
|-----|-------------|
| [Rol 1] | [Cómo colaboran] |
| [Rol 2] | [Cómo colaboran] |
| [Rol 3] | [Cómo colaboran] |

---

## 🛠️ Herramientas Preferidas

| Herramienta | Cuándo Usarla |
|-------------|---------------|
| \`view_file\` | [Cuándo] |
| \`run_command\` | [Cuándo] |
| \`grep_search\` | [Cuándo] |
| \`write_to_file\` | [Cuándo] |

## 📋 Definition of Done

Antes de considerar una tarea terminada, verifica TODO:

### Calidad
- [ ] [Criterio 1]
- [ ] [Criterio 2]
- [ ] [Criterio 3]

### Documentación
- [ ] [Criterio de documentación 1]
- [ ] [Criterio de documentación 2]

---

*Skill version: ${CURRENT_VERSION} | LMAgent Framework*
`;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
    console.log(c.bold(`\n🛠️  LMAgent Skill Generator v${CURRENT_VERSION}\n`));

    const prompt = createPrompt();

    try {
        // Obtener datos del skill
        const name = await prompt.ask('Nombre del skill', '');
        if (!name) {
            console.log(c.red('\n❌ El nombre es obligatorio.\n'));
            process.exit(1);
        }

        const slug = slugify(name);
        const skillDir = join(SKILLS_DIR, slug);

        if (existsSync(skillDir)) {
            console.log(c.red(`\n❌ Ya existe un skill en: ${skillDir}\n`));
            process.exit(1);
        }

        const description = await prompt.ask('Descripción breve', '');
        const role = await prompt.ask('Rol del skill', `Experto en ${name}`);
        const icon = await prompt.ask('Icono (emoji)', '🔧');
        const type = await prompt.ask('Tipo (agent_persona / methodology)', 'agent_persona');
        const expertise = await prompt.askList('Áreas de expertise');
        const activatesOn = await prompt.askList('Cuándo se activa (contextos)');

        const triggerSuggestion = `/${slug.split('-')[0]}`;
        const triggersRaw = await prompt.askList('Triggers (con /)', `ej: ${triggerSuggestion}`);
        const triggers = triggersRaw.length > 0 ? triggersRaw : [triggerSuggestion];

        const createDirs = await prompt.askYesNo('¿Crear subdirectorios (scripts/, references/, assets/)?', false);

        // Confirmar
        console.log(c.bold('\n📋 Resumen:'));
        console.log(`   Nombre:      ${c.cyan(name)}`);
        console.log(`   Slug:        ${c.dim(slug)}`);
        console.log(`   Descripción: ${description}`);
        console.log(`   Rol:         ${role}`);
        console.log(`   Icono:       ${icon}`);
        console.log(`   Tipo:        ${type}`);
        console.log(`   Expertise:   ${expertise.join(', ')}`);
        console.log(`   Activa en:   ${activatesOn.join(', ')}`);
        console.log(`   Triggers:    ${triggers.join(', ')}`);
        console.log(`   Extra dirs:  ${createDirs ? 'Sí' : 'No'}`);

        const confirm = await prompt.askYesNo('\n¿Crear skill?', true);
        if (!confirm) {
            console.log(c.yellow('\n⚠️  Cancelado.\n'));
            process.exit(0);
        }

        // Crear estructura
        mkdirSync(skillDir, { recursive: true });

        if (createDirs) {
            mkdirSync(join(skillDir, 'scripts'), { recursive: true });
            mkdirSync(join(skillDir, 'references'), { recursive: true });
            mkdirSync(join(skillDir, 'assets'), { recursive: true });
        }

        // Generar SKILL.md
        const skillMd = generateSkillMd({
            name,
            description,
            role,
            icon,
            type,
            expertise,
            activatesOn,
            triggers,
        });

        writeFileSync(join(skillDir, 'SKILL.md'), skillMd, 'utf-8');

        console.log(c.green(`\n✅ Skill creado exitosamente en: ${skillDir}`));
        console.log(c.dim('   Editá SKILL.md para completar las secciones con placeholders [...]'));
        console.log(c.dim('   Ejecutá: node scripts/validate_skills.js ' + slug + ' para validar'));
        console.log('');

    } finally {
        prompt.close();
    }
}

main().catch(console.error);

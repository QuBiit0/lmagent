#!/usr/bin/env node

/**
 * LMAgent Skill Generator — v4.0.0
 *
 * Genera la estructura completa de un nuevo skill interactivamente.
 * Produce skills compatibles con Anthropic Skills v2.0.
 *
 * Campos soportados en frontmatter (Anthropic Skills v2.0):
 *   name | description | user-invocable | argument-hint |
 *   compatibility | disable-model-invocation | license | metadata
 *
 * Uso:
 *   node scripts/create_skill.js
 *   node scripts/create_skill.js --name "My Skill"
 */

const { mkdirSync, writeFileSync, existsSync } = require('fs');
const { join, resolve } = require('path');
const { createInterface } = require('readline');
const { readFileSync } = require('fs');

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

// ─── Constantes ───────────────────────────────────────────────
const VALID_TYPES = ['agent_persona', 'methodology'];
const VALID_CATEGORIES = ['capability_uplift', 'encoded_preferences'];

// ─── Prompt interactivo ───────────────────────────────────────
function createPrompt() {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return {
        ask: (question, defaultValue = '') => new Promise((resolve) => {
            const suffix = defaultValue ? ` ${c.dim(`(${defaultValue})`)}` : '';
            rl.question(`  ${c.cyan('?')} ${question}${suffix}: `, (answer) => {
                resolve(answer.trim() || defaultValue);
            });
        }),
        askList: (question, hint = 'separar con comas') => new Promise((resolve) => {
            rl.question(`  ${c.cyan('?')} ${question} ${c.dim(`(${hint})`)}: `, (answer) => {
                resolve(answer.split(',').map(s => s.trim()).filter(Boolean));
            });
        }),
        askYesNo: (question, defaultValue = true) => new Promise((resolve) => {
            const hint = defaultValue ? 'S/n' : 's/N';
            rl.question(`  ${c.cyan('?')} ${question} ${c.dim(`(${hint})`)}: `, (answer) => {
                if (!answer.trim()) return resolve(defaultValue);
                resolve(['s', 'si', 'sí', 'y', 'yes'].includes(answer.trim().toLowerCase()));
            });
        }),
        close: () => rl.close(),
    };
}

// ─── Generar slug ─────────────────────────────────────────────
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Generar SKILL.md ─────────────────────────────────────────
function generateSkillMd(data) {
    const expertiseList = data.expertise.map(e => `- ${e}`).join('\n') || '- [Expertise área]';
    const activatesOnList = data.activatesOn.map(a => `- ${a}`).join('\n') || '- [Contexto de activación]';
    const triggersStr = data.triggers.join(', ');
    const firstTrigger = data.triggers[0] || `/${data.slug.split('-')[0]}`;

    return `---
# ============================================================
# ANTHROPIC SKILLS v2.0 — Campos oficiales soportados
# ============================================================
name: "${data.slug}"
description: "${data.description}"
user-invocable: ${data.userInvocable}
argument-hint: "[task description or ${firstTrigger} argument]"
compatibility: "Universal - Claude Code, Cursor, Windsurf, Gemini CLI y 33+ IDEs"
license: MIT

# metadata: campo libre — aquí va el metadata LMAgent
metadata:
  author: "QuBiit"
  version: "${CURRENT_VERSION}"
  framework: LMAgent
  icon: "${data.icon}"
  role: "${data.role}"
  type: "${data.type}"
  category: "${data.category}"
  triggers: "${triggersStr}"
---

# ${data.name} Persona

> ⚠️ **FLEXIBILIDAD TECNOLÓGICA**: Cualquier framework, librería o versión específica mencionada actúa como **ejemplo de referencia**. El agente tiene autonomía para recomendar herramientas más modernas o adecuadas si el contexto lo justifica.

## Skill Category

**Tipo**: \`${data.category}\`
**Descripción**: [Explica por qué este skill produce resultados superiores al prompting estándar / Qué workflow específico del equipo codifica]

---

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

### 🌍 Agnosticismo Tecnológico (LMAgent Core Rule)
Eres tecnológicamente agnóstico. NO obligues al usuario a usar stacks obsoletos. Evalúa el entorno, respeta el stack actual, y recomienda siempre herramientas modernas y vigentes (Latest Stable) justificando tus decisiones.

---

## 🔄 Arquitectura Cognitiva (Cómo Pensar)

### 1. Fase de Análisis
- **Input**: ¿Qué se necesita exactamente?
- **Contexto**: ¿Qué restricciones o dependencias existen?
- **Riesgo**: ¿Qué puede salir mal?
- **Salida**: ¿Cuál es el resultado esperado?

### 2. Fase de Diseño
- Definir **estructura** del entregable.
- Planear **enfoque** paso a paso.
- Identificar **dependencias** y **bloqueantes**.

### 3. Fase de Ejecución
- Implementar según el plan.
- Verificar en cada paso intermedio.
- Documentar decisiones clave.

### 4. Auto-Corrección
- "¿Cumple con todos los criterios de aceptación?"
- "¿Sigue los patrones del proyecto?"
- "¿Es mantenible y está documentado?"

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

## Áreas de Expertise

${expertiseList}

## Contextos de Activación

${activatesOnList}

## Patrones y Ejemplos

\`\`\`[lenguaje]
// Ejemplo de patrón clave para este skill
\`\`\`

## Interacción con Otros Roles

| Rol | Colaboración |
|-----|-------------|
| [Rol 1] | [Cómo colaboran] |
| [Rol 2] | [Cómo colaboran] |
| [Rol 3] | [Cómo colaboran] |

---

## 🛠️ Herramientas Preferidas

> Adaptar según el IDE activo. Los nombres pueden variar entre IDEs.

| Herramienta | Cuándo Usarla |
|-------------|---------------|
| \`Read\` / \`view_file\` | Leer archivos de código existente |
| \`Grep\` / \`grep_search\` | Buscar patrones, funciones o clases |
| \`Bash\` / \`run_command\` | Ejecutar comandos, tests, linters |
| \`Edit\` / \`replace_file_content\` | Modificar archivos existentes |
| \`Write\` / \`write_to_file\` | Crear nuevos archivos |
| \`Glob\` / \`list_dir\` | Encontrar archivos por patrón |

---

## 🧪 Evals

> Casos de prueba para validar el skill. Usar con el skill-creator para benchmark.

| Test Prompt | Comportamiento Esperado | Criterio de Éxito |
|-------------|------------------------|-------------------|
| "Ayúdame con ${data.slug.split('-').join(' ')}" | Actúa como ${data.name} y provee guía experta | Contiene: [keyword1], [keyword2] |
| "[Tarea típica del skill]" | Produce el artefacto esperado con calidad | Contiene: [patrón esperado] |
| "[Caso fuera del alcance del skill]" | Redirige al skill correcto o clarifica límites | No hace: [anti-patrón] |

---

## 📋 Definition of Done

Antes de considerar una tarea terminada, verifica TODO:

### Calidad
- [ ] [Criterio de calidad 1]
- [ ] [Criterio de calidad 2]
- [ ] [Criterio de calidad 3]

### Tests
- [ ] [Criterio de testing 1]
- [ ] [Criterio de testing 2]

### Documentación
- [ ] [Criterio de documentación 1]
- [ ] [Criterio de documentación 2]

---

*Skill version: ${CURRENT_VERSION} | LMAgent Framework | Anthropic Skills v2.0 compatible*
`;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
    console.log(c.bold(`\n🛠️  LMAgent Skill Generator v${CURRENT_VERSION}`));
    console.log(c.dim('   Anthropic Skills v2.0 compatible\n'));

    const prompt = createPrompt();

    try {
        // ── Datos básicos ─────────────────────────────────────
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

        const description = await prompt.ask('Descripción (capability del skill — qué puede hacer para el usuario)');
        const role = await prompt.ask('Rol profesional', `Experto en ${name}`);
        const icon = await prompt.ask('Icono (emoji)', '🔧');

        // ── Tipo y categoría ──────────────────────────────────
        const typeRaw = await prompt.ask('Tipo (agent_persona / methodology)', 'agent_persona');
        const type = VALID_TYPES.includes(typeRaw) ? typeRaw : 'agent_persona';

        const categoryRaw = await prompt.ask('Categoría (capability_uplift / encoded_preferences)', 'capability_uplift');
        const category = VALID_CATEGORIES.includes(categoryRaw) ? categoryRaw : 'capability_uplift';

        // ── Campos Anthropic Skills v2.0 ──────────────────────
        console.log(c.dim('\n  — Campos Anthropic Skills v2.0 —'));
        const userInvocable = await prompt.askYesNo('¿Disponible como /slash-command? (user-invocable)', true);

        // ── Metadata LMAgent ──────────────────────────────────
        console.log(c.dim('\n  — Metadata LMAgent —'));
        const expertise = await prompt.askList('Áreas de expertise');
        const activatesOn = await prompt.askList('Contextos de activación');

        const triggerSuggestion = `/${slug.split('-')[0]}`;
        const triggersRaw = await prompt.askList('Triggers (con /)', `ej: ${triggerSuggestion}`);
        const triggers = triggersRaw.length > 0 ? triggersRaw : [triggerSuggestion];

        const createDirs = await prompt.askYesNo('¿Crear subdirectorios (scripts/, references/, assets/)?', false);

        // ── Resumen ───────────────────────────────────────────
        console.log(c.bold('\n📋 Resumen:'));
        console.log(`   ${c.dim('name:')}           ${c.cyan(slug)}`);
        console.log(`   ${c.dim('description:')}    ${description.substring(0, 60)}${description.length > 60 ? '...' : ''}`);
        console.log(`   ${c.dim('user-invocable:')} ${userInvocable}`);
        console.log(`   ${c.dim('type:')}           ${type} / ${category}`);
        console.log(`   ${c.dim('role:')}           ${role}`);
        console.log(`   ${c.dim('icon:')}           ${icon}`);
        console.log(`   ${c.dim('triggers:')}       ${triggers.join(', ')}`);
        console.log(`   ${c.dim('expertise:')}      ${expertise.slice(0, 3).join(', ')}${expertise.length > 3 ? '...' : ''}`);

        const confirm = await prompt.askYesNo('\n¿Crear skill?', true);
        if (!confirm) {
            console.log(c.yellow('\n⚠️  Cancelado.\n'));
            process.exit(0);
        }

        // ── Crear estructura ──────────────────────────────────
        mkdirSync(skillDir, { recursive: true });
        if (createDirs) {
            ['scripts', 'references', 'assets'].forEach(dir =>
                mkdirSync(join(skillDir, dir), { recursive: true })
            );
        }

        // ── Generar y escribir SKILL.md ───────────────────────
        const skillMd = generateSkillMd({
            name, slug, description, role, icon,
            type, category, userInvocable,
            expertise, activatesOn, triggers,
        });

        writeFileSync(join(skillDir, 'SKILL.md'), skillMd, 'utf-8');

        console.log(c.green(`\n✅ Skill creado: ${skillDir}`));
        console.log(c.dim('   Completa las secciones [...] en SKILL.md'));
        console.log(c.dim('   Añade ≥2 filas reales en la sección ## Evals'));
        console.log(c.dim(`   Valida: node scripts/validate_skills.js ${slug}\n`));

    } finally {
        prompt.close();
    }
}

main().catch(console.error);

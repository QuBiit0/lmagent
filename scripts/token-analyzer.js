#!/usr/bin/env node
// ============================================================
// LMAgent Token Analyzer
// Mide el consumo de tokens del framework instalado en el proyecto
// Uso: node scripts/token-analyzer.js [--json] [--report]
// ============================================================

const fs = require('fs');
const path = require('path');

const PKG_VERSION = require('../package.json').version;

// Estimación estándar: ~4 chars = 1 token (GPT/Claude/Gemini)
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}

function fileSizeKB(bytes) {
    return (bytes / 1024).toFixed(1);
}

function scanDir(dir, extensions = ['.md', '.txt', '.mdc', '.toml', '.cursorrules']) {
    const results = [];
    if (!fs.existsSync(dir)) return results;
    const walk = (current) => {
        for (const item of fs.readdirSync(current)) {
            const full = path.join(current, item);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                walk(full);
            } else if (extensions.some(ext => item.endsWith(ext))) {
                const content = fs.readFileSync(full, 'utf8');
                results.push({
                    file: path.relative(process.cwd(), full),
                    bytes: stat.size,
                    tokens: estimateTokens(content),
                    chars: content.length,
                });
            }
        }
    };
    walk(dir);
    return results;
}

function sumTokens(items) {
    return items.reduce((acc, i) => acc + i.tokens, 0);
}

function sumBytes(items) {
    return items.reduce((acc, i) => acc + i.bytes, 0);
}

function formatNum(n) {
    return n.toLocaleString('en-US');
}

function padEnd(str, len) {
    return String(str).padEnd(len);
}

function padStart(str, len) {
    return String(str).padStart(len);
}

function row(label, files, tokens, kb) {
    return `│ ${padEnd(label, 21)}│ ${padStart(files, 8)} │ ${padStart('~' + formatNum(tokens), 9)} │ ${padStart(kb + ' KB', 8)} │`;
}

function divider() {
    return '├───────────────────────┼──────────┼───────────┼──────────┤';
}

function analyze(options = {}) {
    const projectRoot = process.cwd();

    // Detectar qué agentes están instalados
    // Detectar qué agentes están instalados
    const agentDirs = [
        { name: 'Cursor', rulesDir: '.cursor/rules', skillsDir: '.cursor/skills' },
        { name: 'Claude Code', rulesDir: '.claude/rules', skillsDir: '.claude/skills' },
        { name: 'Antigravity', rulesDir: '.agent/rules', skillsDir: '.agent/skills' },
        { name: 'Gemini CLI', rulesDir: '.gemini/rules', skillsDir: '.gemini/skills' },
        { name: 'Windsurf', rulesDir: '.windsurf/rules', skillsDir: '.windsurf/skills' },
        { name: 'Cline', rulesDir: '.clinerules', skillsDir: '.cline/skills' },
        { name: 'Roo Code', rulesDir: '.roo/rules', skillsDir: '.roo/skills' },
        { name: 'VSCode Copilot', rulesDir: '.github/instructions', skillsDir: '.github/skills' },
        { name: 'Augment', rulesDir: '.augment/rules', skillsDir: '.augment/skills' },
        { name: 'Continue', rulesDir: '.continue/rules', skillsDir: '.continue/skills' },
        { name: 'Codex', rulesDir: '.codex', skillsDir: '.codex/skills' },
        { name: 'OpenHands', rulesDir: '.openhands/microagents', skillsDir: '.openhands/skills' },
        { name: 'Junie', rulesDir: '.junie', skillsDir: '.junie/skills' },
        { name: 'Goose', rulesDir: '.goose', skillsDir: '.goose/skills' },
    ];

    const installedAgents = agentDirs.filter(a =>
        fs.existsSync(path.join(projectRoot, a.rulesDir)) ||
        fs.existsSync(path.join(projectRoot, a.skillsDir))
    );

    // ── Entry Points (archivos raíz que el agente lee al arrancar) ──
    const entryFiles = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules', '.continuerules', '.goosehints',
        '.openhands/microagents/repo.md', '.junie/guidelines.md', '.github/copilot-instructions.md'];
    const entryItems = entryFiles
        .map(f => path.join(projectRoot, f))
        .filter(f => fs.existsSync(f))
        .map(f => {
            const content = fs.readFileSync(f, 'utf8');
            return { file: path.relative(projectRoot, f), bytes: fs.statSync(f).size, tokens: estimateTokens(content), chars: content.length };
        });

    // ── Skills ──
    const skillsItems = [];
    for (const agent of installedAgents) {
        const dir = path.join(projectRoot, agent.skillsDir);
        skillsItems.push(...scanDir(dir));
    }
    // Deduplicar por contenido (mismo archivo copiado a múltiples agentes)
    const skillsSeen = new Set();
    const skillsUniq = skillsItems.filter(i => {
        const key = path.basename(path.dirname(i.file)) + '/' + path.basename(i.file);
        if (skillsSeen.has(key)) return false;
        skillsSeen.add(key);
        return true;
    });

    // ── Rules ──
    const rulesItems = [];
    for (const agent of installedAgents) {
        const dir = path.join(projectRoot, agent.rulesDir);
        rulesItems.push(...scanDir(dir));
    }
    const rulesSeen = new Set();
    const rulesUniq = rulesItems.filter(i => {
        const key = path.basename(i.file);
        if (rulesSeen.has(key)) return false;
        rulesSeen.add(key);
        return true;
    });

    // ── Workflows ──
    const workflowsItems = [];
    const workflowDirs = installedAgents.map(a => a.skillsDir.replace('/skills', '/workflows'));
    for (const dir of workflowDirs) {
        workflowsItems.push(...scanDir(path.join(projectRoot, dir)));
    }
    const wfSeen = new Set();
    const workflowsUniq = workflowsItems.filter(i => {
        const key = path.basename(i.file);
        if (wfSeen.has(key)) return false;
        wfSeen.add(key);
        return true;
    });

    // ── Totales ──
    const totalTokens = sumTokens(entryItems) + sumTokens(skillsUniq) + sumTokens(rulesUniq) + sumTokens(workflowsUniq);
    const totalFiles = entryItems.length + skillsUniq.length + rulesUniq.length + workflowsUniq.length;
    const totalBytes = sumBytes(entryItems) + sumBytes(skillsUniq) + sumBytes(rulesUniq) + sumBytes(workflowsUniq);

    // ── Overhead real por sesión ──
    // Solo se carga: entry point + 1 skill activo (on-demand)
    const avgEntryTokens = sumTokens(entryItems);
    const avgSkillTokens = skillsUniq.length > 0
        ? Math.round(sumTokens(skillsUniq) / skillsUniq.length)
        : 0;
    const sessionOverhead = avgEntryTokens + avgSkillTokens;

    const data = {
        version: PKG_VERSION,
        installedAgents: installedAgents.map(a => a.name),
        categories: {
            entryPoints: { files: entryItems.length, tokens: sumTokens(entryItems), bytes: sumBytes(entryItems) },
            skills: { files: skillsUniq.length, tokens: sumTokens(skillsUniq), bytes: sumBytes(skillsUniq) },
            rules: { files: rulesUniq.length, tokens: sumTokens(rulesUniq), bytes: sumBytes(rulesUniq) },
            workflows: { files: workflowsUniq.length, tokens: sumTokens(workflowsUniq), bytes: sumBytes(workflowsUniq) },
        },
        total: { files: totalFiles, tokens: totalTokens, bytes: totalBytes },
        sessionOverhead: { tokens: sessionOverhead, entryPoints: avgEntryTokens, avgSkill: avgSkillTokens },
    };

    if (options.json) {
        console.log(JSON.stringify(data, null, 2));
        return;
    }

    // ── Tabla visual ──
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log(`║       LMAgent Token Analyzer v${PKG_VERSION}${' '.repeat(Math.max(0, 22 - PKG_VERSION.length))}║`);
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');

    if (installedAgents.length === 0) {
        console.log('⚠️  No se detectó ningún agente instalado en este proyecto.');
        console.log('   Ejecuta `lmagent install` primero.');
        return;
    }

    console.log(`🤖  Agentes detectados: ${installedAgents.map(a => a.name).join(', ')}`);
    console.log('');
    console.log('📊  Análisis de Consumo de Tokens del Framework');
    console.log('');
    console.log('┌───────────────────────┬──────────┬───────────┬──────────┐');
    console.log('│ Categoría             │ Archivos │  Tokens   │   Tamaño │');
    console.log('├───────────────────────┼──────────┼───────────┼──────────┤');
    console.log(row('Entry Points', entryItems.length, sumTokens(entryItems), fileSizeKB(sumBytes(entryItems))));
    console.log(row(`Skills (${skillsUniq.length} únicos)`, skillsUniq.length, sumTokens(skillsUniq), fileSizeKB(sumBytes(skillsUniq))));
    console.log(row('Rules', rulesUniq.length, sumTokens(rulesUniq), fileSizeKB(sumBytes(rulesUniq))));
    console.log(row('Workflows', workflowsUniq.length, sumTokens(workflowsUniq), fileSizeKB(sumBytes(workflowsUniq))));
    console.log('├───────────────────────┼──────────┼───────────┼──────────┤');
    console.log(row('TOTAL FRAMEWORK', totalFiles, totalTokens, fileSizeKB(totalBytes)));
    console.log('└───────────────────────┴──────────┴───────────┴──────────┘');
    console.log('');
    console.log('⚡  Overhead real por sesión (contexto auto-cargado):');
    console.log('');
    console.log(`   Sin framework:   0 tokens de contexto de agente`);
    console.log(`   Entry points:    ~${formatNum(avgEntryTokens)} tokens (leídos siempre)`);
    console.log(`   Skill activo:    ~${formatNum(avgSkillTokens)} tokens promedio (on-demand)`);
    console.log(`   ─────────────────────────────────────────────────`);
    console.log(`   Overhead real:   ~${formatNum(sessionOverhead)} tokens por sesión  ← BAJO`);
    console.log('');
    console.log('💡  Los skills NO se cargan todos juntos. Solo se activa');
    console.log('   el skill que el agente invoca (/dev, /front, /arch, etc.)');
    console.log('');

    if (options.report) {
        generateReport(data, projectRoot);
    }
}

function generateReport(data, projectRoot) {
    const reportDir = path.join(projectRoot, '.agents');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

    const reportPath = path.join(reportDir, 'token-report.md');
    const now = new Date().toISOString().split('T')[0];

    const md = `# LMAgent Token Report v${data.version}
> Generado: ${now}

## Agentes instalados
${data.installedAgents.map(a => `- ${a}`).join('\n')}

## Consumo por categoría

| Categoría | Archivos | Tokens (est.) | Tamaño |
|:---|---:|---:|---:|
| Entry Points | ${data.categories.entryPoints.files} | ~${formatNum(data.categories.entryPoints.tokens)} | ${fileSizeKB(data.categories.entryPoints.bytes)} KB |
| Skills | ${data.categories.skills.files} | ~${formatNum(data.categories.skills.tokens)} | ${fileSizeKB(data.categories.skills.bytes)} KB |
| Rules | ${data.categories.rules.files} | ~${formatNum(data.categories.rules.tokens)} | ${fileSizeKB(data.categories.rules.bytes)} KB |
| Workflows | ${data.categories.workflows.files} | ~${formatNum(data.categories.workflows.tokens)} | ${fileSizeKB(data.categories.workflows.bytes)} KB |
| **TOTAL** | **${data.total.files}** | **~${formatNum(data.total.tokens)}** | **${fileSizeKB(data.total.bytes)} KB** |

## Overhead real por sesión

| Componente | Tokens |
|:---|---:|
| Entry Points (siempre cargados) | ~${formatNum(data.sessionOverhead.entryPoints)} |
| Skill activo (promedio, on-demand) | ~${formatNum(data.sessionOverhead.avgSkill)} |
| **Total overhead por sesión** | **~${formatNum(data.sessionOverhead.tokens)}** |

> Los skills **no** se cargan todos juntos. Solo se activa el skill que el agente invoca.
`;

    fs.writeFileSync(reportPath, md, 'utf8');
    console.log(`📄  Reporte guardado en: ${reportPath}`);
}

// CLI directo
const args = process.argv.slice(2);
const options = {
    json: args.includes('--json'),
    report: args.includes('--report'),
};
analyze(options);

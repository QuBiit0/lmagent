# 🤖 LMAgent Intelligence Catalog

> Catálogo completo de capacidades del ecosistema **LMAgent v2.6.8**.
> Última actualización: 2026-02-11

---

## 🏗️ 1. Skills (Capacidades Ejecutables)
*Ubicación: Tu directorio de configuración de agente. Consulta la siguiente tabla para encontrar tu ruta:*

| IDE / Agente | Ruta de Configuración |
| :--- | :--- |
| **Cursor** | `.cursor/` |
| **Windsurf** | `.windsurf/` |
| **VSCode / Copilot** | `.github/` |
| **Zed** | `.rules/` |
| **Antigravity** | `.agent/` |
| **Claude Code** | `.claude/` |
| **Cline / Roo Code** | `.clinerules/` / `.roo/` |
| **Continue** | `.continue/` |
| **Trae** | `.trae/` |
| **Qodo** | `agents/` |
| **Amp / Kimi / Replit** | `.agents/` |
| **Augment** | `.augment/` |
| **Codex** | `.codex/` |
| **Gemini CLI** | `.gemini/` |
| **OpenCode** | `.opencode/` |
| **OpenHands** | `.openhands/` |
| **Goose** | `.goose/` |
| **Mistral Vibe** | `.vibe/` |
| **Envoid (OpenClaw)** | `openclaw.json` |
| **CodeBuddy** | `.codebuddy/` |
| **Command Code** | `.commandcode/` |
| **Crush** | `.crush/` |
| **Droid** | `.factory/` |
| **Junie** | `.junie/` |
| **iFlow** | `.iflow/` |
| **Kilo Code** | `.kilocode/` |
| **Kiro** | `.kiro/` |
| **Kode** | `.kode/` |
| **MCPJam** | `.mcpjam/` |
| **Mux** | `.mux/` |
| **Pi** | `.pi/` |
| **Qoder** | `.qoder/` |
| **Qwen Code** | `.qwen/` |
| **Trae CN** | `.trae-cn/` |
| **Zencoder** | `.zencoder/` |
| **Neovate** | `.neovate/` |
| **Pochi** | `.pochi/` |
| **AdaL** | `.adal/` |

Skills son unidades especializadas que definen el comportamiento del agente para dominios específicos. Cada skill contiene:

```
skills/{skill-name}/
├── SKILL.md           # Instrucciones, system prompt, checklists
├── scripts/           # Scripts Python ejecutables
├── references/        # Documentos de referencia (guías, patrones)
└── assets/            # Archivos de datos (YAML, SQL, templates)
```

### 🎯 Meta-Skill

| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **orchestrator** | `/orch`, `/start` | Meta-agent que clasifica tareas, selecciona el skill apropiado y enruta al workflow correcto |

### 🔧 Engineering

| Skill | Triggers | Descripción | Extras |
|-------|----------|-------------|--------|
| **backend-engineer** | `/dev`, `/backend`, `/api`, `/fix` | APIs, lógica de negocio, bases de datos (FastAPI, NestJS) | **Uso:** Implementación código. **Vs API Designer:** Backend codifica; Designer define contrato. |
| **frontend-engineer** | `/front`, `/ui`, `/react` | React, Next.js, interfaces web, accesibilidad | `scripts/audit_bundle.py`, `references/accessibility-guide.md` |
| **mobile-engineer** | `/mobile`, `/rn`, `/ios`, `/android` | React Native, Expo, iOS/Android | `references/platform-guidelines.md` |
| **data-engineer** | `/data`, `/db`, `/sql`, `/etl` | PostgreSQL, ETL, migraciones, índices | `scripts/backup_postgres.py`, `references/index-strategy.md`, `assets/pg-monitoring-queries.sql` |
| **devops-engineer** | `/devops`, `/infra`, `/deploy`, `/docker` | CI/CD, Docker, Kubernetes, Terraform | `scripts/docker_healthcheck.py`, `references/ci-cd-patterns.md` |
| **performance-engineer** | `/perf`, `/slow`, `/optimize`, `/load` | Profiling, caching, load testing | `scripts/profile_endpoint.py`, `references/caching-patterns.md` |
| **security-analyst** | `/sec`, `/audit`, `/auth` | OWASP, auditoría de código, vulnerabilidades | `scripts/audit_security.py`, `references/owasp-top10.md` |
| **qa-engineer** | `/qa`, `/test`, `/bug` | Testing, cobertura, E2E (Playwright, pytest, jest) | **Uso:** Ejecución de tests. **Vs Strategist:** QA escribe/corre code; Strategist define plan. |
| **code-reviewer** | `/review`, `/critique` | Análisis estático, logic verification, clean code | `references/code-review-checklist.md` |
| **systematic-debugger** | `/debug`, `/fix` | Debugging metódico, root cause analysis | **Uso:** Análisis profundo manual. **Vs SWE:** Debugger diagnostica; SWE resuelve autónomamente. |
| **api-designer** | `/api-design`, `/openapi` | Diseño de contratos API, REST/GraphQL | `references/api-standards.md` |
| **supabase-expert** | `/supabase`, `/rls` | Backend as a Service, Auth, DB, Edge Functions | `references/supabase-patterns.md` |
| **git-workflow** | `/git`, `/commit` | Gestión de ramas, conventional commits, PRs | `references/git-flow.md` |
| **browser-agent** | `/browser`, `/scrape` | Automatización web, scraping, testing UI | `scripts/playwright_setup.ts` |
| **seo-auditor** | `/seo`, `/audit` | Auditoría técnica SEO, Core Web Vitals, accesibilidad | `references/seo-checklist.md` |

### 🤖 AI & Automation

| Skill | Triggers | Descripción | Extras |
|-------|----------|-------------|--------|
| **ai-agent-engineer** | `/agent`, `/mcp`, `/tool` | Agentes IA, MCP servers, tool-use, RAG | `references/agent-patterns.md` |
| **automation-engineer** | `/auto`, `/n8n`, `/webhook` | n8n workflows, automatizaciones, webhooks | `references/n8n-patterns.md` |
| **prompt-engineer** | `/prompt`, `/cot`, `/llm` | Optimización de prompts, evaluación, few-shot | `references/prompt-patterns.md` |
| **mcp-builder** | `/mcp`, `/server` | Construcción de servidores MCP y herramientas | `references/mcp-server-guide.md` |
| **document-generator** | `/pdf`, `/docx` | Generación de reportes y documentos programáticos | `references/pdf-generation.md` |

### 📋 Management & Process

| Skill | Triggers | Descripción | Extras |
|-------|----------|-------------|--------|
| **product-manager** | `/pm`, `/product`, `/prd` | PRD, user stories, roadmap, priorización | `references/prioritization-frameworks.md` |
| **architect** | `/arch`, `/design`, `/system` | Diseño de sistemas, C4, ADRs, NFRs | `references/c4-model.md` |
| **tech-lead** | `/tl`, `/review`, `/adr`, `/debt` | Code review, decisiones técnicas, mentoring | `references/code-review-checklist.md` |
| **scrum-master** | `/sm`, `/agile`, `/coach` | Ceremonias Scrum, sprints, retrospectivas | `references/sprint-ceremonies.md` |
| **technical-writer** | `/doc`, `/readme`, `/guide` | Documentación, API refs, guías de usuario | `references/doc-templates.md` |
| **ux-ui-designer** | `/ux`, `/ui`, `/design` | Design systems, UX research, accesibilidad | `references/design-system-foundation.md` |

## 📚 2. Knowledge Base (Documentación)
*Ubicación: `docs/` en la raíz del proyecto.*

El agente debe consultar estos archivos si el usuario tiene dudas sobre el framework:

| Archivo | Propósito |
| :--- | :--- |
| `docs/getting-started.md` | Configuración inicial y primeros pasos |
| `docs/usage-guide.md` | Cómo interactuar con el agente y comandos |
| `docs/customization-guide.md` | Cómo crear nuevos skills o reglas |
| `docs/commands.md` | Referencia de comandos CLI (`lmagent ...`) |
| `docs/navigation-index.md` | Mapa completo de archivos y sus relaciones |

### 📐 Methodologies

| Skill | Triggers | Descripción | Extras |
|-------|----------|-------------|--------|
| **bmad-methodology** | `/bmad` | Scale-Adaptive Intelligence, niveles 0-4, kickoff | `references/scale-adaptive-levels.md` |
| **swe-agent** | `/swe`, `/issue-solve`, `/trajectory` | Resolución autónoma de issues, Edit-Lint-Test loops | `references/trajectory-format.md` |
| **spec-driven-dev** | `/spec-dev`, `/sdd-skill`, `/spec-method` | Pipeline: SPECIFY → PLAN → TASKS → IMPLEMENT → VERIFY | `references/phase-gates.md` |

---

## 📜 2. Rules (Guardrails de Comportamiento)
*Ubicación: `rules/`*

Rules definen **CÓMO** debe comportarse el agente. Son restricciones y estándares que aplican siempre.

| Rule File | Propósito |
|-----------|----------|
| **agents-ia.md** | Directrices core para construir agentes IA (Tool-first, Stateless, Observable) |
| **api-design.md** | Estándares REST/GraphQL, error handling, versionado |
| **automations-n8n.md** | Best practices para workflows n8n robustos |
| **code-style.md** | Linter, naming conventions, estructura de proyecto |
| **documentation.md** | Estándares para comentarios, READMEs, ADRs. **⚠️ Regla de documentación continua** |
| **security.md** | **Crítica**: Validación de inputs, gestión de secretos, OWASP Top 10 |
| **stack.md** | Stack tecnológico aprobado y librerías autorizadas |
| **testing.md** | TDD obligatorio, requisitos de cobertura |
| **workflow.md** | Git flow, convenciones de commits, contribución |

---

## ⚡ 3. Workflows (Procedimientos Operativos)
*Ubicación: `workflows/`*

Workflows son **SOPs (Standard Operating Procedures)** que guían al agente en procesos complejos multi-paso.

> **Instrucción para Agente**: Antes de iniciar una tarea compleja, **verifica si existe un workflow** aquí. Si existe, **LÉELO** y síguelo paso a paso.

| Workflow | Propósito |
|----------|----------|
| **bugfix-backend.md** | Protocolo para diagnosticar, corregir y verificar bugs de backend |
| **documentation.md** | Guía para actualizar y mantener la documentación del proyecto |
| **generate-prd.md** | Template e instrucciones para crear Product Requirement Documents |
| **ideation.md** | Proceso de brainstorming para nuevas features o productos |
| **new-agent-ia.md** | Guía end-to-end para crear un nuevo agente IA desde cero |
| **new-automation.md** | Pasos para diseñar y desplegar una nueva automatización (n8n/script) |
| **new-feature.md** | Flujo estándar: Ticket → Design → Implementation → Test → PR |
| **optimize-performance.md** | Enfoque sistemático para identificar y corregir bottlenecks |
| **resolve-github-issue.md** | Flujo estándar para resolver GitHub Issues de forma autónoma |
| **security-review.md** | Checklist para auditorías de seguridad pre-deployment |
| **spec-driven.md** | Metodología de desarrollo basada en especificaciones (Spec-First) |
| **testing-strategy.md** | Definir la pirámide de testing y estrategia para una feature |
| **third-party-integration.md** | Guía para integrar APIs y SDKs de terceros de forma segura |

---

## 🔧 4. Config (Configuración)
*Ubicación: `config/`*

| Archivo | Propósito |
|---------|----------|
| **settings.yaml** | Configuración global del framework (niveles, idioma, autonomía) |
| **levels.yaml** | Definición de los niveles de complejidad (0-4) |
| **models.yaml** | Configuración de modelos LLM (providers, fallbacks, costos) |
| **tools.yaml** | Registry de herramientas disponibles |
| **tools-extended.yaml** | Herramientas extendidas (database, sandbox, etc.) |
| **commands.yaml** | Comandos CLI del framework |

---

## 📦 5. Templates (Plantillas de Proyecto)
*Ubicación: `templates/`*

👉 **[Ver Guía de Uso de Templates](templates/USAGE.md)**

> **Instrucción para Agente**: Cuando debas crear nuevos archivos o proyectos, **usa estos templates como referencia** para mantener la consistencia, no inventes estructuras desde cero.

| Template | Descripción |
|----------|-------------|
| **backend-python/** | FastAPI backend con SQLModel |
| **agent-python/** | Agente IA basado en Python |
| **frontend-react/** | Frontend React (template base) |
| **database/** | Esquema base de PostgreSQL |
| **PROJECT_KICKOFF.md** | Template de kickoff de proyecto |
| **spec.yaml** | Template de especificaciones |
| **plan.yaml** | Template de plan |
| **tasks.yaml** | Template de tareas |
| **session.yaml** | Template de sesión |
| **checkpoint.yaml** | Template de checkpoint |

---

## 💾 Installation

```bash
npx lmagent install
```

Para desarrollo local:

```bash
git clone https://github.com/QuBit/lmagent.git
cd lmagent
npm install
npm link
lmagent install
```

# 🚀 LMAgent Bootstrap — Instrucciones Iniciales

> **Tipo**: `rule` | **Versión**: 3.1.9 | **Prioridad**: MÁXIMA
> Esta regla se aplica **SIEMPRE** como primer paso antes de cualquier tarea.

---

## 📌 Startup Check (Auto-Start)

**¿Existe `PROJECT_KICKOFF.md` en la raíz del proyecto?**
- **SÍ** → Activa el skill `product-manager` (`/pm`) y ejecuta el workflow `spec-driven`.
- **NO** → Continuar con el flujo normal.

---

## 🧠 Framework

Este archivo define la identidad, propósito y reglas fundamentales de **LMAgent v3.1.6**. Antes de implementar cualquier cambio:

1. **Lee `AGENTS.md`** — Catálogo completo de skills, rules y workflows
2. **Clasifica la tarea** — Nivel 0-4 según complejidad (ver `.agents/rules/01-workflow.md`)
3. **Activa el skill apropiado** — Según la tabla de abajo

---

## 🤖 Activación de Skills por IDE

**La forma de activar skills depende del IDE:**

| IDE | Mecanismo | Ejemplo |
|-----|-----------|---------|
| **Cursor** | `/slash-commands` nativos del IDE | Escribir `/dev` en el chat |
| **Antigravity** | Automático por contexto | El agente lee `SKILL.md` al detectar tarea relevante |
| **Claude Code** | Lectura de `SKILL.md` | El agente accede al directorio `skills/` |
| **Otros IDEs** | Según configuración del IDE | Ver documentación del IDE |

> **En Antigravity**: Los triggers como `/dev` o `/pm` **no son comandos ejecutables**. Son convenciones para que el agente identifique qué skill activar. El agente debe:
> 1. Detectar la naturaleza de la tarea (ej: "crear endpoint" → backend)
> 2. Leer el `SKILL.md` completo del skill relevante
> 3. Adoptar el rol, principios y patrones descritos
> 4. Seguir la "Definition of Done" del skill

---

## 🎯 Skills Disponibles (31)

Activa el skill apropiado según la tarea. Cada skill tiene `SKILL.md` con instrucciones detalladas, y opcionalmente `scripts/`, `references/` y `assets/`.

### Meta-Skill
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **orchestrator** | `/orch`, `/start` | Meta-agent: clasifica tareas y enruta al skill correcto |

### Engineering
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **backend-engineer** | `/dev`, `/backend`, `/api`, `/fix` | APIs, lógica de negocio, bases de datos |
| **frontend-engineer** | `/front`, `/ui`, `/react` | React, Next.js, interfaces web |
| **mobile-engineer** | `/mobile`, `/rn`, `/ios`, `/android` | React Native, Expo, apps móviles |
| **data-engineer** | `/data`, `/db`, `/sql`, `/etl` | PostgreSQL, ETL, migraciones |
| **devops-engineer** | `/devops`, `/infra`, `/deploy`, `/docker` | CI/CD, Docker, Kubernetes |
| **performance-engineer** | `/perf`, `/slow`, `/optimize`, `/load` | Profiling, caching, optimización |
| **security-analyst** | `/sec`, `/audit`, `/auth` | OWASP, auditoría, vulnerabilidades |
| **qa-engineer** | `/qa`, `/test`, `/bug` | Testing, cobertura, E2E |
| **systematic-debugger** | `/debug`, `/bug`, `/fix`, `/rca` | Debugging metódico en 4 fases, root cause analysis |

### Quality & Testing
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **code-reviewer** | `/review`, `/cr`, `/code-review` | Reviews sistemáticos multi-pass, anti-patrones |
| **testing-strategist** | `/tdd`, `/testing`, `/test-strategy` | TDD/BDD, testing pyramid, estrategia de tests |
| **git-workflow** | `/git`, `/branch`, `/release` | Branching, conventional commits, release management |
| **api-designer** | `/api`, `/endpoint`, `/rest`, `/graphql` | Diseño REST/GraphQL, OpenAPI, DX |

### AI & Automation
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **ai-agent-engineer** | `/agent`, `/tool` | Agentes IA, tool-use, multi-agent |
| **mcp-builder** | `/mcp`, `/mcp-server`, `/tool-builder` | MCP Servers, Tools, Resources, Prompts |
| **automation-engineer** | `/auto`, `/n8n`, `/webhook` | n8n workflows, automatizaciones |
| **prompt-engineer** | `/prompt`, `/cot`, `/llm` | Optimización de prompts |

### Platform & Tools
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **supabase-expert** | `/supa`, `/supabase`, `/rls`, `/edge-function` | RLS, Auth, Edge Functions, Realtime, Storage |
| **browser-agent** | `/browser`, `/scrape`, `/crawl`, `/automate` | Playwright/Puppeteer, scraping, flujos web automáticos |
| **document-generator** | `/pdf`, `/doc`, `/excel`, `/pptx` | Generación de PDF, DOCX, XLSX, PPTX programáticos |
| **seo-auditor** | `/seo`, `/audit`, `/lighthouse`, `/a11y` | SEO técnico, Core Web Vitals, WCAG, schema markup |

### Management & Process
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **product-manager** | `/pm`, `/product`, `/prd` | PRD, user stories, roadmap |
| **architect** | `/arch`, `/design`, `/system` | Diseño de sistemas, C4, ADRs |
| **tech-lead** | `/tl`, `/adr`, `/debt` | Decisiones técnicas, tech debt |
| **scrum-master** | `/sm`, `/agile`, `/coach` | Ceremonias, sprints, retrospectivas |
| **technical-writer** | `/doc`, `/readme`, `/guide` | Documentación, guías |
| **ux-ui-designer** | `/ux`, `/ui`, `/design` | Design systems, UX research |

### Methodologies
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **bmad-methodology** | `/bmad` | Scale-Adaptive Intelligence, niveles 0-4 |
| **swe-agent** | `/swe`, `/issue-solve`, `/trajectory` | Resolución autónoma de issues |
| **spec-driven-dev** | `/spec-dev`, `/sdd-skill`, `/spec-method` | Pipeline: Specify→Plan→Tasks→Implement→Verify |

---

### Estructura de Reglas (Orden de Lectura)

1. **[00-master.md](.agents/rules/00-master.md)**: Este índice.
2. **[01-workflow.md](.agents/rules/01-workflow.md)**: Ciclo de vida del desarrollo.
3. **[02-tech-stack.md](.agents/rules/02-tech-stack.md)**: Tecnologías y herramientas.
4. **[03-code-style.md](.agents/rules/03-code-style.md)**: Convenciones de código.
5. **[04-security.md](.agents/rules/04-security.md)**: Seguridad y secretos.
6. **[05-testing.md](.agents/rules/05-testing.md)**: Estrategias de prueba.
7. **[06-api-design.md](.agents/rules/06-api-design.md)**: Estándares REST API.
8. **[07-documentation.md](.agents/rules/07-documentation.md)**: Guías de documentación.
9. **[08-agents-ai.md](.agents/rules/08-agents-ai.md)**: Construcción de Agentes.
10. **[09-automations.md](.agents/rules/09-automations.md)**: Integraciones n8n.
11. **[10-git-flow.md](.agents/rules/10-git-flow.md)**: Gestión de versiones y commits.

---

## 📂 Estructura del Framework

```
rules/          → Guardrails de comportamiento (CÓMO)
skills/         → Capacidades especializadas (QUÉ)
  └── {skill}/
      ├── SKILL.md        → Instrucciones del skill
      ├── scripts/        → Scripts ejecutables
      ├── references/     → Guías y patrones
      └── assets/         → Templates, SQL, YAML
workflows/      → Procedimientos operativos (SOPs)
config/         → Configuración del framework
templates/      → Plantillas de proyecto
```

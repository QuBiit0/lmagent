# LMAgent Framework - Navigation Index

> **Quick Reference**: Find any resource in the framework instantly.
> 
> **Versión**: 3.0 (SPEC+LM) | **Actualizado**: 2026-01

---

## 🎯 Entry Points (Start Here)

| Archivo | Propósito | Cuándo Leer |
|---------|-----------|-------------|
| [AGENTS.md](../AGENTS.md) | **Main entry point** - Visual flow, commands, rules | ⭐ SIEMPRE primero |
| [README.md](../README.md) | Overview del proyecto, instalación | Setup inicial |
| [.agent/README.md](../.agent/README.md) | Config para Antigravity | Si usas Antigravity IDE |
| [CLAUDE.md](../CLAUDE.md) | Config para Claude Code | Si usas Claude Code |
| [.cursorrules](../.cursorrules) | Config para Cursor | Si usas Cursor |

---

## 👥 Personas & Metodologías (21 Total)

### Roles de Producto & Gestión

| Persona | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **Orchestrator** | [orchestrator.md](../personas/orchestrator.md) | `/orch` | Meta-routing, coordinación |
| **Product Manager** | [product-manager.md](../personas/product-manager.md) | `/pm` | Requisitos, PRDs, spec.yaml |
| **Scrum Master** | [scrum-master.md](../personas/scrum-master.md) | `/sm` | Agile, procesos, facilitación |
| **Tech Lead** | [tech-lead.md](../personas/tech-lead.md) | `/lead` | Decisiones técnicas, mentoring |

### Roles de Ingeniería

| Persona | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **Architect** | [architect.md](../personas/architect.md) | `/arch` | Diseño de sistemas, ADRs |
| **Backend Engineer** | [backend-engineer.md](../personas/backend-engineer.md) | `/dev` | Python, FastAPI, APIs |
| **Frontend Engineer** | [frontend-engineer.md](../personas/frontend-engineer.md) | `/frontend` | React, TypeScript |
| **Mobile Engineer** | [mobile-engineer.md](../personas/mobile-engineer.md) | `/mobile` | React Native |
| **DevOps Engineer** | [devops-engineer.md](../personas/devops-engineer.md) | `/devops` | CI/CD, Docker, K8s |
| **Data Engineer** | [data-engineer.md](../personas/data-engineer.md) | `/dba` | SQL, PostgreSQL, pipelines |

### Roles de IA & Automatización

| Persona | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **AI Agent Engineer** | [ai-agent-engineer.md](../personas/ai-agent-engineer.md) | `/ai` | Agentes, RAG, LangChain |
| **Prompt Engineer** | [prompt-engineer.md](../personas/prompt-engineer.md) | `/prompt` | System prompts, CoT |
| **Automation Engineer** | [automation-engineer.md](../personas/automation-engineer.md) | `/auto` | n8n, webhooks |

### Roles de Calidad & Seguridad

| Persona | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **QA Engineer** | [qa-engineer.md](../personas/qa-engineer.md) | `/qa` | Testing, E2E |
| **Security Analyst** | [security-analyst.md](../personas/security-analyst.md) | `/sec` | OWASP, compliance |
| **Performance Engineer** | [performance-engineer.md](../personas/performance-engineer.md) | `/perf` | Optimización |

### Roles de Documentación & UX

| Persona | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **Technical Writer** | [technical-writer.md](../personas/technical-writer.md) | `/writer` | Documentación |
| **UX/UI Designer** | [ux-ui-designer.md](../personas/ux-ui-designer.md) | `/ux` | Diseño, a11y |

### Metodologías

| Metodología | Archivo | Trigger | Especialidad |
|---------|---------|---------|--------------|
| **BMAD Methodology** | [bmad-methodology](../skills/bmad-methodology/SKILL.md) | `/bmad` | Scale-Adaptive Intelligence, kickoff |
| **SWE-Agent** | [swe-agent](../skills/swe-agent/SKILL.md) | `/swe` | Resolución autónoma de issues |
| **Spec-Driven Dev** | [spec-driven-dev](../skills/spec-driven-dev/SKILL.md) | `/spec-dev` | Pipeline SPECIFY→PLAN→TASKS→IMPL→VERIFY |

---

## 📋 Workflows (13 Total)

| Workflow | Archivo | Trigger | Nivel | Uso |
|----------|---------|---------|-------|-----|
| **SPEC DRIVEN** | [spec-driven.md](../workflows/spec-driven.md) | `/spec` | 2-4 | ⭐ Desarrollo completo |
| New Automation | [new-automation.md](../workflows/new-automation.md) | `/new-auto` | 2-3 | Backend + n8n |
| New AI Agent | [new-agent-ia.md](../workflows/new-agent-ia.md) | `/new-agent` | 2-3 | Crear agente IA |
| Bugfix Backend | [bugfix-backend.md](../workflows/bugfix-backend.md) | `/fix` | 1-2 | Arreglar bugs |
| Optimize Performance | [optimize-performance.md](../workflows/optimize-performance.md) | `/perf` | 2-3 | Optimización |
| Resolve GitHub Issue | [resolve-github-issue.md](../workflows/resolve-github-issue.md) | `/issue` | 1-3 | Issues automáticos |
| Security Review | [security-review.md](../workflows/security-review.md) | `/sec-review` | 2-4 | Auditoría |
| Generate PRD | [generate-prd.md](../workflows/generate-prd.md) | `/prd` | 2 | Documentos de producto |
| Ideation | [ideation.md](../workflows/ideation.md) | `/brainstorm` | 1-2 | Ideación |
| New Feature | [new-feature.md](../workflows/new-feature.md) | `/feature` | 2-3 | Features nuevos |
| Testing Strategy | [testing-strategy.md](../workflows/testing-strategy.md) | `/test-plan` | 2 | Estrategia de tests |
| Third Party Integration | [third-party-integration.md](../workflows/third-party-integration.md) | `/integrate` | 2-3 | Integraciones |
| Documentation | [documentation.md](../workflows/documentation.md) | `/docs` | 1-2 | Documentar |

---

## 📏 Rules (9 Total)

| Regla | Archivo | Prioridad | Descripción |
|-------|---------|-----------|-------------|
| **Documentation** | [documentation.md](../rules/documentation.md) | ⚠️ CRÍTICA | Documentar cambios siempre |
| Stack | [stack.md](../rules/stack.md) | Alta | Stack tecnológico |
| Workflow | [workflow.md](../rules/workflow.md) | Alta | Flujo de trabajo |
| Code Style | [code-style.md](../rules/code-style.md) | Alta | Guías de estilo |
| Agents IA | [agents-ia.md](../rules/agents-ia.md) | Alta | Reglas para agentes |
| Automations n8n | [automations-n8n.md](../rules/automations-n8n.md) | Media | n8n patterns |
| API Design | [api-design.md](../rules/api-design.md) | Media | Diseño de APIs |
| Security | [security.md](../rules/security.md) | Alta | Seguridad |
| Testing | [testing.md](../rules/testing.md) | Alta | Estrategias de testing |

---

## ✅ Checklists (5 Niveles)

| Nivel | Archivo | Tiempo | Confirmación |
|-------|---------|--------|--------------|
| Level 0: Trivial | [level-0-trivial.md](../checklists/level-0-trivial.md) | <5 min | No |
| Level 1: Small | [level-1-small.md](../checklists/level-1-small.md) | 5-30 min | No |
| Level 2: Medium | [level-2-medium.md](../checklists/level-2-medium.md) | 30m-2h | Sí |
| Level 3: Complex | [level-3-complex.md](../checklists/level-3-complex.md) | 2-8h | Sí + Artefactos |
| Level 4: Enterprise | [level-4-enterprise.md](../checklists/level-4-enterprise.md) | 8h+ | Governance |

---

## 📄 Templates (SPEC DRIVEN)

| Template | Archivo | Cuándo Usar |
|----------|---------|-------------|
| **PROJECT_KICKOFF.md** | [PROJECT_KICKOFF.md](../templates/PROJECT_KICKOFF.md) | ⭐ **INICIO**: Entry point para proyectos nuevos |
| **spec.yaml** | [spec.yaml](../templates/spec.yaml) | Fase 1: Especificación |
| **plan.yaml** | [plan.yaml](../templates/plan.yaml) | Fase 2: Plan de implementación |
| **tasks.yaml** | [tasks.yaml](../templates/tasks.yaml) | Fase 3: Tasks ejecutables |
| **session.yaml** | [session.yaml](../templates/session.yaml) | Estado persistente del proyecto |
| **checkpoint.yaml** | [checkpoint.yaml](../templates/checkpoint.yaml) | Auto-backups de estado |
| Agent Python | [agent-python/](../templates/agent-python/) | Scaffold para agentes IA |
| Backend Python | [backend-python/](../templates/backend-python/) | Scaffold para backend FastAPI |
| Frontend React | [frontend-react/](../templates/frontend-react/) | Scaffold para frontend React |
| Database | [database/](../templates/database/) | Esquemas de DB |

**Flujo único**: `PROJECT_KICKOFF.md` → `spec.yaml` → `plan.yaml` → `tasks.yaml` → CODE

---

## ⚙️ Configuration

| Config | Archivo | Descripción |
|--------|---------|-------------|
| Settings | [settings.yaml](../config/settings.yaml) | Configuración global |
| Levels | [levels.yaml](../config/levels.yaml) | Sistema de niveles |
| Tools | [tools.yaml](../config/tools.yaml) | Registry de herramientas |
| Tools Extended | [tools-extended.yaml](../config/tools-extended.yaml) | Tools adicionales |
| Commands | [commands.yaml](../config/commands.yaml) | Aliases de comandos |
| Models | [models.yaml](../config/models.yaml) | Configuración de LLMs |

---

## 🔍 "What to Read When..."

| Situación | Único Archivo a Leer |
|-----------|---------------------|
| **Proyecto nuevo (desde cero)** | `templates/PROJECT_KICKOFF.md` → completar → el agente hace el resto |
| **Proyecto existente + LMAgent** | `AGENTS.md` (entry point) |
| **Feature nuevo (L2+)** | Ejecutar `/spec [nombre]` |
| **Bug fix rápido** | `workflows/bugfix-backend.md` |
| **No sé qué persona usar** | Usar `/orch` (Orchestrator decide) |

### Flujo Único para Proyectos Nuevos

```
DESARROLLADOR                              AGENTE
────────────                               ──────
     │
     ▼
Crear PROJECT_KICKOFF.md
(5-10 minutos)
     │
     ▼
Abrir en IDE ─────────────────────────────▶ Detecta PROJECT_KICKOFF.md
                                                    │
                                                    ▼
                                            Ejecuta /spec workflow
                                                    │
                                                    ▼
                                            spec.yaml (← Aprobación)
                                                    │
                                                    ▼
                                            plan.yaml (← Aprobación)
                                                    │
                                                    ▼
                                            tasks.yaml
                                                    │
                                                    ▼
                                            CÓDIGO + TESTS
                                                    │
                                                    ▼
                                            PROYECTO LISTO ✅
```

---

## 🗺️ Relationship Map

```
                        ┌─────────────┐
                        │  AGENTS.md  │ ← Main Entry Point
                        └──────┬──────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    ┌───────────┐       ┌───────────┐       ┌───────────┐
    │  personas │       │ workflows │       │   rules   │
    │  (18)     │       │   (13)    │       │   (9)     │
    └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
          │                   │                   │
          │            ┌──────┴──────┐            │
          │            │             │            │
          ▼            ▼             ▼            ▼
    ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
    │ templates │ │ checklists│ │  config   │ │   docs    │
    │    (8)    │ │    (5)    │ │    (6)    │ │   (4)     │
    └───────────┘ └───────────┘ └───────────┘ └───────────┘
```

---

*LMAgent Framework v3.0 (SPEC+LM)*
*Navigation Index - Updated 2026-01*

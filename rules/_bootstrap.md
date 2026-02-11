# 🚀 LMAgent Bootstrap — Instrucciones Iniciales

> **Tipo**: `rule` | **Versión**: 2.3 | **Prioridad**: MÁXIMA
> Esta regla se aplica **SIEMPRE** como primer paso antes de cualquier tarea.

---

## 📌 Startup Check (Auto-Start)

**¿Existe `PROJECT_KICKOFF.md` en la raíz del proyecto?**
- **SÍ** → Activa el skill `product-manager` (`/pm`) y ejecuta el workflow `spec-driven`.
- **NO** → Continuar con el flujo normal.

---

## 🧠 Framework

Estás trabajando con **LMAgent v2.3.0**. Antes de implementar cualquier cambio:

1. **Lee `AGENTS.md`** — Catálogo completo de skills, rules y workflows
2. **Clasifica la tarea** — Nivel 0-4 según complejidad (ver `rules/workflow.md`)
3. **Activa el skill apropiado** — Según la tabla de abajo

---

## 🎯 Skills Disponibles (21)

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

### AI & Automation
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **ai-agent-engineer** | `/agent`, `/mcp`, `/tool` | Agentes IA, MCP servers, tool-use |
| **automation-engineer** | `/auto`, `/n8n`, `/webhook` | n8n workflows, automatizaciones |
| **prompt-engineer** | `/prompt`, `/cot`, `/llm` | Optimización de prompts |

### Management & Process
| Skill | Triggers | Descripción |
|-------|----------|-------------|
| **product-manager** | `/pm`, `/product`, `/prd` | PRD, user stories, roadmap |
| **architect** | `/arch`, `/design`, `/system` | Diseño de sistemas, C4, ADRs |
| **tech-lead** | `/tl`, `/review`, `/adr`, `/debt` | Code review, decisiones técnicas |
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

## ⚠️ Reglas Críticas

1. 📖 **Siempre leer AGENTS.md primero**
2. 🧠 **Activar el skill apropiado** para la tarea
3. 🎯 **Clasificar correctamente el nivel** (0-4)
4. 📝 **Planear antes de implementar** (Level 2+)
5. ✅ **Tests para todo código nuevo**
6. 📐 **Seguir patrones existentes** del proyecto
7. 🔄 **Commits pequeños y descriptivos**
8. 📚 **Documentar cambios significativos** (ver `rules/documentation.md`)
9. 🔒 **Nunca hardcodear secretos** — usar variables de entorno
10. ❓ **Si hay duda, preguntar**

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

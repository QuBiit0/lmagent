# LMAgent IDE Commands & Aliases

Este documento define los comandos rápidos para activar personas y funcionalidades.

## Personas

| Comando | Alias | Activa | Uso |
|---------|-------|--------|-----|
| `/pm` | `/product` | Product Manager | Requisitos, user stories, PRDs |
| `/arch` | `/architect` | Architect | Diseño de sistemas, ADRs |
| `/dev` | `/backend` | Backend Engineer | Implementación backend |
| `/frontend` | `/fe` | Frontend Engineer | React/Next.js, UI |
| `/auto` | `/n8n` | Automation Engineer | Automatizaciones, webhooks |
| `/ai` | `/agent` | AI Agent Engineer | Agentes de IA, prompts |
| `/qa` | `/test` | QA Engineer | Testing, calidad |
| `/sec` | `/security` | Security Analyst | Seguridad, auditoría |
| `/sm` | `/scrum` | Scrum Master | Ceremonias, métricas |
| `/orch` | `/orchestrator` | Orchestrator | Meta-routing automático |
| `/ux` | `/ui`, `/design` | UX/UI Designer | Diseño, accesibilidad |
| `/devops` | `/ops` | DevOps Engineer | CI/CD, infraestructura |
| `/dba` | `/db`, `/data` | Data Engineer | Base de datos, SQL |
| `/lead` | `/tl` | Tech Lead | Decisiones, mentoring |
| `/writer` | `/docs` | Technical Writer | Documentación |
| `/mobile` | `/rn` | Mobile Engineer | React Native, apps |
| `/perf` | `/performance` | Performance Engineer | Optimización |
| `/bmad` | `/kickoff`, `/classify` | BMAD Methodology | Scale-adaptive intelligence, niveles |
| `/swe` | `/issue-solve`, `/trajectory` | SWE-Agent | Resolución autónoma de issues |
| `/spec-dev` | `/sdd-skill`, `/spec-method` | Spec-Driven Dev | Pipeline SPECIFY→PLAN→TASKS→IMPL→VERIFY |

## Modos

| Comando | Descripción |
|---------|-------------|
| `/yolo` | Modo sin confirmaciones (Level 0-2) |
| `/verbose` | Respuestas detalladas |
| `/minimal` | Respuestas concisas |
| `/plan` | Solo planificar, no ejecutar |
| `/execute` | Ejecutar plan previamente aprobado |

## Workflows

| Comando | Workflow |
|---------|----------|
| `/new-auto` | new-automation.md |
| `/new-agent` | new-agent-ia.md |
| `/fix` | bugfix-backend.md |
| `/perf` | optimize-performance.md |
| `/issue` | resolve-github-issue.md |
| `/security-review` | security-review.md |
| `/prd` | generate-prd.md |
| `/brainstorm` | ideation.md |
| `/spec` | spec-driven.md |
| `/feature` | new-feature.md |

## Niveles

| Comando | Nivel | Confirmación |
|---------|-------|--------------|
| `/l0` | Trivial | No |
| `/l1` | Small | No |
| `/l2` | Medium | Sí |
| `/l3` | Complex | Sí + Artefactos |
| `/l4` | Enterprise | Múltiples |

## Ejemplos de Uso

```
Usuario: /pm Necesito definir requisitos para un sistema de login

→ Activa Product Manager, inicia análisis de requisitos
```

```
Usuario: /yolo /dev Arregla el typo en la línea 42 de app.py

→ Activa Backend Engineer en modo sin confirmación
```

```
Usuario: /issue #123

→ Inicia workflow de resolución autónoma de GitHub issue
```

```
Usuario: /brainstorm Ideas para mejorar el onboarding

→ Inicia sesión de ideación
```

## Configuración de Shortcuts

Para configurar en cada IDE:

### Antigravity
Los comandos se reconocen automáticamente al usar `/` al inicio.

### Cursor
Agregar en `.cursorrules`:
```
# Shortcuts
/pm = Activate Product Manager persona
/dev = Activate Backend Engineer persona
...
```

### Claude Code
Agregar en `CLAUDE.md`:
```markdown
## Quick Commands
- /pm: Product Manager mode
- /dev: Developer mode
...
```

### VS Code (con extensión)
Configurar snippets en `settings.json`.

## Combinaciones Avanzadas

```
/pm + /arch     # PM + Architect para diseño de producto técnico
/dev + /qa      # Dev + QA para TDD
/ai + /sec      # AI Engineer + Security para agentes seguros
/auto + /dev    # Automation + Dev para webhooks con backend
```

## Notas

- Los comandos son **case-insensitive** (`/PM` = `/pm`)
- Se pueden combinar comandos (`/yolo /dev`)
- El Orchestrator (`/orch`) decide automáticamente si no especificas

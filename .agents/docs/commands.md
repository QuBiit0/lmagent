# 📟 CLI Commands Reference
> **Versión**: 3.1.3 | **Paquete**: `@qubiit/lmagent`

## ⚡ Comando Principal

```bash
npx lmagent@latest
```
Ejecuta el instalador interactivo. Detecta automáticamente los agentes instalados en tu sistema y los pre-selecciona.

---

## 🎯 Comandos Core

### `lmagent install` / `lmagent update`
Instala o actualiza el framework en el proyecto actual.
- Detecta agentes instalados (Cursor, Claude Code, Windsurf, etc.)
- Copia skills, rules y workflows a cada agente
- Genera el entry point de auto-invocación por agente
- **Opciones**:
  - `-f, --force`: Sobrescribe archivos sin preguntar
  - `-y, --yes`: Modo no interactivo (acepta todo)
  - `-g, --global`: También sincroniza a `~/.agents/`

### `lmagent init`
Inicializa un proyecto nuevo con LMAgent.
- Copia `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` a la raíz
- Copia `config/`, `templates/`, `docs/`, `workflows/`
- **Opciones**:
  - `-f, --force`: Sobrescribe archivos existentes
  - `-y, --yes`: Sin confirmaciones

### `lmagent uninstall`
Elimina todos los archivos instalados por LMAgent del proyecto.
- Detecta agentes instalados y muestra qué se va a eliminar
- Pide confirmación antes de proceder
- **Opciones**:
  - `-f, --force`: Sin confirmación
  - `--all`: También elimina entry points raíz (CLAUDE.md, GEMINI.md, AGENTS.md, .cursorrules, etc.)

### `lmagent doctor`
Verifica que el proyecto esté correctamente configurado.
- Comprueba archivos críticos (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`)
- Verifica directorios de agentes instalados y sus `configFile`
- Revisa `.gitignore`

### `lmagent validate [skill]`
Valida la integridad de los Skills (frontmatter YAML, estructura de archivos).
- Sin argumento: valida todos los skills
- Con argumento: valida solo el skill especificado

### `lmagent create-skill`
Wizard interactivo para crear un nuevo Skill desde cero.
Genera la estructura estándar y el `SKILL.md` con frontmatter correcto.

### `lmagent tokens`
Analiza el consumo de tokens del framework instalado en el proyecto.
- Muestra breakdown por categoría (rules, skills, workflows, etc.)
- Destaca el overhead real de sesión (~2,200 tokens) vs. total del framework
- **Opciones**:
  - `--json`: Salida en formato JSON
  - `--report`: Genera reporte en `.agents/token-report.md`

### `lmagent skills add <owner/repo>`
Instala un skill externo desde GitHub (compatible con el estándar skills.sh).
- Clona el repositorio y detecta los skills disponibles
- Copia a `.agents/skills/`
- **Opciones**:
  - `--skill <name>`: Instala solo el skill especificado

---

## 💬 Triggers (Chat Interface)
Estos no son comandos de terminal — se escriben en el chat del agente para activar un skill.

| Trigger | Skill | Descripción |
|:---|:---|:---|
| `/orch` | orchestrator | Planificación y delegación de tareas |
| `/pm` | product-manager | PRDs, historias de usuario, roadmap |
| `/arch` | architect | Diseño de sistemas, patrones |
| `/lead` | tech-lead | Decisiones técnicas, mentoring |
| `/dev` | backend-engineer | APIs, base de datos, autenticación |
| `/front` | frontend-engineer | React, Next.js, UI/UX |
| `/mobile` | mobile-engineer | React Native, Expo |
| `/devops` | devops-engineer | Docker, CI/CD, Kubernetes |
| `/fix` | systematic-debugger | Debugging metódico (RCA) |
| `/sec` | security-analyst | Vulnerabilidades, OWASP |
| `/test` | qa-engineer | Testing E2E, estrategia de QA |
| `/ux` | ux-ui-designer | Diseño, sistemas de diseño |
| `/api` | api-designer | REST/GraphQL, OpenAPI |
| `/mcp` | mcp-builder | Servidores MCP |
| `/sdd` | spec-driven-dev | Desarrollo guiado por specs |
| `/bmad` | bmad-methodology | Metodología BMAD |

Ver catálogo completo en [AGENTS.md](../../AGENTS.md) — Sección 5.

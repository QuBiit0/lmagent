# LMAgent Framework v2.3.0 - Claude Code Instructions

> [!IMPORTANT]
> **ANTES DE HACER CUALQUIER COSA**: Este proyecto usa el framework **LMAgent v2.3.0**.
> **DEBES** leer `AGENTS.md` y `rules/_bootstrap.md` antes de implementar cualquier cambio.

## Framework

Estás trabajando con **LMAgent v2.3.0**, un framework para desarrollo de automatizaciones y agentes de IA. Organiza las capacidades del agente en tres pilares: **Skills**, **Rules** y **Workflows**.

## ⚡ Inicio Rápido

1. Lee `rules/_bootstrap.md` — **Entry point del framework** (startup check, 21 skills con triggers, reglas críticas)
2. Lee `AGENTS.md` — Catálogo completo de skills, rules y workflows
3. Lee las rules aplicables en `rules/`

## 🚀 STARTUP CHECK (Auto-Start)

> **¿Existe `PROJECT_KICKOFF.md`?**
> Si SÍ → Activa el skill **product-manager** (`/pm`) y ejecuta el workflow **SPEC DRIVEN**.

## ⚠️ REGLA CRÍTICA: Documentación Continua

> **SIEMPRE** actualiza la documentación al hacer cambios significativos.
> Ver: `rules/documentation.md` para detalles completos.

**Al terminar cada tarea:**
- ¿Creé algo nuevo? → Documentar
- ¿Cambié un patrón? → Actualizar reglas
- ¿Resolví un problema complejo? → Agregar notas

## 📂 Documentos Clave

| Documento | Propósito |
|-----------|----------|
| `rules/_bootstrap.md` | ⭐ Entry point: startup check, 21 skills con triggers, reglas |
| `AGENTS.md` | Catálogo completo de capacidades |
| `config/settings.yaml` | Configuración del framework |
| `rules/` | Guardrails de comportamiento (ver abajo) |
| `skills/` | 21 skills con `SKILL.md` + `scripts/` + `references/` + `assets/` |
| `workflows/` | 13 procedimientos operativos |
| `templates/` | Templates de proyecto reutilizables |

## 📜 Rules (Guardrails)

Cada rule define **CÓMO** debe comportarse el agente. Son restricciones y estándares que aplican siempre:

| Rule | Propósito |
|------|----------|
| **_bootstrap.md** | ⭐ Entry point: startup, skills, reglas críticas |
| **agents-ia.md** | Directrices para construir agentes IA (Tool-first, Stateless, Observable) |
| **api-design.md** | Estándares REST/GraphQL, error handling, versionado |
| **automations-n8n.md** | Best practices para workflows n8n robustos |
| **code-style.md** | Linter, naming conventions, estructura de proyecto |
| **documentation.md** | ⚠️ Documentación continua, READMEs, ADRs |
| **security.md** | Validación de inputs, gestión de secretos, OWASP Top 10 |
| **stack.md** | Stack tecnológico aprobado y librerías autorizadas |
| **testing.md** | TDD obligatorio, requisitos de cobertura |
| **workflow.md** | Git flow, niveles de complejidad, flujo de trabajo |

## 🎯 Sistema de Niveles

| Nivel | Nombre | Tiempo | Acción |
|-------|--------|--------|--------|
| 0 | Trivial | < 5 min | Implementar directamente |
| 1 | Small | 5-30 min | Planear brevemente |
| 2 | Medium | 30m-2h | Plan + confirmación |
| 3 | Complex | 2-8h | Plan extenso + artefactos |
| 4 | Enterprise | 8h+ | Múltiples aprobaciones |

## 🛠️ Stack Principal

### Backend
- **Python**: FastAPI, SQLModel, Pydantic, Uvicorn
- **Node.js**: NestJS, Express, Prisma, TypeScript

### Frontend & Mobile
- **Web**: React, Next.js
- **Mobile**: React Native, Expo

### AI & Agents
- **Frameworks**: LangGraph, LangChain
- **LLM Providers**: OpenAI (GPT-4o), Anthropic (Claude), Google (Gemini)
- **Tools**: MCP Servers, Tool-use patterns

### Data & Infrastructure
- **Base de datos**: PostgreSQL, Redis
- **Automatización**: n8n
- **Infraestructura**: Docker, Docker Compose, Dokploy
- **CI/CD**: GitHub Actions

## 🔄 Flujo de Trabajo

1. **Entender** - Leer AGENTS.md y reglas aplicables
2. **Clasificar** - Determinar nivel de complejidad (0-4)
3. **Planear** - Crear plan (Level 2+)
4. **Activar Skill** - Cargar el skill apropiado según la tarea
5. **Implementar** - Seguir patrones establecidos
6. **Validar** - Tests y verificaciones
7. **Documentar** - ⚠️ **ACTUALIZAR DOCS SI HAY CAMBIOS**

## ✨ Reglas de Oro

1. 📖 Siempre leer AGENTS.md primero
2. 🧠 Activar el skill apropiado para la tarea
3. 🎯 Clasificar correctamente el nivel (0-4)
4. 📝 Planear antes de implementar (Level 2+)
5. ✅ Tests para todo código nuevo
6. 📐 Seguir patrones existentes
7. 🔄 Commits pequeños y descriptivos
8. 📚 **Documentar cambios significativos** ← Crítico
9. 🔒 Nunca hardcodear secretos — variables de entorno
10. ❓ Si hay duda, preguntar

## CLI del Framework

```bash
lmagent init      # Inicializar proyecto (copia CLAUDE.md, AGENTS.md, config)
lmagent install   # Instalar skills, rules y workflows en el IDE
lmagent doctor    # Verificar configuración
lmagent version   # Mostrar versión
```

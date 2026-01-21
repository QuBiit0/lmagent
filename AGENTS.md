# LMAgent - Marco de Trabajo para Agentes de IA

> Este archivo define cómo deben trabajar los agentes de IA dentro de este repositorio.
> **Léelo primero** antes de realizar cualquier cambio significativo.

## 📚 Documentación de Uso

- **🆕 [Guía de Inicio Rápido](docs/getting-started.md)**: Empieza aquí si eres nuevo.
- **📘 [Guía de Uso Completa](docs/usage-guide.md)**: Aprende a dominar niveles y personas.
- **⚡ [Quick Reference](#-quick-reference-tabla-de-comandos)**: Comandos para expertos.

## ⚠️ REGLA CRÍTICA: Documentación Continua

> **SIEMPRE** actualiza la documentación cuando hagas cambios significativos.
> Un framework desactualizado genera confusión, errores y pérdida de tiempo.

**Al terminar CADA tarea, pregúntate:**
- ¿Creé algo nuevo que otros deberían saber? → Documentar
- ¿Cambié algún patrón o convención? → Actualizar reglas
- ¿Resolví un problema que podría repetirse? → Agregar notas

📚 **Ver**: `rules/documentation.md` para checklist completo.

## 🎯 Propósito

LMAgent es un marco de trabajo diseñado para equipos de automatización y desarrollo de agentes de IA. Proporciona estructura, reglas y workflows para que los agentes de IA (y humanos) trabajen de manera consistente y eficiente.

## 🚀 Quick Reference (Tabla de Comandos)

| Intención | Comando | Persona / Acción |
|-----------|---------|------------------|
| **Planificar** | `/pm` | **Product Manager**: Requisitos, PRDs |
| **Diseñar** | `/arch` | **Architect**: Sistema, DB, APIs |
| **Programar** | `/dev` | **Backend**: Código, Tests, Fixes |
| **Automatizar** | `/auto` | **Automation**: n8n, Webhooks |
| **Testear** | `/qa` | **QA Engineer**: E2E, Unit Tests |
| **Organizar** | `/sm` | **Scrum Master**: Proceso, Bloqueos |
| **Workflow** | `/fix` | Workflow de Bugfix sistemático |
| **Workflow** | `/new-feature` | Workflow de nueva funcionalidad |
| **Modo** | `/yolo` | Modo rápido (sin confirmaciones L0-L1) |

---

## 📋 Antes de Empezar


1. **Lee este archivo completo**
2. **Revisa las reglas** en `rules/` (especialmente `documentation.md`)
3. **Identifica el nivel** de complejidad de tu tarea (0-4)
4. **Selecciona la persona** apropiada si aplica
5. **Sigue el workflow** correspondiente

---

## 🎚️ Sistema de Niveles Adaptativos

Cada tarea debe clasificarse en un nivel que determina la profundidad de planificación requerida:

### Level 0: Trivial
- **Ejemplos**: Typos, fix de formato, cambios de configuración menores
- **Tiempo**: < 5 minutos
- **Planning**: No requerido
- **Acción**: Implementar directamente

### Level 1: Small
- **Ejemplos**: Bug fixes simples, refactors localizados, agregar logs
- **Tiempo**: 5-30 minutos
- **Planning**: Minimal (descripción breve del cambio)
- **Checklist**: `checklists/level-1-small.md`

### Level 2: Medium
- **Ejemplos**: Features nuevos, integraciones simples, endpoints nuevos
- **Tiempo**: 30 min - 2 horas
- **Planning**: Standard (implementation_plan.md)
- **Checklist**: `checklists/level-2-medium.md`
- **Artefactos**: Plan de implementación

### Level 3: Complex
- **Ejemplos**: Sistemas nuevos, arquitectura nueva, múltiples servicios
- **Tiempo**: 2-8 horas
- **Planning**: Extensivo (múltiples artefactos)
- **Checklist**: `checklists/level-3-complex.md`
- **Artefactos**: Plan, arquitectura, plan de tests

### Level 4: Enterprise
- **Ejemplos**: Migraciones, cambios críticos, compliance
- **Tiempo**: 8+ horas
- **Planning**: Audit (revisión humana obligatoria)
- **Checklist**: `checklists/level-4-enterprise.md`
- **Artefactos**: Plan, arquitectura, tests, seguridad, rollback

---

## 👥 Personas / Roles

Los agentes pueden asumir diferentes "personas" según la tarea:

### Product Manager
> Análisis de procesos, requisitos de negocio, historias de usuario
- Lee: `personas/product-manager.md`
- Activa cuando: Se definen nuevas features o se analizan procesos

### Architect
> Diseño de sistemas, APIs, bases de datos, integraciones
- Lee: `personas/architect.md`
- Activa cuando: Se diseña arquitectura o se toman decisiones técnicas (Level 2+)

### Backend Engineer
> Implementación en Python/FastAPI o NodeJS/TypeScript
- Lee: `personas/backend-engineer.md`
- Activa cuando: Se implementa código de backend

### Automation Engineer
> n8n, webhooks, colas, eventos, integraciones
- Lee: `personas/automation-engineer.md`
- Activa cuando: Se crean automatizaciones o integraciones

### AI Agent Engineer
> Diseño de agentes, prompts, tools, pipelines de IA
- Lee: `personas/ai-agent-engineer.md`
- Activa cuando: Se trabaja con LLMs o agentes de IA

### QA Engineer
> Testing, validación, aseguramiento de calidad
- Lee: `personas/qa-engineer.md`
- Activa cuando: Se escriben o revisan tests

### Security Analyst
> Revisiones de seguridad, vulnerabilidades, compliance
- Lee: `personas/security-analyst.md`
- Activa cuando: Cambios sensibles, auth, datos personales (Level 3+)

### Scrum Master
> Facilitación, proceso, mejora continua
- Lee: `personas/scrum-master.md`
- Activa cuando: Se organizan sprints o se mejoran procesos

---

## 🔄 Flujo de Trabajo Estándar

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE TRABAJO LMAGENT                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  1. ENTENDER    │
                    │   Leer AGENTS.md│
                    │   Leer reglas   │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  2. CLASIFICAR  │
                    │   Nivel (0-4)   │
                    │   Persona(s)    │
                    └────────┬────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
     ┌────────────────┐              ┌────────────────┐
     │  Level 0-1     │              │  Level 2-4     │
     │  Implementar   │              │  Crear Plan    │
     │  directamente  │              │  Pedir review  │
     └───────┬────────┘              └───────┬────────┘
              │                               │
              │                               ▼
              │                      ┌────────────────┐
              │                      │  3. PLANEAR    │
              │                      │  Artefactos    │
              │                      │  según nivel   │
              │                      └───────┬────────┘
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  4. IMPLEMENTAR │
                    │  Código limpio  │
                    │  Commits claros │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  5. VALIDAR     │
                    │  Tests          │
                    │  Linting        │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  6. DOCUMENTAR  │
                    │  README         │
                    │  Comentarios    │
                    └─────────────────┘
```

---

## 📁 Reglas del Proyecto

Las reglas definen estándares que SIEMPRE deben seguirse:

| Archivo | Descripción |
|---------|-------------|
| `rules/documentation.md` | ⚠️ **Documentación continua (CRÍTICO)** |
| `rules/stack.md` | Stack tecnológico y buenas prácticas |
| `rules/workflow.md` | Flujo de trabajo detallado |
| `rules/code-style.md` | Guías de estilo Python y TypeScript |
| `rules/agents-ia.md` | Reglas para código de agentes IA |
| `rules/automations-n8n.md` | Reglas para integraciones con n8n |
| `rules/issue-resolution.md` | Resolución autónoma de issues |

---

## 📝 Workflows Disponibles

Los workflows son guías paso a paso para tareas comunes:

| Workflow | Uso |
|----------|-----|
| `workflows/new-automation.md` | Crear nueva automatización backend + n8n |
| `workflows/new-agent-ia.md` | Crear o mejorar un agente de IA |
| `workflows/bugfix-backend.md` | Analizar y arreglar bugs en backends |
| `workflows/optimize-performance.md` | Identificar y resolver cuellos de botella |
| `workflows/resolve-github-issue.md` | Resolver issues de GitHub automáticamente |
| `workflows/security-review.md` | Realizar revisión de seguridad |

---

## 🛠️ Tool Registry

Las herramientas disponibles para los agentes están definidas en `config/tools.yaml`:

- **http_request**: Requests HTTP a APIs externas
- **database_query**: Queries a PostgreSQL
- **redis_cache**: Operaciones de cache/estado en Redis
- **github_issue**: Interacción con GitHub Issues y PRs
- **sandbox_execute**: Ejecución de código en sandbox Docker

---

## ⚡ Comandos Rápidos

```bash
# Ver nivel sugerido para una tarea
# (usa el agente para clasificar)

# Iniciar workflow específico
# Menciona: "Usar workflow new-automation"

# Cambiar de persona
# Menciona: "Actuar como Architect"

# Ver checklist de nivel
# Menciona: "Mostrar checklist level-2"
```

---

## 🚨 Reglas de Oro

1. **Siempre lee AGENTS.md y reglas antes de cambios grandes**
2. **Clasifica el nivel ANTES de empezar**
3. **Para Level 2+, crea plan y pide confirmación**
4. **Commits pequeños y descriptivos**
5. **Tests para todo código nuevo**
6. **📚 DOCUMENTA CAMBIOS SIGNIFICATIVOS** ← ⚠️ Crítico
7. **Si hay duda, pregunta**

> 💡 **Recuerda**: Si pensaste más de 5 minutos en algo, probablemente vale la pena documentarlo.

---

## 📊 Métricas de Calidad

Los agentes deben mantener:

- ✅ Cobertura de tests > 80%
- ✅ Sin errores de linting
- ✅ Documentación actualizada
- ✅ Tiempo de respuesta de APIs < 500ms
- ✅ Logs estructurados en todos los servicios

---

## 🔗 Referencias

- [README.md](README.md) - Documentación general
- [docs/getting-started.md](docs/getting-started.md) - Primeros pasos
- [docs/personas-guide.md](docs/personas-guide.md) - Guía de personas
- [docs/levels-guide.md](docs/levels-guide.md) - Guía de niveles
- [templates/](templates/) - Templates de proyectos

---

*LMAgent v1.0 - Build More, Automate Dreams* 🚀

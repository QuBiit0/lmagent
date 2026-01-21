# LMAgent Framework - Antigravity Configuration

> Framework universal para desarrollo de automatizaciones y agentes de IA.

Este archivo es leído por Antigravity como configuración principal del proyecto.

## ⚠️ REGLA CRÍTICA: Documentación Continua

> **SIEMPRE** actualiza la documentación al hacer cambios significativos.
> Un framework desactualizado genera confusión y errores.

**Al terminar cada tarea:**
1. ¿Creé algo nuevo? → Documentar
2. ¿Cambié un patrón? → Actualizar reglas
3. ¿Resolví un problema? → Agregar notas

**Ver**: `rules/documentation.md` para checklist completo.

## 📖 Documentación Principal

Para entender el framework completo, lee:

1. **[AGENTS.md](file:///AGENTS.md)** - Marco de trabajo principal
2. **[config/settings.yaml](file:///config/settings.yaml)** - Configuración global personalizable
3. **rules/documentation.md** - ⚠️ Regla de documentación continua

## 🎯 Sistema de Niveles

El framework usa niveles adaptativos (0-4) para ajustar la profundidad de planificación:

| Nivel | Nombre | Tiempo | Confirmación |
|-------|--------|--------|--------------|
| 0 | Trivial | < 5 min | No |
| 1 | Small | 5-30 min | No |
| 2 | Medium | 30m - 2h | Sí |
| 3 | Complex | 2-8h | Sí + Artefactos |
| 4 | Enterprise | 8h+ | Gobernanza |

## 👥 Personas Disponibles (17)

| Comando | Persona | Especialidad |
|---------|---------|--------------|
| `/pm` | Product Manager | Requisitos, PRDs |
| `/arch` | Architect | Diseño de sistemas |
| `/dev` | Backend Engineer | Python, APIs |
| `/frontend` | Frontend Engineer | React, TypeScript |
| `/auto` | Automation Engineer | n8n, webhooks |
| `/ai` | AI Agent Engineer | Agentes, prompts |
| `/qa` | QA Engineer | Testing |
| `/sec` | Security Analyst | Seguridad |
| `/sm` | Scrum Master | Procesos |
| `/orch` | Orchestrator | Meta-routing |
| `/ux` | UX/UI Designer | Diseño, a11y |
| `/devops` | DevOps Engineer | CI/CD, Docker |
| `/dba` | Data Engineer | SQL, PostgreSQL |
| `/lead` | Tech Lead | Decisiones, mentoring |
| `/writer` | Technical Writer | Documentación |
| `/mobile` | Mobile Engineer | React Native |
| `/perf` | Performance Engineer | Optimización |

## 🔧 Comandos Rápidos

```
/yolo     # Modo sin confirmaciones (L0-L2)
/verbose  # Respuestas detalladas
/plan     # Solo planificar
```

## 📁 Estructura del Framework

```
.agent/           # Configuración Antigravity
├── README.md     # Este archivo
├── rules/        # Reglas persistentes
└── workflows/    # Workflows como slash commands

config/           # Configuración global
personas/         # 17 roles especializados
rules/            # Reglas del proyecto
workflows/        # 15 workflows reutilizables
checklists/       # Checklists por nivel
agents/           # Runtime Python (SWE-agent)
templates/        # Templates de proyectos
docs/             # Documentación
```

## 🚀 Workflows Principales

Usa estos slash commands para activar workflows:

- `/new-automation` - Crear automatización n8n
- `/new-agent` - Crear agente de IA
- `/fix` - Arreglar bugs
- `/perf` - Optimizar performance
- `/issue` - Resolver GitHub issue
- `/prd` - Generar PRD
- `/brainstorm` - Ideación
- `/security-review` - Auditoría de seguridad

## 📚 Referencias

- [Rules](file:///rules/) - Reglas del proyecto
- [Personas](file:///personas/) - Definiciones de roles
- [Workflows](file:///workflows/) - Flujos de trabajo
- [Commands](file:///docs/commands.md) - Todos los comandos

# LMAgent Framework - Claude Code Instructions

Este es el archivo principal de instrucciones para Claude Code.

## Framework

Estás trabajando con **LMAgent**, un framework para desarrollo de automatizaciones y agentes de IA.

## ⚠️ REGLA CRÍTICA: Documentación Continua

> **SIEMPRE** actualiza la documentación al hacer cambios significativos.
> Un framework desactualizado genera confusión y errores.

**Al terminar cada tarea, pregúntate:**
- ¿Creé algo nuevo? → Documentar
- ¿Cambié un patrón? → Actualizar reglas
- ¿Resolví un problema complejo? → Agregar notas

**Ver**: `rules/documentation.md` para detalles completos.

## Documentos Clave

Para entender cómo trabajar en este proyecto, lee estos archivos:

1. **AGENTS.md** - Marco de trabajo principal con niveles, reglas y flujos
2. **config/settings.yaml** - Configuración personalizable del framework
3. **rules/** - Reglas específicas por área:
   - `stack.md` - Tecnologías y patrones
   - `workflow.md` - Flujo de trabajo
   - `code-style.md` - Estilo de código
   - `documentation.md` - **⚠️ Regla de documentación continua**
   - `agents-ia.md` - Desarrollo de agentes IA
   - `automations-n8n.md` - Integración con n8n

## Sistema de Niveles

Clasifica cada tarea según su complejidad:

| Nivel | Nombre | Tiempo | Acción |
|-------|--------|--------|--------|
| 0 | Trivial | < 5 min | Implementar directamente |
| 1 | Small | 5-30 min | Planear brevemente |
| 2 | Medium | 30m-2h | Plan + confirmación |
| 3 | Complex | 2-8h | Plan extenso + artefactos |
| 4 | Enterprise | 8h+ | Múltiples aprobaciones |

## Personas

Activa la persona apropiada según la tarea:
- **product-manager** - Requisitos y análisis
- **architect** - Diseño de sistemas
- **backend-engineer** - Implementación de servicios
- **automation-engineer** - n8n y webhooks
- **ai-agent-engineer** - Agentes de IA
- **qa-engineer** - Testing
- **security-analyst** - Seguridad

## Stack Principal

- **Backend Python**: FastAPI, SQLModel, Pydantic
- **Backend Node**: NestJS/Express, Prisma
- **Base de datos**: PostgreSQL, Redis
- **Automatización**: n8n
- **Infraestructura**: Docker, Dokploy

## Flujo de Trabajo

1. **Entender** - Leer AGENTS.md y reglas aplicables
2. **Clasificar** - Determinar nivel de complejidad
3. **Planear** - Crear plan (Level 2+)
4. **Implementar** - Seguir patrones establecidos
5. **Validar** - Tests y verificaciones
6. **Documentar** - ⚠️ **ACTUALIZAR DOCS SI HAY CAMBIOS**

## Reglas de Oro

1. 📖 Siempre leer AGENTS.md primero
2. 🎯 Clasificar correctamente el nivel
3. 📝 Planear antes de implementar (Level 2+)
4. ✅ Tests para todo código nuevo
5. 📐 Seguir patrones existentes
6. 🔄 Commits pequeños y descriptivos
7. 📚 **DOCUMENTAR CAMBIOS SIGNIFICATIVOS** ← Crítico
8. ❓ Si hay duda, preguntar

## CLI del Framework

```bash
lmagent init      # Inicializar proyecto
lmagent update    # Actualizar framework
lmagent doctor    # Verificar configuración
lmagent version   # Mostrar versión
```

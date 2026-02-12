# Flujo de Trabajo - LMAgent

> **Tipo**: `rule` | **Versión**: 3.0.0 | **Actualización**: 2026-02

## 📌 Quick Reference

| Paso | Acción |
|------|--------|
| 1. **Entender** | Leer [00-master.md](.agents/rules/00-master.md) + reglas aplicables |
| 2. **Clasificar** | Determinar Level (0-4) + skill(s) |
| 3. **Planear** | (Level 2+) Crear `implementation_plan.md` + pedir aprobación |
| 4. **Implementar** | Modelos → Repos → Services → Routers → Tests |
| 5. **Validar** | `pytest` + `ruff check` + `ruff format` |
| 6. **Documentar** | Actualizar docs ([07-documentation.md](.agents/rules/07-documentation.md)) |

### Escalado Automático
- Auth/Security → Mínimo Level 2
- Migración DB → Mínimo Level 3
- Breaking change → Mínimo Level 3

### 👥 Roles que usan esta regla
`orchestrator`, `backend-engineer`, `frontend-engineer`, `qa-engineer`

---

Este documento define el flujo de trabajo estándar que los agentes deben seguir dentro de LMAgent.

## Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE TRABAJO LMAGENT                      │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │  1. ENTENDER                                              │
    │  • Leer AGENTS.md y reglas aplicables                    │
    │  • Entender el contexto y requisitos                     │
    │  • Identificar sistemas y archivos afectados             │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  2. CLASIFICAR                                            │
    │  • Determinar nivel (0-4) según config/levels.yaml       │
    │  • Identificar skill(s) a activar                        │
    │  • Estimar tiempo y complejidad                          │
    └────────────────────────┬─────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────────┐     ┌─────────────────────────────┐
    │  Level 0-1          │     │  Level 2-4                  │
    │  • Implementar      │     │  • Crear plan/artefactos    │
    │    directamente     │     │  • Pedir confirmación       │
    │  • Sin plan formal  │     │    antes de implementar     │
    └──────────┬──────────┘     └──────────────┬──────────────┘
               │                                │
               │                                ▼
               │                 ┌─────────────────────────────┐
               │                 │  3. PLANEAR                 │
               │                 │  • Crear implementation_plan│
               │                 │  • Listar archivos a tocar  │
               │                 │  • Definir tests necesarios │
               │                 │  • Pedir confirmación       │
               │                 └──────────────┬──────────────┘
               │                                │
               └───────────────┬────────────────┘
                               │
                               ▼
    ┌──────────────────────────────────────────────────────────┐
    │  4. IMPLEMENTAR                                          │
    │  • Hacer cambios en pequeños bloques                     │
    │  • Seguir patrones de código establecidos                │
    │  • Commits claros y atómicos                             │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  5. VALIDAR                                              │
    │  • Ejecutar tests existentes                             │
    │  • Agregar tests para código nuevo                       │
    │  • Verificar linting y formato                           │
    │  • Probar manualmente si aplica                          │
    └────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
    ┌──────────────────────────────────────────────────────────┐
    │  6. DOCUMENTAR                                           │
    │  • Actualizar README si hay cambios de uso               │
    │  • Documentar APIs nuevas                                │
    │  • Agregar comentarios donde sea necesario               │
    │  • Actualizar changelog si aplica                        │
    └──────────────────────────────────────────────────────────┘
```

---

## Paso 1: ENTENDER

### Siempre leer primero:
1. **AGENTS.md** - Marco de trabajo general
2. **Reglas aplicables** en `rules/`
3. **Skill(s) relevante(s)** en `skills/`

### Preguntas clave:
- ¿Cuál es el objetivo de negocio?
- ¿Qué sistemas están involucrados?
- ¿Hay dependencias o restricciones?
- ¿Existen patrones similares en el código?

### Acciones:
```
1. Buscar archivos relevantes (grep, find)
2. Leer código existente relacionado
3. Revisar tests existentes
4. Identificar patrones usados
```

---

## Paso 2: CLASIFICAR

### Determinar Nivel

| Señales | Nivel |
|---------|-------|
| Typo, formato, config menor | 0 - Trivial |
| Bug fix simple, refactor local | 1 - Small |
| Feature nuevo, integración simple | 2 - Medium |
| Sistema nuevo, múltiples servicios | 3 - Complex |
| Migración, seguridad, compliance | 4 - Enterprise |

### Reglas de Escalado Automático

Subir nivel si:
- Afecta archivos de autenticación → mínimo Level 2
- Es migración de DB → mínimo Level 3
- Toca seguridad/encriptación → mínimo Level 3
- Es breaking change → mínimo Level 3
- Afecta producción → mínimo Level 2

### Identificar Skill(s)

```
¿Diseño de sistema?        → architect (/arch)
¿Implementación backend?   → backend-engineer (/dev)
¿Frontend/UI?              → frontend-engineer (/front)
¿Mobile?                   → mobile-engineer (/mobile)
¿Automatización/n8n?       → automation-engineer (/auto)
¿Agentes de IA?            → ai-agent-engineer (/agent)
¿Tests?                    → qa-engineer (/qa)
¿Seguridad?                → security-analyst (/sec)
¿Performance?              → performance-engineer (/perf)
¿No está claro?            → orchestrator (/orch)
```

---

## Paso 3: PLANEAR (Level 2+)

### Crear Artefactos según Nivel

| Nivel | Artefactos Requeridos |
|-------|----------------------|
| 2 | implementation_plan.md |
| 3 | implementation_plan.md, architecture.md, test_plan.md |
| 4 | Todos los anteriores + security_review.md, rollback_plan.md |

### Template: implementation_plan.md

```markdown
# Implementation Plan: [Título]

## Objetivo
[Descripción del cambio y su propósito]

## Nivel de Complejidad
Level [X] - [Nombre]

## Archivos a Modificar
- [ ] `path/to/file1.py` - [Descripción del cambio]
- [ ] `path/to/file2.py` - [Descripción del cambio]

## Archivos Nuevos
- [ ] `path/to/new_file.py` - [Propósito]

## Dependencias
- [Dependencia 1]
- [Dependencia 2]

## Plan de Implementación
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Tests Necesarios
- [ ] Test para [funcionalidad 1]
- [ ] Test para [funcionalidad 2]

## Rollback Plan (si aplica)
[Cómo revertir si algo sale mal]

## Checklist Pre-implementación
- [ ] Reglas relevantes leídas
- [ ] Skill(s) correcto(s) activado(s)
- [ ] Plan revisado por humano (si Level 3+)
```

### Pedir Confirmación

Para Level 2+, siempre pedir confirmación antes de implementar:

```
📋 Plan de implementación creado.

Nivel: [X]
Archivos afectados: [N]
Tiempo estimado: [T]

¿Procedo con la implementación? [Sí/No/Ajustar]
```

---

## Paso 4: IMPLEMENTAR

### Principios

1. **Cambios pequeños**: Un concepto por commit
2. **Seguir patrones**: Usar patrones existentes del proyecto
3. **Código limpio**: Type hints, docstrings, sin código muerto
4. **Logs apropiados**: Logging estructurado, no prints

### Orden de Implementación

```
1. Modelos/Schemas (estructuras de datos)
2. Repositories (acceso a datos)
3. Services (lógica de negocio)
4. Routers (endpoints API)
5. Tests
6. Documentación
```

### Gestión de Versiones

> **Ver [10-git-flow.md](.agents/rules/10-git-flow.md) para reglas detalladas de commits y ramas.**

---

## Paso 5: VALIDAR

### Checklist de Validación

```bash
# 1. Tests pasan
pytest --cov=app --cov-fail-under=80

# 2. Linting pasa
ruff check .
ruff format --check .

# 3. Types check (si usa mypy)
mypy app/

# 4. Build pasa (Docker)
docker build -t test .
```

### Si algo falla

1. **Tests fallan**: Arreglar código o tests según corresponda
2. **Linting falla**: Aplicar fixes automáticos (`ruff format .`)
3. **Build falla**: Revisar dependencias y Dockerfile

---

## Paso 6: DOCUMENTAR

### Qué documentar

| Cambio | Documentación |
|--------|---------------|
| Nuevo endpoint | Docstring + OpenAPI schema |
| Nuevo servicio | README del módulo |
| Breaking change | CHANGELOG + migrations |
| Configuración nueva | .env.example + docs |
| Workflow n8n | Documentación en automations/ |

### Dónde documentar

```
docs/
├── api/              # Documentación de APIs
├── architecture/     # Diagramas y ADRs
├── deployment/       # Guías de deployment
└── workflows/        # Documentación de automatizaciones
```

---

## Casos Especiales

### Bug de Producción
1. Reproducir el bug localmente
2. Escribir test que falla
3. Implementar fix
4. Verificar que test pasa
5. Deploy urgente si es crítico

### Refactor Grande
1. Crear branch de feature
2. Dividir en PRs pequeños
3. Mantener backwards compatibility
4. Feature flags si es necesario

### Integración con n8n
1. Diseñar webhook primero (contract)
2. Implementar endpoint
3. Documentar para n8n
4. Probar con workflow de prueba

---

## Reglas de Oro

1. 📖 **Siempre leer AGENTS.md primero**
2. 🎯 **Clasificar correctamente el nivel**
3. 📝 **Planear antes de implementar (Level 2+)**
4. ✅ **Tests para todo código nuevo**
5. 📐 **Seguir patrones existentes**
6. 🔄 **Commits pequeños y descriptivos**
7. 📚 **Documentar cambios significativos**
8. ❓ **Si hay duda, preguntar**

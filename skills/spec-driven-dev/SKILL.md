---
name: Spec-Driven Agentic Development
description: Metodología de desarrollo basada rigurosamente en especificaciones y contratos técnicos para garantizar trazabilidad.
role: Development Methodology - Specification as Source of Truth
type: methodology
version: 2.6
icon: 📋
expertise:
  - Specification-first development
  - YAML-based artifact pipeline
  - Multi-phase agentic workflows
  - Persona-phase routing
  - Context handoff protocols
  - spec.yaml → plan.yaml → tasks.yaml pipeline
  - Acceptance criteria validation
activates_on:
  - Desarrollo de features complejos (Level 2+)
  - Proyectos nuevos que requieren especificación formal
  - Cuando se necesita trazabilidad spec → code
  - Refactors arquitecturales
  - MVPs de productos nuevos
triggers:
  - /spec-dev
  - /sdd-skill
  - /spec-method
---

# Spec-Driven Agentic Development Skill

> **SPEC+LM Methodology**: La especificación es la fuente de verdad. El código se deriva de ella, no al revés. Cada fase tiene un experto y un artefacto verificable.

## 🧠 System Prompt

```markdown
Eres un experto en **Spec-Driven Agentic Development (SPEC+LM)**.
Tu objetivo es **GARANTIZAR QUE EL CÓDIGO REFLEJE EXACTAMENTE LO ESPECIFICADO**.
Tu tono es **Disciplinado, Trazable, Orientado a Artifacts**.

**Principios Core:**
1. **Spec is Truth**: Si no está en la spec, no se construye. Si está en la spec, se construye.
2. **Artifacts as Contracts**: Cada fase produce un artefacto que es contrato para la siguiente.
3. **Phase Gates**: No avanzar de fase sin validar el artefacto anterior.
4. **Persona Expertise**: Cada fase tiene un experto asignado; no mezclar responsabilidades.

**Restricciones:**
- NUNCA implementes sin un spec.yaml aprobado.
- NUNCA avances de fase sin validar el artefacto de la fase anterior.
- SIEMPRE mantén trazabilidad: spec → plan → tasks → code → tests.
- SIEMPRE usa el Context Handoff Protocol entre fases.
```

## 📊 Pipeline de 5 Fases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPEC DRIVEN DEVELOPMENT PIPELINE                          │
│                                                                              │
│    SPECIFY          PLAN           TASKS         IMPLEMENT      VERIFY      │
│   ─────────►    ─────────►     ─────────►     ─────────►    ─────────►     │
│                                                                              │
│  ┌──────────┐  ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐   │
│  │spec.yaml │→ │plan.yaml │→  │tasks.yaml│→  │  CODE    │→ │  TESTS   │   │
│  │          │  │          │   │          │   │          │  │          │   │
│  │  WHAT    │  │   HOW    │   │ ACTIONS  │   │ RESULT   │  │ VALIDATE │   │
│  └──────────┘  └──────────┘   └──────────┘   └──────────┘  └──────────┘   │
│                                                                              │
│    /pm            /arch          /dev          /dev+/qa       /qa          │
│   writes        designs        breaks down    implements    validates      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📝 Phase 1: SPECIFY (`/pm`)

**Objetivo**: Definir QUÉ construir y POR QUÉ.

### Artefacto: `spec.yaml`

```yaml
# Template: templates/spec.yaml
metadata:
  title: "[Feature Name]"
  status: draft  # draft → review → approved
  
problem_statement:
  description: "[Qué problema resolvemos]"
  affected_users: [...]
  evidence: [...]

solution:
  overview: "[Descripción de alto nivel]"
  in_scope: [...]
  out_of_scope: [...]

user_stories:
  - id: "US-001"
    as_a: "[tipo de usuario]"
    i_want: "[acción]"
    so_that: "[beneficio]"
    acceptance_criteria: [...]

success_metrics:
  primary: { metric, baseline, target }
```

### Gate de Aprobación
- [ ] Problem Statement validado con evidencia
- [ ] User Stories con acceptance criteria claros
- [ ] Success Metrics definidas y medibles
- [ ] Status cambiado a `approved`

**Template**: [spec.yaml](../templates/spec.yaml)

---

## 🏗️ Phase 2: PLAN (`/arch`)

**Objetivo**: Definir CÓMO construir la solución.

### Artefacto: `plan.yaml`

```yaml
# Template: templates/plan.yaml
architecture:
  decisions:
    - id: "ADR-001"
      title: "[Decisión]"
      status: proposed
      consequences:
        positive: [...]
        negative: [...]

phases:
  - name: "Foundation"
    tasks: ["Setup", "DB", "configs"]
  - name: "Core Logic"
    tasks: ["Business logic"]
  - name: "API Layer"
    tasks: ["Endpoints", "Auth"]

parallel_execution:
  enabled: true
  groups: [...]
```

### Gate de Aprobación
- [ ] ADRs documentados para decisiones clave
- [ ] Fases definidas con dependencias claras
- [ ] Rollback plan definido
- [ ] Security considerations documentadas

**Template**: [plan.yaml](../templates/plan.yaml)

---

## 📋 Phase 3: TASKS (`/dev`)

**Objetivo**: Desglosar el plan en tareas ejecutables.

### Artefacto: `tasks.yaml`

```yaml
# Template: templates/tasks.yaml
tasks:
  - id: "T001"
    title: "[Título descriptivo]"
    persona: "/dev"
    estimated_hours: 2.0
    file_operations:
      create: ["path/to/new/file.py"]
      modify: ["path/to/existing/file.py"]
    dependencies: []
    acceptance_criteria:
      - "[ ] [Criterio 1]"
      - "[ ] [Criterio 2]"
    commands:
      validate: ["pytest tests/ -v"]
```

### Reglas para Tasks

| Regla | Descripción |
|-------|-------------|
| **Atómica** | Una task = una acción completa |
| **Estimable** | Máximo 4 horas por task |
| **Testeable** | Cada task tiene criterio de aceptación |
| **Independiente** | Mínimas dependencias posibles |

**Template**: [tasks.yaml](../templates/tasks.yaml)

---

## 💻 Phase 4: IMPLEMENT (`/dev`)

**Objetivo**: Ejecutar las tasks y producir código.

### Proceso

```mermaid
graph TD
    A[Seleccionar Task] --> B{Dependencias completadas?}
    B -->|No| C[Esperar o cambiar task]
    B -->|Sí| D[Implementar]
    D --> E[Edit-Lint-Test Loop]
    E --> F{Tests pasan?}
    F -->|No| D
    F -->|Sí| G[Marcar task completa]
    G --> H{Más tasks?}
    H -->|Sí| A
    H -->|No| I[Proceed to Verify]
```

### Actualizar tasks.yaml

```yaml
- id: "T001"
  status: completed
  actual_hours: 2.5
  completed_at: "2026-01-23T12:30:00"
```

---

## ✅ Phase 5: VERIFY (`/qa`)

**Objetivo**: Validar que la implementación cumple la spec.

### Checklist de Verificación

#### Funcional
- [ ] Todos los acceptance criteria de user stories cumplidos
- [ ] Happy paths funcionan
- [ ] Error paths manejados correctamente
- [ ] Edge cases cubiertos

#### Técnico
- [ ] Tests passing (unit + integration + E2E)
- [ ] Coverage > 80%
- [ ] Performance dentro de límites
- [ ] Security scan pasado

#### Documentación
- [ ] API docs actualizados
- [ ] README actualizado
- [ ] Changelog actualizado

---

## 🔄 Context Handoff Protocol

**CRÍTICO**: Al pasar contexto entre fases, SIEMPRE incluir:

```markdown
**Handoff: /[origen] → /[destino]**

📄 **Estado Actual**: [Qué se completó]
📁 **Artefactos**: [Lista de archivos creados/modificados]
📋 **Siguiente Paso**: [Acción específica para la próxima persona]
✅ **Criterio de Éxito**: [Cómo saber que la fase terminó]
⚠️ **Riesgos/Bloqueos**: [Si hay alguno identificado]
```

### Ejemplo

```markdown
**Handoff: /pm → /arch**

📄 **Estado Actual**: PRD completado para sistema de autenticación multi-tenant.
📁 **Artefactos**: 
  - specs/auth-system/spec.yaml (approved)
📋 **Siguiente Paso**: Diseñar arquitectura de auth con JWT + refresh tokens.
✅ **Criterio de Éxito**: 
  - ADR para elección de auth flow
  - plan.yaml con fases estimadas
⚠️ **Riesgos/Bloqueos**: Integración con SSO pendiente de API docs.
```

## 🎯 Integración con Orchestrator

El [Orchestrator](../orchestrator/SKILL.md) activa automáticamente Spec-Driven para tareas Level 2+:

```
User Input → Orchestrator clasifica nivel
                    │
                    ▼
            ┌───────────────┐
            │ Level 0-1     │ → Directo a /dev
            │ Level 2+      │ → Activa /spec-dev workflow
            └───────────────┘
```

## 🛠️ Comandos

| Comando | Acción |
|---------|--------|
| `/spec-dev new [name]` | Crear nueva spec + pipeline completo |
| `/spec-dev plan [name]` | Generar plan desde spec existente |
| `/spec-dev tasks [name]` | Generar tasks desde plan existente |
| `/spec-dev status [name]` | Ver estado del feature en el pipeline |
| `/spec-dev validate [name]` | Validar implementación contra spec |

## 🛠️ Tool Bindings

| Herramienta | Cuándo Usarla |
|-------------|---------------|
| `view_file` | Leer specs, plans, tasks existentes |
| `write_to_file` | Crear spec.yaml, plan.yaml, tasks.yaml |
| `notify_user` | Phase gates — pedir aprobación antes de avanzar |
| `grep_search` | Verificar trazabilidad spec → code |
| `run_command` | Ejecutar validaciones y tests |

## 📚 Referencias

- [templates/spec.yaml](../templates/spec.yaml) — Template de especificación
- [templates/plan.yaml](../templates/plan.yaml) — Template de plan
- [templates/tasks.yaml](../templates/tasks.yaml) — Template de tasks
- [workflows/spec-driven.md](../workflows/spec-driven.md) — Workflow SOP completo
- [skills/orchestrator/SKILL.md](../orchestrator/SKILL.md) — Routing automático

## 📋 Definition of Done (Spec-Driven)

### Pipeline Completo
- [ ] `spec.yaml` creado y aprobado
- [ ] `plan.yaml` creado y aprobado
- [ ] `tasks.yaml` creado con tasks atómicas
- [ ] Todas las tasks implementadas
- [ ] Verificación contra spec completada

### Trazabilidad
- [ ] Cada user story tiene acceptance criteria
- [ ] Cada task tiene criterio de aceptación
- [ ] Context Handoff Protocol usado entre fases
- [ ] Plan de rollback documentado

### Artifacts
- [ ] Todos los artefactos YAML válidos y completos
- [ ] Status actualizado en cada artefacto
- [ ] Lecciones aprendidas documentadas (retrospectiva)

---

*Skill version: 2.3 | SPEC+LM Methodology*
*Compatible con: BMAD-METHOD + SWE-Agent*

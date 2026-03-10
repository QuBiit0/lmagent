---
name: spec-driven-dev
description: "Metodología SPEC DRIVEN: pipeline SPECIFY → PLAN → TASKS → CODE → VERIFY. Úsalo con /spec para tareas Level 2+ que requieren planificación antes de codear."
role: Development Methodology - Specification as Source of Truth
type: methodology
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
compatibility: Universal - Compatible con todos los agentes LMAgent. Es el workflow central para tareas complejas en LMAgent.
allowed-tools:
  - view_file
  - write_to_file
  - notify_user
  - list_dir
  - grep_search
metadata:
  author: QuBiit
  version: "3.6.0"
  license: MIT
  framework: LMAgent
---

# Spec-Driven Agentic Development Skill

> ⚠️ **FLEXIBILIDAD DEL PIPELINE Y ARTEFACTOS**: Las estructuras YAML propuestas (spec, plan, tasks) y la secuencia estricta de 5 fases son **ejemplos de referencia** arquitectural. Como metodología viva, tienes la flexibilidad de proponer ajustes en los artefactos o gates de aprobación según el tamaño o complejidad requerida por la iniciativa.

> **SPEC+LM Methodology**: La especificación es la fuente de verdad. El código se deriva de ella, no al revés. Cada fase tiene un experto y un artefacto verificable.

## 🧠 System Prompt (The Orchestrator)

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/spec-driven-dev/examples/example_1.markdown`

## 📊 Dependencia de Fases (La delegación de Sub-Agentes)

```mermaid
graph TD
    User["Usuario: 'Agrega dark mode'"] --> Explore["1. Explorador (/sdd-explore)"]
    Explore --> Propose["2. Propositor (/sdd-propose)"]
    Propose -->|User Approval| Spec["3. Especificador (/sdd-spec)"]
    Propose -->|User Approval| Design["4. Diseñador (/sdd-design)"]
    Spec --> Tasks["5. Task Planner (/sdd-tasks)"]
    Design --> Tasks
    Tasks -->|User Approval| Apply["6. Implementador (/sdd-apply)"]
    Apply --> Verify["7. Verificador (/sdd-verify)"]
    Verify --> Archive["8. Archivador (/sdd-archive)"]
```

## 📝 Phase 1: SPECIFY (`/pm`)

**Objetivo**: Definir QUÉ construir y POR QUÉ.

### Artefacto: `spec.yaml`

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/spec-driven-dev/examples/example_2.yml`

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

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/spec-driven-dev/examples/example_3.yml`

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

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/spec-driven-dev/examples/example_4.yml`

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

## 🛠️ Comandos de Orquestación

Como orquestador, estarás atento a estos *intentos* del usuario para delegar subagentes:

| Comando | Archivo de Sub-Agente a Cargar y Asumir |
|---------|------------------------------------------|
| `/sdd-init` | Detectar stack del proyecto y crear estructura inicial. |
| `/sdd-explore <topic>` | Lee: `references/prompt-explore.md` (Explorar Contexto) |
| `/sdd-new <name>` | Lee: `references/prompt-propose.md` (Proposal.md y ScoreCard) |
| `/sdd-ff <name>` | Fast-Forward: Encadena propuesta → spec → diseño → tasks |
| `/sdd-spec` | Lee: `references/prompt-spec.md` (Historias, ACs, Specs formales) |
| `/sdd-design` | Lee: `references/prompt-design.md` (Arquitecto de ADRs) |
| `/sdd-tasks` | Lee: `references/prompt-tasks.md` (Planificador atómico de Tasks) |
| `/sdd-apply` | Lee: `references/prompt-apply.md` (Coder Puro en Modo Ciego/Apply) |
| `/sdd-verify` | Lee: `references/prompt-verify.md` (QA Estricto sobre ACs de spec) |
| `/sdd-archive` | Lee: `references/prompt-archive.md` (Cierre, Logs y Actualización Documental) |

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


*Compatible con: BMAD-METHOD + SWE-Agent*

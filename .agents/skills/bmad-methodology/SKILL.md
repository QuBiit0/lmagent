---
name: bmad-methodology
description: "Clasificación de complejidad de tareas y selección de metodología (BMAD, SWE-Agent, Spec-Driven). Úsalo con /bmad para determinar el nivel de una tarea (0-4) y el workflow correcto."
role: Scale-Adaptive Intelligence & Project Orchestration
type: methodology
icon: 🧠
expertise:
  - Scale-Adaptive Intelligence (Levels 0-4)
  - Project Kickoff & Discovery
  - Multi-Persona Orchestration
  - Ideation & Brainstorming (SCAMPER, 5 Whys)
  - PRD Generation
  - Complexity Classification
  - Agile-Lean hybrid methodologies
activates_on:
  - Inicio de proyecto nuevo
  - Clasificación de complejidad de tarea
  - Brainstorming e ideación
  - Generación de PRDs
  - Orquestación multi-persona
  - Cuando se necesita decidir el nivel de planning requerido
triggers:
  - /bmad
  - /kickoff
  - /classify
compatibility: Universal - Compatible con todos los agentes LMAgent. Siempre se activa antes de elegir una metodología de trabajo.
allowed-tools:
  - view_file
  - list_dir
  - notify_user
metadata:
  author: QuBiit
  version: "3.6.0"
  license: MIT
  framework: LMAgent
---

# BMAD Methodology Skill

> **BMAD-METHOD**: Build, Measure, Adapt, Deliver — un framework de inteligencia adaptativa que ajusta el nivel de rigor según la complejidad de la tarea.

> ⚠️ **FLEXIBILIDAD METODOLÓGICA**: Si bien BMAD detalla niveles y herramientas específicas (ej. `PROJECT_KICKOFF.md`), estas actúan como **ejemplos de referencia**. Eres libre de adaptar o evolucionar estas ceremonias según las necesidades reales del proyecto o las corrientes ágiles más modernas.

## 🧠 System Prompt

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/bmad-methodology/examples/example_1.markdown`



### 🌍 Agnosticismo Tecnológico y Flexibilidad (LMAgent Core Rule)
Eres un experto **tecnológicamente agnóstico**. NO obligues al usuario a utilizar tecnologías, frameworks o versiones obsoletas a menos que te lo pidan explícitamente. Evalúa el entorno del usuario, respeta su stack actual, y cuando diseñes o propongas soluciones nuevas, recomienda siempre el uso de herramientas modernas, estables y vigentes (Latest Stable), justificando tus decisiones técnica y lógicamente.



> 📌 **Protocolo Universal**: Aplica estrictamente el *Agnosticismo Tecnológico* y la *Inyección de Memoria* descritos en `.agents/rules/00-master.md` antes de proceder.

## 📊 Scale-Adaptive Intelligence

El corazón de BMAD es el **sistema de niveles** que adapta el proceso a la complejidad real:

```
┌──────────────────────────────────────────────────────────────────┐
│                 BMAD SCALE-ADAPTIVE LEVELS                       │
│                                                                   │
│  Level 0: TRIVIAL    │ <5 min    │ No planning  │ Just do it     │
│  Level 1: SMALL      │ 5-30 min  │ Minimal plan │ Brief desc     │
│  Level 2: MEDIUM     │ 30m-2h    │ Standard     │ impl_plan.md   │
│  Level 3: COMPLEX    │ 2-8h      │ Extensive    │ Full artifacts │
│  Level 4: ENTERPRISE │ 8h+       │ Audit-grade  │ Governance     │
│                                                                   │
│  💡 Referencia completa: config/levels.yaml                      │
└──────────────────────────────────────────────────────────────────┘
```

### Clasificación Automática

| Señal | Nivel Mínimo | Razón |
|-------|-------------|-------|
| Archivos `*.sql` afectados | Level 2 | Cambios de DB requieren cuidado |
| Archivos `*auth*` afectados | Level 2 | Seguridad sensible |
| Archivos `*migration*` | Level 3 | Planning extensivo requerido |
| Archivos `*security*` | Level 3 | Revisión obligatoria |
| Keywords "breaking change" | Level 3+ | Impacto amplio |

## 🚀 Project Kickoff Protocol

Para proyectos nuevos, BMAD define un flujo de arranque estructurado:

> 📂 **Ejemplo Extraído**: Ver implementación completa en `.agents/skills/bmad-methodology/examples/example_2.txt`

**Template de arranque**: [PROJECT_KICKOFF.md](../templates/PROJECT_KICKOFF.md)

## 💡 Ideation Framework

BMAD incluye frameworks de ideación estructurada:

### Modos Disponibles

| Modo | Descripción | Cuándo Usar |
|------|-------------|-------------|
| 🌱 Seed Expansion | Expandir idea semilla en múltiples direcciones | Idea inicial vaga |
| 🔍 Problem Exploration | 5 Whys + 5 Whos + 5 Hows | Entender un problema |
| 💡 Solution Generation | SCAMPER + Crazy 8s | Generar soluciones |
| 🔀 Combinatorial | Concept Mash-up | Combinar conceptos |
| 🎯 Constraint-Based | Idear bajo restricciones | Limitaciones conocidas |

**Workflow completo**: [ideation.md](../workflows/ideation.md)

## 📄 PRD Generation (BMAD-style)

BMAD genera PRDs completos con un proceso de 4 fases:

1. **Discovery** → Entender problema, identificar usuarios, analizar contexto
2. **Definition** → Definir scope, priorizar features, establecer métricas
3. **Specification** → User Stories, Acceptance Criteria, Mockups
4. **Validation** → Review con stakeholders, ajustes, aprobación

**Workflow completo**: [generate-prd.md](../workflows/generate-prd.md)

## 🔄 Multi-Persona Orchestration

BMAD coordina personas según la fase del proyecto:

| Fase | Persona | Artefacto | Validación |
|------|---------|-----------|------------|
| Discovery | `/pm` | Problem Statement | ¿Problema real validado? |
| Planning | `/arch` | ADRs, plan.yaml | ¿Arquitectura viable? |
| Tasks | `/dev` | tasks.yaml | ¿Tasks atómicas? |
| Implement | `/dev` + `/frontend` | Código | ¿Tests passing? |
| Verify | `/qa` | Report | ¿Criteria cumplidos? |
| Deploy | `/devops` | Pipeline | ¿Rollback plan? |

**Orchestrator como coordinador**: El skill [orchestrator](../orchestrator/SKILL.md) usa BMAD para decidir qué persona activar y cuándo.

## 🛠️ Comandos

| Comando | Acción |
|---------|--------|
| `/bmad classify [descripción]` | Clasificar nivel de una tarea |
| `/bmad kickoff` | Iniciar protocolo de arranque de proyecto |
| `/bmad ideate [tema]` | Iniciar sesión de ideación |
| `/bmad prd [nombre]` | Generar PRD completo |
| `/bmad status` | Ver estado actual del proyecto |

## 🛠️ Tool Bindings

| Herramienta | Cuándo Usarla |
|-------------|---------------|
| `view_file` | Leer PROJECT_KICKOFF.md, spec.yaml existentes |
| `write_to_file` | Generar PRDs, specs |
| `notify_user` | Pedir clasificación de nivel, aprobación de PRD |
| `generate_image` | Crear diagramas de flujo, wireframes |
| `search_web` | Research de mercado para PRDs |

## 📚 Referencias

- [config/levels.yaml](../config/levels.yaml) — Sistema de niveles completo
- [templates/PROJECT_KICKOFF.md](../templates/PROJECT_KICKOFF.md) — Template de arranque
- [workflows/ideation.md](../workflows/ideation.md) — Workflow de ideación
- [workflows/generate-prd.md](../workflows/generate-prd.md) — Workflow de PRD
- [skills/orchestrator/SKILL.md](../orchestrator/SKILL.md) — Orquestador

## 📋 Definition of Done (BMAD)

### Clasificación
- [ ] Nivel de complejidad asignado (0-4)
- [ ] Artefactos requeridos identificados según nivel
- [ ] Persona(s) correcta(s) activada(s)

### Project Kickoff
- [ ] PROJECT_KICKOFF.md completado
- [ ] Nivel clasificado
- [ ] Workflow correcto activado

### Ideación / PRD
- [ ] Framework de ideación seleccionado y ejecutado
- [ ] Top 3 ideas documentadas
- [ ] PRD generado con métricas de éxito
- [ ] Stakeholder sign-off obtenido

---


*Compatible con: Spec-Driven Development + SWE-Agent*

# ⚡ Active Context (Current Sprint/Task)
> **Update Frequency:** DAILY. Read this before starting work.

> [!IMPORTANT]
> **COMPRESIÓN DE CONTEXTO OBLIGATORIA (Rule 08)**
> Los agentes LLM tienen un límite de *Context Window*. Antes de perder el hilo conversacional o de abandonar la tarea, **EL AGENTE DEBE** venir a este archivo y actualizar el `Current Focus` y los `Rolling Checkpoints`, resumiendo los descubrimientos clave para el próximo agente.

## 📍 Current Focus
- **Epic/Feature:** Auditoría y Rollout de LMAgent v3.6.0 (Refactoring de CLI y Docs)
- **Status:** In-Progress
- **Handoff Esperado:** Del Analista al Desarrollador.

## 🚧 Active Tasks
1. Arreglar Bug de recursión en instalador CLI (`uninstall` destruyendo carpetas de agente ajenas a lmagent).
2. Refactorizar dependencias JS para forzar CommonJS y quitar warnings de import de módulos (validate_skills.js, create_skill.js).
3. Corregir referencias falsas a memorias inexistentes (ej. 04-active-context.md en AGENTS y pilares).
4. Subir la versión a v3.6.0 globalmente.

## 🔄 Rolling Checkpoints (Resúmenes de Progreso)
*Agrega aquí los hallazgos críticos de forma hiper-colapsada para habilitar el relevo entre Agentes/Ventanas de Contexto:*
- **[02/03/2026]**: Se acordó aplicar patches a scripts core (CommonJS) y asegurar el fallback del instalador.
- **[02/03/2026]**: Revisión del uninstall y global_version_bump para incluir archivos MD de la raíz y scripts sh.

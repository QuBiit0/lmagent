# ⚡ Active Context (Current Sprint/Task)
> **Update Frequency:** DAILY. Read this before starting work.

> [!IMPORTANT]
> **COMPRESIÓN DE CONTEXTO OBLIGATORIA (Rule 08)**
> Los agentes LLM tienen un límite de *Context Window*. Antes de perder el hilo conversacional o de abandonar la tarea, **EL AGENTE DEBE** venir a este archivo y actualizar el `Current Focus` y los `Rolling Checkpoints`, resumiendo los descubrimientos clave para el próximo agente.

## 📍 Current Focus
- **Epic/Feature:** Mejora exhaustiva de resources del framework LMAgent v3.6.0
- **Status:** Completed
- **Handoff Esperado:** Framework listo para uso en proyectos.

## 🚧 Active Tasks
1. ~~Arreglar Bug de recursión en instalador CLI~~ *(resuelto en sprint anterior)*
2. ~~Refactorizar dependencias JS para forzar CommonJS~~ *(resuelto en sprint anterior)*
3. ~~Corregir referencias falsas a memorias inexistentes~~ *(corregido)*
4. ~~Subir la versión a v3.6.0 globalmente~~ *(completado)*

## ✅ Completed This Sprint (10/Mar/2026)
1. **Etapa 1**: Reescrito `SKILL_TEMPLATE.md` con estructura canónica de 10 secciones obligatorias.
2. **Etapa 2**: 38/38 skills con Inyección de Memoria. 6 skills reescritos en profundidad (DoD, Tool Bindings, Interacciones).
3. **Etapa 3**: 6 rules expandidas masivamente (promedio 3x-5x). 3 rules registradas en master index. Duplicación eliminada en `04-security.md`.
4. **Etapa 4**: 4 memory files mejorados + `06-conventions.md` creado. `AGENTS.md` actualizado (14 Rules, 6 Memory Files).

## 🔄 Rolling Checkpoints (Resúmenes de Progreso)
*Agrega aquí los hallazgos críticos de forma hiper-colapsada para habilitar el relevo entre Agentes/Ventanas de Contexto:*
- **[10/03/2026]**: Mejora exhaustiva completada. 38 skills con inyección de memoria, 0 con DoD genérica. 14 rules registradas y expandidas. 6 memory files (nuevo: `06-conventions.md`).
- **[02/03/2026]**: Se acordó aplicar patches a scripts core (CommonJS) y asegurar el fallback del instalador.
- **[02/03/2026]**: Revisión del uninstall y global_version_bump para incluir archivos MD de la raíz y scripts sh.

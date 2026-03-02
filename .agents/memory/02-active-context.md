# ⚡ Active Context (Current Sprint/Task)
> **Update Frequency:** DAILY. Read this before starting work.

## 📍 Current Focus
- **Epic/Feature:** Auditoría y Rollout de LMAgent v3.6.0 (Refactoring de CLI y Docs)
- **Status:** In-Progress

## 🚧 Active Tasks
1. Arreglar Bug de recursión en instalador CLI (`uninstall` destruyendo carpetas de agente ajenas a lmagent).
2. Refactorizar dependencias JS para forzar CommonJS y quitar warnings de import de módulos (validate_skills.js, create_skill.js).
3. Corregir referencias falsas a memorias inexistentes (ej. 04-active-context.md en AGENTS y pilares).
4. Subir la versión a v3.6.0 globalmente.

## 📝 Recent Context / Notes
- [02/03/2026]: Se acordó aplicar patches a scripts core (CommonJS) y asegurar el fallback del instalador.
- [02/03/2026]: Revisión del uninstall y global_version_bump para incluir archivos MD de la raíz y scripts sh.

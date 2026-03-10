# Flujo de Trabajo - LMAgent
> **Tipo**: `rule` | **Versión**: 3.5.0 | **Actualización**: 2026-03

Este documento define el ciclo de vida del desarrollo para los agentes.

## 🔄 Ciclo de Ejecución LMAgent (The Loop)

1. **ENTENDER**:
   - Leer `00-master.md` y clasificar la tarea en Nivel 0 a 4 (`levels.yaml`).
   - Cargar contexto del proyecto desde `.agents/memory/`.

2. **CLASIFICAR & PLANIFICAR**:
   - **Nivel 0 (Trivial < 5m)**: Typo, format, config menor. *Ejecución directa.*
   - **Nivel 1 (Small < 30m)**: Bug fix simple, refactor local. *Plan mental.*
   - **Nivel 2 (Medium < 2h)**: Feature nueva. *Requiere `implementation_plan.md`.*
   - **Nivel 3 (Complex < 8h)**: Multi-servicio. *Demanda `architecture.md` + `implementation_plan.md` y revisión.*
   - **Nivel 4 (Critical > 1d)**: Riesgo alto (Pagos, Auth core). *Demanda `/arch` exhaustivo + `security_review.md`.*

3. **CONSTRUIR ARTEFACTOS**:
   - Para niveles 2+, documentar el plan en `.agents/memory/[sesion]/ implementation_plan.md`.
   - Modificar archivos en bloques atómicos lógicos (Modelos -> Servicios -> Routers -> Tests).

4. **EJECUTAR & VERIFICAR**:
   - Validar sintaxis y lógica (Linting, Tests, Typecheck).
   - "Nunca asumas que funcionó". Comprueba los cambios.

5. **DOCUMENTAR**:
   - Actualizar `README.md`, changelogs, y `02-active-context.md` con los avances.

## 🛠️ Casos Especiales
- **Bugs de Producción**: 1. Aislar/Reproducir 2. Escribir Test 3. Fix 4. Verificar.
- **Grandes Refactores**: Requiere branches/PRs pequeños, retro-compatibilidad y feature flags si aplica.

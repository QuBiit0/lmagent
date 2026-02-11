---
description: Workflow para code review completo de un PR o cambios
---

# Code Review Workflow

Usa este workflow para revisar código antes de merge.

## Pasos

1. **Identificar archivos cambiados**
   ```bash
   git diff --name-only main...HEAD
   ```

2. **Revisar cada archivo por:**
   - [ ] Correctness: ¿Hace lo que dice?
   - [ ] Design: ¿Diseño simple y claro?
   - [ ] Readability: ¿Se entiende sin explicación?
   - [ ] Performance: ¿N+1 queries? ¿Operaciones O(n²)?
   - [ ] Testing: ¿Tests suficientes?
   - [ ] Security: ¿Inputs validados?

3. **Ejecutar tests**
   ```bash
   pytest  # Python
   npm test  # JavaScript
   ```

4. **Ejecutar linter**
   ```bash
   ruff check .  # Python
   npm run lint  # JavaScript
   ```

5. **Documentar feedback:**
   - ✅ Aprobado
   - 🔧 Cambios solicitados
   - 💬 Comentarios/sugerencias

## Criterios de Aprobación

- Todos los tests pasan
- Linter sin errores
- Sin bugs obvios
- Código legible
- Seguridad verificada

Para más detalles ver `@/personas/tech-lead.md`

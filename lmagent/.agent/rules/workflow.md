---
description: Regla siempre activa con el flujo de trabajo y proceso de desarrollo
activation: always_on
---

# Flujo de Trabajo

## Proceso General
1. Analizar tarea y determinar nivel (0-4)
2. Consultar persona apropiada si aplica
3. Seguir checklist del nivel correspondiente
4. Ejecutar cambios
5. Verificar con tests/lint
6. Hacer commit con conventional commits

## Conventional Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato sin cambio de lógica
refactor: mejora de código
test: agregar/modificar tests
chore: mantenimiento
```

## Antes de Implementar
- [ ] ¿Leí `@/AGENTS.md`?
- [ ] ¿Identifiqué el nivel de complejidad?
- [ ] ¿Consulté la persona relevante?

## Después de Implementar
- [ ] ¿Pasaron los tests?
- [ ] ¿Pasó el linter?
- [ ] ¿Commit message sigue el formato?

Para más detalles ver `@/rules/workflow.md`

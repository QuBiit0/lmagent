---
description: Workflow para refactorización segura de código
---

# Refactoring Workflow

Usa este workflow para refactorizar código de forma segura.

## Antes de Empezar

1. **Verificar cobertura de tests**
   ```bash
   pytest --cov  # Ver % de cobertura
   ```

2. **Si no hay tests suficientes**, agregarlos primero:
   - Tests que validen el comportamiento actual
   - Estos tests NO deben cambiar durante el refactor

3. **Crear rama**
   ```bash
   git checkout -b refactor/{area}
   ```

## Tipos de Refactoring

### Extract Function/Method
- Código duplicado → función reutilizable
- Función muy larga → funciones más pequeñas

### Rename
- Nombres poco claros → nombres descriptivos
- Actualizar todas las referencias

### Move
- Código en lugar incorrecto → mover a módulo apropiado

### Simplify
- Condicionales complejos → simplificar
- Loops → comprehensions/map/filter

## Proceso de Refactoring

4. **Hacer UN cambio a la vez**

5. **Ejecutar tests después de cada cambio**
   ```bash
   pytest
   ```

6. **Si tests fallan → revertir**
   ```bash
   git checkout -- .
   ```

7. **Si tests pasan → commit**
   ```bash
   git commit -m "refactor: {descripción del cambio}"
   ```

8. **Repetir** hasta completar

## Checklist Final

- [ ] Todos los tests pasan
- [ ] Linter sin errores
- [ ] Sin cambios de comportamiento
- [ ] Código más legible
- [ ] Sin duplicación

## Red Flags (NO hacer)

❌ Cambiar funcionalidad durante refactor
❌ Refactorizar sin tests
❌ Múltiples cambios en un commit
❌ Refactorizar código que no entiendes

Para más detalles ver `@/personas/tech-lead.md`

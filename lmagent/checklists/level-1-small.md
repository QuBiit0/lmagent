# Level 1: Small - Checklist

## Descripción
Cambios pequeños que requieren planificación mínima.

**Tiempo estimado**: 5-30 minutos
**Confirmación requerida**: No (opcional)
**Artefactos**: Descripción breve del cambio

## Ejemplos
- Bug fix simple con causa clara
- Agregar endpoint simple (health check, single resource)
- Refactor dentro de una función/clase
- Agregar logging o métricas
- Actualizar validaciones menores
- Agregar/modificar tests unitarios

---

## Checklist

### 📋 Pre-implementación

#### Entender
- [ ] He leído AGENTS.md y reglas aplicables
- [ ] Entiendo claramente qué hay que hacer
- [ ] Sé qué archivos voy a modificar

#### Planear (breve)
```markdown
## Cambio: [Título breve]

**Qué**: [Qué voy a hacer]
**Por qué**: [Por qué es necesario]
**Archivos**: [Lista de archivos a tocar]
```

### 🛠️ Implementación

#### Código
- [ ] Seguir patrones existentes del proyecto
- [ ] Type hints en funciones nuevas
- [ ] Docstrings en funciones públicas
- [ ] No dejar código comentado
- [ ] No dejar TODOs sin justificación

#### Tests
- [ ] Agregar test para el cambio (si aplica)
- [ ] Tests existentes siguen pasando

### ✅ Validación

#### Verificaciones
- [ ] `pytest` pasa (o equivalente)
- [ ] `ruff check .` pasa (linting)
- [ ] `ruff format --check .` pasa (formatting)

#### Review rápido
- [ ] El código hace lo que debe
- [ ] No hay efectos secundarios obvios

### 📝 Finalización

#### Commit
```
type(scope): descripción breve

# Ejemplos:
fix(auth): handle expired tokens correctly
feat(api): add health check endpoint
refactor(users): extract validation logic
test(orders): add tests for edge cases
```

---

## Señales de que es Level 2+

Escalar si:
- ⚠️ Afecta múltiples módulos/servicios
- ⚠️ Requiere cambios de base de datos
- ⚠️ Afecta APIs públicas/contratos
- ⚠️ Necesita coordinación con otros
- ⚠️ Tiene implicaciones de seguridad
- ⚠️ Tiempo estimado > 30 minutos

---

## Quick Reference

| Acción | Comando |
|--------|---------|
| Ejecutar tests | `pytest -v` |
| Lint | `ruff check .` |
| Format | `ruff format .` |
| Type check | `mypy app/` |

# Guía de Estilo de Código - LMAgent

> **Tipo**: `rule` | **Versión**: 3.5.0 | **Actualización**: 2026-03

## 📌 Principios Universales
1. **Legibilidad > Cleverness**: Escribe código que otro ingeniero entienda rápidamente.
2. **DRY & SOLID**: Evita repetición. Aplica principios SOLID.
3. **Fail-Fast**: Falla rápido y con mensajes descriptivos.
4. **No Side-Effects Ocultos**: Las funciones deben ser predecibles.

## 🐍 Python

### Herramientas y Configuración
- **Linting & Formatting**: `ruff check .` y `ruff format .`.
- **Type Checking**: `mypy`. Type hints son **OBLIGATORIOS** en firmas.
- Máximo 88 caracteres por línea.

### Convenciones
- **Variables/Funciones**: `snake_case`. Private con prefijo `_`.
- **Clases/Excepciones**: `PascalCase`.
- **Constantes**: `UPPER_SNAKE_CASE`.
- **Docstrings**: Formato Google requerido para funciones públicas y clases.
- **Async**: Evita código bloqueante (ej: `requests`) en event loops `asyncio`.
- **Gestión de Errores**: Define excepciones custom (ej: `ServiceError`). Usa raise temprano.

## 🔵 TypeScript / JavaScript

### Herramientas y Configuración
- **Linting & Formatting**: `eslint .` y `prettier --write .`.
- **Type Checking**: `tsc --noEmit`. `strict: true` obligatorio.
- Máximo 100 caracteres por línea.

### Convenciones
- **Variables/Funciones**: `camelCase`.
- **Clases/Interfaces/Tipos/Enums**: `PascalCase` (sin prefijo "I" para interfaces).
- **Types > Any**: Prohibido usar `any`. Usa `unknown` si es necesario, o Generics.
- **Modificadores**: Usa `private`, `protected`, `readonly` explícitamente en clases.
- **Exportaciones**: Evita `export default`. Usa named exports para facilitar refactoring.
- **Errores**: Extiende `Error` para errores de dominio (ej: `class AppError extends Error`).

## 🏗️ Arquitectura y Diseño

- **Inyección de Dependencias**: Pasa servicios/repositorios por constructor, no instancies en duro. Facilita testing aislando side effects.
- **Interfaces Primero**: Usa abstracciones para I/O externa (DBs, APIs).
- **Comentarios**: Explica el *Por Qué*, no el *Qué*. `// TODO: [autor] - desc` para deuda técnica.

## ✅ Definition of Done (Code Style)
- [ ] Linter y Formatter pasan sin advertencias.
- [ ] Type checker (tsc/mypy) pasa sin errores.
- [ ] Funciones tienen firmas tipadas (types/hints).
- [ ] Sin código muerto, `any`, `console.log` o variables no utilizadas.
- [ ] Imports ordenados y sin dependencias circulares.

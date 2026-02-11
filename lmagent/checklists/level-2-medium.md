# Level 2: Medium - Checklist

## Descripción
Cambios medianos que requieren planificación estándar.

**Tiempo estimado**: 30 min - 2 horas
**Confirmación requerida**: Sí
**Artefactos**: implementation_plan.md

## Ejemplos
- Feature nuevo con varios endpoints
- Integración con servicio externo
- Nuevo workflow de n8n completo
- Agregar autenticación a servicio
- Refactor de módulo completo
- Bug complejo que afecta múltiples archivos

---

## Checklist

### 📋 Fase 1: Entender y Planear

#### Entender el Contexto
- [ ] Leer AGENTS.md
- [ ] Leer reglas aplicables en `rules/`
- [ ] Revisar código existente relacionado
- [ ] Identificar dependencias

#### Clasificar
- [ ] Confirmar que es Level 2 (no 1 ni 3)
- [ ] Identificar persona(s) a activar

#### Crear Plan de Implementación
```markdown
# Implementation Plan: [Título]

## Objetivo
[Descripción del cambio y propósito]

## Archivos a Modificar
- [ ] `path/file1.py` - [Cambio]
- [ ] `path/file2.py` - [Cambio]

## Archivos Nuevos
- [ ] `path/new_file.py` - [Propósito]

## Orden de Implementación
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

## Tests Necesarios
- [ ] Test para [funcionalidad 1]
- [ ] Test para [funcionalidad 2]

## Riesgos
- [Riesgo potencial 1]
- [Riesgo potencial 2]
```

#### Confirmación
- [ ] **PEDIR CONFIRMACIÓN del plan antes de implementar**

### 🛠️ Fase 2: Implementar

#### Estructura de Código
- [ ] Schemas/Models primero
- [ ] Repositories (acceso a datos)
- [ ] Services (lógica de negocio)
- [ ] Routers/Controllers (API)
- [ ] Tests

#### Estándares de Código
- [ ] Type hints en todas las funciones
- [ ] Docstrings en funciones públicas
- [ ] Logging apropiado
- [ ] Manejo de errores con excepciones tipadas
- [ ] Configuración via variables de entorno

#### Commits Incrementales
```
# Hacer commits pequeños y frecuentes
feat(module): add user schema and model
feat(module): add user repository
feat(module): add user service
feat(module): add user API endpoints
test(module): add user tests
```

### ✅ Fase 3: Validar

#### Tests
- [ ] Tests unitarios para lógica nueva
- [ ] Tests de integración para endpoints
- [ ] Cobertura >= 80%

```bash
pytest --cov=app --cov-report=term-missing --cov-fail-under=80
```

#### Calidad de Código
- [ ] Linting pasa
- [ ] Formatting correcto
- [ ] Type checking (si aplica)

```bash
ruff check .
ruff format --check .
mypy app/
```

#### Funcionalidad
- [ ] Feature funciona como se espera
- [ ] Edge cases manejados
- [ ] Error handling apropiado

### 📝 Fase 4: Documentar y Finalizar

#### Documentación
- [ ] Docstrings actualizados
- [ ] README actualizado si hay cambios de uso
- [ ] API docs generadas/actualizadas

#### Pull Request
```markdown
## [Tipo]: [Título]

### Descripción
[Qué hace este PR]

### Cambios
- [Cambio 1]
- [Cambio 2]

### Testing
- [x] Tests unitarios
- [x] Tests de integración
- [x] Probado manualmente

### Checklist
- [x] Código sigue estándares
- [x] Tests agregados
- [x] Documentación actualizada
- [x] Sin breaking changes
```

---

## Template: implementation_plan.md

```markdown
# Implementation Plan: [Título del Feature/Fix]

## Resumen
[1-2 oraciones describiendo el objetivo]

## Contexto
[Por qué es necesario este cambio]

## Diseño Técnico

### Componentes Afectados
| Componente | Cambio |
|------------|--------|
| [Componente 1] | [Descripción] |
| [Componente 2] | [Descripción] |

### Archivos a Modificar
- `path/to/file1.py` - [Descripción del cambio]
- `path/to/file2.py` - [Descripción del cambio]

### Archivos Nuevos
- `path/to/new_file.py` - [Propósito]

### Dependencias
- [Dependencia 1] - [Versión]
- [Dependencia 2] - [Versión]

## Plan de Implementación

### Fase 1: [Nombre]
1. [Paso 1]
2. [Paso 2]

### Fase 2: [Nombre]
1. [Paso 1]
2. [Paso 2]

## Testing

### Tests Unitarios
- [ ] Test para [caso 1]
- [ ] Test para [caso 2]

### Tests de Integración
- [ ] Test para [flujo 1]

## Rollback Plan
[Cómo revertir si algo sale mal]

## Estimación
- Tiempo: [X horas]
- Complejidad: Level 2
```

---

## Señales de que es Level 3+

Escalar si:
- ⚠️ Afecta arquitectura del sistema
- ⚠️ Requiere migración de datos
- ⚠️ Cambio en múltiples servicios/repos
- ⚠️ Implicaciones de seguridad significativas
- ⚠️ Requiere coordinación con múltiples personas
- ⚠️ Tiempo estimado > 2 horas

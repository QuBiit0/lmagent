# Level 0: Trivial - Checklist

## Descripción
Cambios triviales que no requieren planificación formal.

**Tiempo estimado**: < 5 minutos
**Confirmación requerida**: No
**Artefactos**: Ninguno

## Ejemplos
- Corregir typos en documentación
- Actualizar versión en package.json/pyproject.toml
- Agregar/modificar variable de entorno en .env.example
- Fix de formato/whitespace
- Actualizar comentarios
- Agregar entrada a .gitignore

---

## Checklist

### Antes de Implementar
- [ ] Verificar que es realmente Level 0
- [ ] No hay impacto en funcionalidad

### Implementar
- [ ] Hacer el cambio directamente
- [ ] Verificar que no hay errores de sintaxis

### Después
- [ ] Commit con mensaje claro: `chore: fix typo in README`
- [ ] No se requiere PR para cambios triviales (según política del equipo)

---

## Señales de que NO es Level 0

Si aparece alguna de estas señales, escalar a Level 1+:

- ⚠️ El cambio afecta comportamiento del código
- ⚠️ Requiere agregar dependencias
- ⚠️ Afecta archivos de configuración de producción
- ⚠️ Otros desarrolladores dependen de esto
- ⚠️ Requiere testing

---

## Formato de Commit

```
chore: descripción breve

# Ejemplos:
chore: fix typo in README
chore: update version to 1.2.3
chore: add .env.example entry for NEW_VAR
docs: fix formatting in API docs
style: fix indentation in config.py
```

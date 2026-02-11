---
description: Workflow para debugging sistemático de problemas
---

# Debugging Workflow

Usa este workflow para debuggear problemas de forma sistemática.

## 1. Reproducir el Bug

- [ ] ¿Puedo reproducirlo consistentemente?
- [ ] ¿Cuáles son los pasos exactos?
- [ ] ¿En qué ambiente ocurre? (local, staging, prod)

## 2. Recopilar Información

```bash
# Ver logs recientes
docker logs app --since 10m

# Ver logs de error
grep -i error app.log | tail -20

# Ver estado de la app
curl localhost:8000/health
```

## 3. Formular Hipótesis

Basado en la info:
- ¿Qué podría estar causando esto?
- ¿Qué cambió recientemente?
- ¿Hay patrones en los errores?

## 4. Aislar el Problema

### Divide and Conquer
1. ¿El problema está en frontend o backend?
2. ¿En qué endpoint/componente?
3. ¿En qué función específica?

### Bisect (si es regresión)
```bash
git bisect start
git bisect bad  # commit actual malo
git bisect good v1.2.3  # último commit bueno
# Git te llevará al commit culpable
```

## 5. Verificar Hipótesis

### Agregar logging temporal
```python
import logging
logger.debug(f"Variable value: {variable}")
```

### Usar debugger
```python
import pdb; pdb.set_trace()  # Python
```

```javascript
debugger;  // JavaScript
```

## 6. Implementar Fix

1. Escribir test que falle (reproduce el bug)
2. Implementar el fix
3. Verificar que el test pasa
4. Verificar que no rompió nada más

## 7. Documentar

```markdown
## Bug: {descripción}

### Síntomas
{qué se observaba}

### Causa raíz
{por qué ocurría}

### Solución
{qué se hizo para arreglarlo}

### Prevención
{cómo evitar que vuelva a ocurrir}
```

## Herramientas Útiles

| Tool | Uso |
|------|-----|
| `pdb` / `ipdb` | Debugger Python |
| Chrome DevTools | Debug frontend |
| `strace` | System calls |
| `tcpdump` | Network |
| `htop` | Recursos |

Para más detalles ver `@/personas/backend-engineer.md`

# 🧠 System Learnings & Patterns
> **Update Frequency:** Continuous (After solving tricky bugs or finding good patterns).

> [!IMPORTANT]
> **COMPRESIÓN DE CONTEXTO**: Este archivo es CRÍTICO para la continuidad entre sesiones.
> Cuando descubras un bug, patrón o anti-patrón importante, registrarlo aquí permite que
> el próximo agente (o sesión) no repita los mismos errores.

---

## 🐛 Known Bugs / Gotchas

> Formato: `[ID-Descriptivo]: Descripción del problema`
> Cada bug debe incluir el **Fix** aplicado o pendiente.

### Activos
<!-- Agregar aquí bugs conocidos que aún no se han resuelto completamente -->

### Resueltos
- **[BUG-001] CLI Module Warning**: Los scripts usando `import` sin `"type": "module"` en `package.json` disparan warnings de ESM al correr vía Node + Commander. 
  - *Fix*: Usar `require()` y `module.exports` (CommonJS estricto).
  - *Estado*: ✅ Resuelto.

- **[BUG-002] Borrado Recursivo Uninstall**: Desinstalar plugins pasándole las carpetas padre borraba configuraciones propias de IDEs (`.github/`, `.continue/`).
  - *Fix*: Filtrar directorios raíz de agente. Solo borrar sub-archivos específicos de LMAgent.
  - *Estado*: ✅ Resuelto.

---

## 💡 Best Practices Discovered

> Patrones exitosos descubiertos durante el desarrollo.

1. **Bridge Files por Entorno**: Los archivos bridge aseguran que un `AGENTS.md` único sea consumible por IDEs que leen solo extensiones específicas u hojas en un directorio particular.

2. **Versiones explícitas en MD**: Mantener plantillas con tags explícitos (ej. `v3.6.0` o `{{VERSION}}`) evita tener un desajuste entre el `package.json` y los tutoriales incrustados de la librería.

3. **[NUEVO PATRÓN]**: [Descripción del patrón descubierto]

---

## 🚫 Anti-Patterns (What NOT to do)

> Errores que se cometieron y no deben repetirse.

1. **Bleeding Edge Dependencies**: Modificar el core de `package.json` para deps de bleeding edge que rompan retro-compatibilidad. NPM global install debe funcionar en Node v18+ sin deprecation warnings.

2. **DoD Genérica Copy-Paste**: No usar la misma "Definition of Done" (3 líneas genéricas) en todos los skills. Cada rol tiene criterios específicos de calidad. (Resuelto en v3.6.0+)

3. **[NUEVO ANTI-PATRÓN]**: [Descripción]

---

## 📐 Architecture Decision Records (ADR)

> Formato formal para decisiones técnicas significativas.

### Template ADR

```markdown
### ADR-[NNN]: [Título de la Decisión]
- **Fecha**: [YYYY-MM-DD]
- **Estado**: [Propuesto | Aceptado | Deprecado | Reemplazado por ADR-XXX]
- **Contexto**: [¿Qué problema estábamos resolviendo?]
- **Decisión**: [¿Qué decidimos hacer y por qué?]
- **Alternativas Consideradas**: 
  1. [Alternativa A — razón de descarte]
  2. [Alternativa B — razón de descarte]
- **Consecuencias**: [¿Qué implica esta decisión? Trade-offs.]
```

### ADR-001: CommonJS como Module System del CLI
- **Fecha**: 2026-02-28
- **Estado**: Aceptado
- **Contexto**: Los scripts del CLI (`validate_skills.js`, `create_skill.js`) generaban warnings de ESM al usar `import`.
- **Decisión**: Adoptar CommonJS estricto (`require()` / `module.exports`) para todo el CLI.
- **Alternativas Consideradas**:
  1. ESM con `"type": "module"` — Requería refactor extenso y rompía compatibilidad con Node < 18.
  2. Compilación con esbuild — Overhead innecesario para scripts simples.
- **Consecuencias**: Compatibilidad amplia con Node 18+, sin warnings, pero no se puede usar `import` nativo.

---

## 🔗 Useful References

> Links y recursos descubiertos durante el desarrollo que pueden ser útiles en el futuro.

- [Referencia 1]: [URL o descripción]
- [Referencia 2]: [URL o descripción]

# 🧠 System Learnings & Patterns
> **Update Frequency:** Continuous (After solving tricky bugs or finding good patterns).

## 🐛 Known Bugs / Gotchas
- [Bug CLI Module Warning]: Los scripts usando `import` sin `"type": "module"` en `package.json` disparan warnings por parseo sintáctico ESM al correr vía Node + Commander. 
  - *Fix*: Usar explícitamente `require()` y `module.exports` o modificar package.json. Hemos optado por CommonJS estricto de momento para mantener consistencia con `install.js`.
- [Bug Borrado Recursivo Uninstall]: Desinstalar plugins pasándole las carpetas padre completas borraba configuraciones propias de plugins (ej. `.github/`, `.continue/`). 
  - *Fix*: Se filtran los *directorios raíz de agente* al borrar o se borran solo si las sub-herramientas (rules, workflows) son específicas de LMAgent.

## 💡 Best Practices Discovered
- **CLI Commands**: Los bridge-files por entorno aseguran que un `AGENTS.md` único sea consumible por IDEs que leen *solo* extensiones específicas u hojas en un dir particular.
- **Versiones MD**: Mantener plantillas con tags explícitos (ej. `v3.5.0` o `{{VERSION}}`) evita tener un desajuste temporal entre el package.json y los tutoriales incrustados de la librería.

## 🚫 Anti-Patterns (What NOT to do)
- Modificar el core de `package.json` para dar pie a dependencias de bleeding edge que rompan la retro-compatibilidad. NPM i -g debe funcionar en Node v16+ y no tirar deprecations raras sin control.

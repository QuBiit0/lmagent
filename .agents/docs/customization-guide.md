# 🛠️ Customization Guide

## Personalizando Skills
1. Navega a `.agents/skills/`.
2. Duplica un skill existente o crea uno nuevo.
3. Edita `SKILL.md`. ¡El prompt es código!

## Personalizando Reglas
1. Edita `.agents/rules/00-master.md` para agregar nuevas prioridades.
2. Crea reglas específicas como `11-my-custom-rule.md`.

## Extendiendo el CLI
Si quieres agregar comandos al CLI, deberás clonar el repo de `lmagent` y editar `install.js` o los scripts en `scripts/`.

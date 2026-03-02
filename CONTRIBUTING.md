# Contributing to LMAgent

¡Gracias por tu interés en contribuir a LMAgent! 🚀

Este documento define el proceso para contribuir código, documentación o reportar issues.

## Código de Conducta

Este proyecto se rige por un Código de Conducta estándar. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

---

## ¿Cómo Contribuir?

### 1. Reportar Bugs
- Abrí un Issue en GitHub con el template de **Bug Report**
- Incluí pasos para reproducir, logs y screenshots
- Especificá tu agente (Cursor, Claude Code, etc.) y sistema operativo

### 2. Sugerir Features
- Abrí un Issue con la etiqueta `enhancement`
- Explicá el "por qué" y el caso de uso
- Si es posible, describí la solución técnica propuesta

### 3. Pull Requests (PRs)

#### Proceso
1. Hacé un Fork del repositorio
2. Creá una rama: `git checkout -b feature/mi-nueva-feature`
3. Implementá tus cambios siguiendo las reglas del proyecto
4. Hacé commit con mensajes descriptivos: `feat: agrega soporte para nuevo-agente`
5. Push a tu rama: `git push origin feature/mi-nueva-feature`
6. Abrí un Pull Request hacia `main`

#### Checklist para PRs
- [ ] ¿Actualizaste la documentación relevante?
- [ ] ¿Actualizaste `AGENTS.md` si agregaste un nuevo agente o skill?
- [ ] ¿Probaste los cambios con `lmagent doctor`?

---

## Estructura del Proyecto

```text
lmagent/
├── install.js                  # CLI principal — todos los comandos
├── scripts/
│   ├── create_skill.js         # Wizard para crear skills
│   ├── validate_skills.js      # Validador de integridad de skills
│   └── token-analyzer.js       # Analizador de tokens del framework
│
├── .agents/
│   ├── rules/                  # 11 reglas de comportamiento (.md)
│   ├── skills/                 # 38 skills especializados (SKILL.md)
│   ├── workflows/              # 13 SOPs (.md)
│   ├── memory/                 # 5 archivos de contexto persistente
│   ├── templates/
│   │   └── agent-configs/      # Templates de configFile por agente
│   ├── config/                 # 6 archivos YAML de configuración
│   ├── docs/                   # Documentación extendida
│   └── scripts/                # Scripts de utilidad del framework
│
├── README.md                   # Documentación principal
└── package.json                # Metadata del framework
```

---

## Agregar un Nuevo Agente

1. Agregá la configuración en `IDE_CONFIGS` en `install.js`:
```js
{ 
  name: 'Nombre del Agente', 
  value: 'valor-unico',
  rulesDir: '.agente/rules',
  skillsDir: '.agente/skills',
  workflowsDir: '.agente/workflows',
  configFile: '.agenterules',        // null si no tiene
  configTemplate: 'template.md',    // null si usa _generic.md
  bridgeFile: '00-lmagent.md',       // null si tiene configFile
  markerFile: '.agente'
}
```

2. Actualizá la tabla de agentes en `AGENTS.md` y `README.md`

3. Si el agente tiene un formato de configFile especial, creá el template en `.agents/templates/agent-configs/`

---

## Agregar un Nuevo Skill

```bash
lmagent create-skill
```

O manualmente:
1. Creá el directorio `.agents/skills/mi-skill/`
2. Creá `SKILL.md` con el frontmatter correcto:
```yaml
---
name: Mi Skill
trigger: /mi-trigger
description: Descripción del skill
version: 1.0.0
---
```
3. Validá con `lmagent validate mi-skill`
4. Actualizá el catálogo en `AGENTS.md` — Sección 5

---

## Desarrollo Local

### Prerrequisitos
- Node.js >= 22

### Setup
```bash
git clone https://github.com/QuBiit0/lmagent.git
cd lmagent
./scripts/install.sh

# Probar comandos locales
node install.js doctor
node scripts/validate_skills.js
node scripts/token-analyzer.js
```

### Convenciones de Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — nueva funcionalidad
- `fix:` — corrección de bug
- `docs:` — cambios en documentación
- `refactor:` — refactoring sin cambio de funcionalidad
- `chore:` — tareas de mantenimiento

---

¡Gracias por ayudar a hacer LMAgent mejor! 🚀

Ver [README.md](README.md) para la documentación completa.

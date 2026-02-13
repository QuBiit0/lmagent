# 📟 CLI Commands Reference
> **Tipo**: `doc` | **Versión**: 3.0.0

## 🎯 **Core Commands**

### `lmagent init`
- **Descripción**: Inicializa un nuevo proyecto o actualiza la configuración existente.
- **Acciones**: Copia `AGENTS.md`, `CLAUDE.md`, y configura `.agents/`.
- **Opciones**:
  - `--force (-f)`: Sobrescribe archivos sin preguntar.
  - `--yes (-y)`: Modo no interactivo (defaults).

### `lmagent install`
- **Descripción**: Instala skills, rules, workflows y memory en el IDE del proyecto.
- **Alias**: `lmagent update`.
- **Acciones**: Detecta el IDE (Cursor, VSCode, etc.) y copia los artefactos necesarios.
- **Opciones**:
  - `--force`: Reescribe configuraciones.

### `lmagent doctor`
- **Descripción**: Verifica la salud del entorno.
- **Chequeos**:
  - Archivos críticos (`AGENTS.md`).
  - `.gitignore` correctamente configurado.
  - Versiones de dependencias.

### `lmagent validate`
- **Descripción**: Valida la integridad de los Skills (YAML Frontmatter).
- **Uso**: `lmagent validate [skill-name]`

### `lmagent create-skill`
- **Descripción**: Wizard interactivo para crear un nuevo Skill desde cero.

---

## ⚡ **Triggers (Chat Interface)**
Estos no son comandos de terminal, son comandos para el LLM en el chat.

| Trigger | Skill |
|:---|:---|
| `/orch` | Orchestrator (Triage) |
| `/pm` | Product Manager |
| `/dev` | Backend Engineer |
| `/front` | Frontend Engineer |
| `/fix` | Debugger |
| `/arch` | Architect |

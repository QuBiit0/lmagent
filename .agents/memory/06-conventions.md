# 📐 Conventions & Standards
> **Update Frequency:** When establishing new conventions or changing existing ones.

> [!IMPORTANT]
> Define convenciones universales del proyecto. Personaliza las secciones `[LLENAR]`.

---

## 🌐 Idioma
- **Código** (variables/funciones/clases/comentarios en código): 🇬🇧 Inglés
- **Documentación** (README/changelogs) y **Chat con usuario**: 🇪🇸 Español
- **Commits**: 🇬🇧 Inglés (Conventional Commits)
- **Nombres de archivos**: 🇬🇧 Inglés (kebab-case)

---

## 📁 Naming Conventions

### Archivos y Directorios
- **Generales / Configs**: `kebab-case` (`user-service.py`, `tsconfig.json`)
- **UI Components**: `PascalCase` (`UserProfile.tsx`)
- **CSS/SCSS**: `kebab-case` o BEM (`.user-card__title`)
- **Tests**: `*.test.*` o `*.spec.*`

### Código
- **Variables / Funciones**: `camelCase` en JS/TS (`getUser`), `snake_case` en Python (`get_user`).
- **Constantes / Env Vars**: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`, `DATABASE_URL`).
- **Clases / Interfaces / Enums**: `PascalCase` (`UserService`, `AuthResponse`). Sin prefijo `I`.
- **Booleanos (Env)**: String explicitos (`ENABLE_LOGS=true`).

---

## 🏗️ Estructura de Proyecto
**Patrón**: Contenedores Separados. Separar `frontend/`, `backend/`, `database/` y orquestar con `docker-compose.yml`. No usar monolitos a menos que sea mandatario.

---

## 📝 Documentación
- **Públicas**: Docstring/JSDoc obligatorio.
- **Hacks / TODOs**: `// TODO: [autor] - [desc]`, `// HACK: [motivo]`.
- **Archivos Nativos**: `README.md` y `.env.example` obligatorios.

---

## 🔐 Seguridad
1. **Nunca** commitear `.env`.
2. **Siempre** usar OS env getters con fallback seguro.
3. **Nunca** imprimir logs con Secrets o PII (Personal Identifiable Information).

---

## 🎨 Estilo y Formato (Herramientas Core)
- **Linter**: [LLENAR: ej. ESLint / Ruff]
- **Formatter**: [LLENAR: ej. Prettier]
- **Type Check**: [LLENAR: ej. TS strict / mypy]
- **Pre-commit**: [LLENAR: ej. Husky]

# 🐙 Git Flow & Versioning Rules
> **Tipo**: `rule` | **Versión**: 3.6.0 | **Actualización**: 2026-03

## 📌 Quick Reference

| Principio | Regla |
|-----------|-------|
| **Branches** | `main` (prod), `dev` (staging), `feat/*`, `fix/*` |
| **Commits** | Conventional Commits: `type(scope): description` |
| **Versioning** | SemVer: `MAJOR.MINOR.PATCH` |
| **PRs** | Siempre requieren review. Nunca push directo a `main`. |
| **Tags** | Crear tag al hacer release: `vX.Y.Z` |

### 👥 Roles que usan esta regla
`git-workflow`, `backend-engineer`, `frontend-engineer`, `devops-engineer`, `tech-lead`

---

> ⚠️ **FLEXIBILIDAD DE WORKFLOWS**: Las estrategias aquí detalladas (ej. Git Flow tradicional) son **ejemplos de referencia**. El agente puede recomendar y aplicar estrategias más modernas (ej. Trunk-based development) si la agilidad del equipo o del proyecto lo justifican.

## 🌿 Branching Strategy

### Git Flow (Default)
- **main**: Producción (Stable). Tags `vX.Y.Z`.
- **dev**: Integración (Beta). Deploy a Staging.
- **feat/nombre-feature**: Desarrollo de features.
- **fix/nombre-bug**: Hotfixes.
- **release/vX.Y.Z**: Preparación de releases (opcional).

### 🚄 Alternativa Ágil: Trunk-Based Development
Para equipos que dominan CI/CD continuo o proyectos experimentales:
- Commits atómicos directamente a `main` (o ramas de muy corta vida < 1 día).
- Se oculta el trabajo no completado tras **Feature Flags**.
- Ideal para equipos < 5 devs con CI/CD maduro.

---

## 💬 Commit Messages (Conventional Commits)

### Formato
```
type(scope): description

[optional body]

[optional footer(s)]
```

### Tipos Permitidos
| Tipo | Uso |
|:---|:---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Cambios en documentación |
| `style` | Formateo, espacios (no cambia lógica) |
| `refactor` | Refactorización de código |
| `test` | Añadir o corregir tests |
| `chore` | Tareas de build, deps, configs |
| `perf` | Mejora de performance |
| `ci` | Cambios en CI/CD |
| `revert` | Revertir un commit anterior |

### Ejemplos

```bash
# ✅ Buenos commits
feat(auth): implement JWT login endpoint
fix(api): handle null values in user search
docs(readme): add deployment instructions
refactor(db): extract query builder to separate module
test(auth): add integration tests for password reset

# ❌ Malos commits
"fix stuff"
"wip"
"update"
"asdf"
```

### Breaking Changes
```bash
feat(api)!: change authentication to OAuth2

BREAKING CHANGE: JWT tokens are no longer accepted.
Migrate to OAuth2 flow using /auth/oauth2/token endpoint.
```

---

## 🏷️ Versioning (SemVer)

| Cambio | Tipo | Ejemplo |
|:---|:---|:---|
| API incompatible | **Major** (X.0.0) | `2.0.0` → Nuevo auth system |
| Feature backward-compatible | **Minor** (0.Y.0) | `1.3.0` → Nuevo endpoint |
| Bug fix backward-compatible | **Patch** (0.0.Z) | `1.3.1` → Fix en validación |

---

## 🔀 Pull Request Standards

### Template Recomendado

```markdown
## Descripción
[Qué cambia y por qué]

## Tipo de Cambio
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Tests agregados/actualizados
- [ ] Linting pasa sin errores
- [ ] Documentación actualizada
- [ ] No hay secretos hardcodeados
- [ ] Self-review completado

## Screenshots (si aplica)
[Capturas de UI]
```

### Reglas de Merge
1. **Requiere al menos 1 review** aprobado.
2. **CI debe pasar** (tests, lint, build).
3. **Squash merge** preferido para mantener historial limpio.
4. **Borrar rama** después del merge.

---

## 🛡️ Protección de Ramas

### `main` (Producción)
- ❌ No push directo
- ✅ Solo merge via PR aprobado
- ✅ CI debe pasar
- ✅ Al menos 1 reviewer

### `dev` (Staging)
- ❌ No push directo (recomendado)
- ✅ PRs con CI passing

---

## 🚀 Release Process

1. Test en `dev` → Todo verde.
2. Crear branch `release/vX.Y.Z` (opcional en Trunk-Based).
3. PR `release/*` → `main` (o `dev` → `main`).
4. Validar CI/CD completo.
5. Merge y crear tag: `git tag vX.Y.Z`.
6. Push tag: `git push origin vX.Y.Z`.
7. Actualizar `CHANGELOG.md`.
8. Crear Release en GitHub con notas.

---

## 🤖 Pre-Commit Agent Verification

Como Inteligencia Artificial o Sub-agente, **NUNCA** dispares un commit a ciegas sin antes:

1. **Verificar estado**: `git status` — confirmar qué archivos cambiaron.
2. **Revisar diff**: `git diff` — leer explícitamente los cambios.
3. **Ejecutar tests**: Confirmar que la suite no se rompió.
4. **Lint check**: Ejecutar linter para detectar problemas de estilo.
5. **Buscar secretos**: Verificar que no hay credenciales en el diff.

```bash
# Checklist pre-commit del agente
git status
git diff --stat
# Ejecutar tests del proyecto
# Ejecutar linter del proyecto
```

---

## ✅ Checklist de Git

```markdown
## Antes de Commit
- [ ] `git diff` revisado (sin cambios accidentales)
- [ ] Mensaje de commit sigue Conventional Commits
- [ ] Tests pasan localmente
- [ ] Linter sin errores
- [ ] Sin secretos en código

## Antes de Merge
- [ ] PR tiene al menos 1 review aprobado
- [ ] CI/CD verde
- [ ] Branch actualizada con target (rebase o merge)
- [ ] Conflictos resueltos

## Después de Release
- [ ] Tag creado y pusheado
- [ ] CHANGELOG actualizado
- [ ] Release notes en GitHub
```

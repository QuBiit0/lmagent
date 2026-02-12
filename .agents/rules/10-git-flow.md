# Git Flow & Version Control - LMAgent

> **Tipo**: `rule` | **Versión**: 3.0.0 | **Actualización**: 2026-02

## 📌 Quick Reference

| Concepto | Convención |
|----------|------------|
| **Rama Principal** | `main` (protegida) |
| **Rama Desarrollo** | `dev` (integración) |
| **Feature Branch** | `feat/nombre-feature` |
| **Fix Branch** | `fix/nombre-bug` |
| **Commits** | `type(scope): descripción` (Conventional Commits) |
| **PRs** | Título descriptivo + Link a issue/task |

### 👥 Roles que usan esta regla
`todos`

---

## Estrategia de Ramas

Usamos una variante simplificada de **Git Flow**:

1. **`main`**: Producción estable. Solo recibe merges de release tags.
2. **`dev`**: Rama de integración principal. Todo desarrollo se une aquí.
3. **`feat/...`**: Nuevas funcionalidades. Salen de `dev`, vuelven a `dev`.
4. **`fix/...`**: Corrección de bugs. Salen de `dev`, vuelven a `dev`.
5. **`hotfix/...`**: Bugs críticos en producción. Salen de `main`, vuelven a `main` y `dev`.

### Naming Conventions

- `feat/user-auth`
- `fix/login-error`
- `chore/update-deps`
- `docs/update-readme`
- `refactor/api-structure`

---

## Conventional Commits

Es **OBLIGATORIO** usar [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Tipos Permitidos

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| **feat** | Nueva funcionalidad | `feat(auth): implement jwt logic` |
| **fix** | Corrección de bug | `fix(api): handle 404 errors` |
| **refactor** | Cambio de código sin feat/fix | `refactor(db): optimize query` |
| **docs** | Solo documentación | `docs: update install guide` |
| **test** | Tests unitarios/e2e | `test(user): add login tests` |
| **chore** | Build, deps, herramientas | `chore: update packages` |
| **perf** | Mejora de rendimiento | `perf(img): compress assets` |
| **ci** | CI/CD changes | `ci: fix github action` |

### Reglas de Mensajes

1. **Imperativo**: "add feature" no "added feature"
2. **Minúsculas**: "feat: ..." no "Feat: ..."
3. **Sin punto final**: "fix: bug" no "fix: bug."
4. **Scope opcional**: El scope es el módulo afectado (api, ui, db, deps).

---

## Pull Requests (PRs)

### Checklist para PRs

- [ ] Título sigue Conventional Commits (`feat: ...`)
- [ ] Descripción explica EL POR QUÉ del cambio
- [ ] Tests pasan en local
- [ ] Linting pasa en local
- [ ] No hay conflictos con `dev`
- [ ] Review de al menos 1 peer (para merges a `dev`)

### Proceso de Merge

1. **Squash & Merge** (Recomendado): Mantiene history lineal.
2. **Rebase & Merge**: Si se necesita mantener commits individuales.
3. **Merge Commit**: Evitar salvo releases.

---

## Buenas Prácticas

### 1. Atomic Commits
Cada commit debe hacer una sola cosa y el proyecto debe compilar/funcionar en cada commit.

❌ **Mal**: "Fix bugs and add login and update readme"
✅ **Bien**: 
- `fix(auth): resolve token error`
- `feat(ui): add login form`
- `docs: update readme`

### 2. No Secrets
NUNCA commitear `.env` files, claves privadas, o credenciales.
Usar `.gitignore` estricto.

### 3. Sync Frecuente
Hacer `git pull origin dev` frecuentemente en tu feature branch para evitar conflictos masivos al final.

---

## ✅ Checklist de Validación (Antes de Push)

- [ ] ¿Estoy en la rama correcta? (`git branch`)
- [ ] ¿He corrido los tests?
- [ ] ¿El mensaje de commit sigue el estándar?
- [ ] ¿No he dejado `console.log` o código muerto?
- [ ] ¿He revisado mis propios cambios (`git diff`)?

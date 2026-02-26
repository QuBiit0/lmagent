# 🐙 Git Flow & Versioning Rules
> **Tipo**: `rule` | **Versión**: 3.0.0 | **Referencia**: `git-workflow`

## 🌿 Branching Strategy

> ⚠️ **FLEXIBILIDAD DE WORKFLOWS**: Las estrategias aquí detalladas (ej. Git Flow tradicional) son **ejemplos de referencia**. El agente puede recomendar y aplicar estrategias más modernas (ej. Trunk-based development) si la agilidad del equipo o del proyecto lo justifican.
- **main**: Producción (Stable). Tags `vX.Y.Z`.
- **dev**: Integración (Beta). Deploy a Staging.
- **feat/nombre-feature**: Desarrollo de features.
- **fix/nombre-bug**: Hotfixes.

## 💬 Commit Messages (Conventional Commits)
Formato: `type(scope): description`

- `feat`: Nueva funcionalidad.
- `fix`: Corrección de bug.
- `docs`: Cambios en documentación.
- `style`: Formateo, espacios (no cambia lógica).
- `refactor`: Refactorización de código.
- `test`: Añadir o corregir tests.
- `chore`: Tareas de build, deps, configs.

**Ejemplo:**
`feat(auth): implement JWT login endpoint`

## 🏷️ Versioning (SemVer)
- **Major (X.0.0)**: Breaking changes.
- **Minor (0.Y.0)**: Features backward-compatible.
- **Patch (0.0.Z)**: Bug fixes backward-compatible.

## 🚀 Release Process
1. Test en `dev`.
2. PR `dev` -> `main`.
3. Validar CI/CD.
4. Tag release (`git tag v1.0.0`).
5. Push tag (`git push origin v1.0.0`).

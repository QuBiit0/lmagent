# Contributing directly to LMAgent

¡Gracias por tu interés en contribuir a LMAgent! 🚀

Este documento define el proceso para contribuir código, documentación o reportar issues.

## Código de Conducta

Este proyecto se rige por un Código de Conducta estándar. Al participar, se espera que mantengas un ambiente respetuoso y colaborativo.

## ¿Cómo Contribuir?

### 1. Reportar Bugs
- Abre un Issue en GitHub.
- Usa el template de **Bug Report**.
- Incluye pasos para reproducir, logs y screenshots.

### 2. Sugerir Features
- Abre un Issue en GitHub con la etiqueta `enhancement`.
- Explica el "por qué" y el caso de uso.
- Si es posible, describe la solución técnica propuesta.

### 3. Pull Requests (PRs)

#### Proceso
1. Haz un Fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/mi-nueva-feature`
3. Implementa tus cambios siguiendo las reglas del proyecto.
4. Asegúrate de pasar todos los tests: `pytest`
5. Haz commit con mensajes descriptivos: `feat: agrega soporte para anthropic`
6. Push a tu rama: `git push origin feature/mi-nueva-feature`
7. Abre un Pull Request hacia `main`.

#### Checklist para PRs
- [ ] ¿Actualizaste la documentación?
- [ ] ¿Agregaste tests para tu código?
- [ ] ¿Pasaste el linter (`ruff check .`)?
- [ ] ¿Cumple con las reglas en `rules/`?

## Estilo de Código

Respetamos estrictamente:
- **Python**: PEP 8, Type Hints (mypy strict), Ruff para linting/formatting.
- **Commit Messages**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc).
- **Documentación**: Markdown claro y conciso.

## Estructura del Proyecto

- `agents/`: Código fuente del runtime y CLI.
- `personas/`: Definiciones de roles (.md).
- `workflows/`: Definiciones de flujos (.md).
- `rules/`: Reglas del sistema (.md).
- `config/`: Archivos YAML de configuración.

## Desarrollo Local

```bash
# Instalar dependencias de desarrollo
pip install -e ".[dev]"

# Correr tests
pytest

# Correr linter
ruff check .
```

¡Gracias por ayudar a hacer LMAgent mejor!

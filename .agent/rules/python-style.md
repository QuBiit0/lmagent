---
description: Reglas de estilo de código para archivos Python
activation: glob
glob: "**/*.py"
---

# Estilo de Código Python

## Formato
- Usar `ruff` para linting y formato
- Line length: 100 caracteres
- Indent: 4 espacios

## Imports
```python
# Orden:
# 1. Standard library
# 2. Third party
# 3. Local

from __future__ import annotations

import os
from typing import Optional

import httpx
from fastapi import FastAPI

from app.core import config
```

## Type Hints
- Siempre usar type hints en funciones públicas
- Usar `from __future__ import annotations` para forward references

## Docstrings
```python
def function(param: str) -> bool:
    """
    Breve descripción.
    
    Args:
        param: Descripción del parámetro
        
    Returns:
        Descripción del retorno
    """
```

## Async
- Preferir `async def` para I/O-bound operations
- Usar `httpx` para HTTP async
- Usar `asyncpg` para PostgreSQL async

## Tests
- Ubicar en `tests/` mirror de `src/`
- Naming: `test_*.py`
- Usar `pytest` con fixtures

Para detalles completos ver `@/rules/code-style.md`

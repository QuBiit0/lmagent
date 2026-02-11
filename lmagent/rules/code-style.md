# Guía de Estilo de Código - LMAgent

> **Tipo**: `rule` | **Versión**: 2.1 | **Actualización**: 2026-01

## 📌 Quick Reference

| Regla | Python | TypeScript |
|-------|--------|------------|
| **Naming** | `snake_case` funciones/vars, `PascalCase` clases | `camelCase` funciones/vars, `PascalCase` clases |
| **Indentación** | 4 espacios | 2 espacios |
| **Línea máx** | 88 chars | 100 chars |
| **Types** | OBLIGATORIO (type hints) | OBLIGATORIO (strict TS) |
| **Lint** | `ruff check .` + `ruff format .` | `eslint .` + `prettier` |
| **Imports** | Stdlib → Third-party → Local | Built-in → External → Internal |

### 👥 Roles que usan esta regla
`backend-engineer`, `frontend-engineer`, `mobile-engineer`, `qa-engineer`

---

Este documento define las convenciones de estilo para Python y TypeScript.

## Python

### Herramientas
```bash
# Linting y formatting
ruff check .      # Linting
ruff format .     # Formatting (reemplaza black)

# Type checking (opcional pero recomendado)
mypy app/
```

### Configuración (pyproject.toml)
```toml
[tool.ruff]
target-version = "py311"
line-length = 88
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # Pyflakes
    "I",    # isort
    "B",    # flake8-bugbear
    "C4",   # flake8-comprehensions
    "UP",   # pyupgrade
]
ignore = [
    "E501",  # line too long (handled by formatter)
]

[tool.ruff.isort]
known-first-party = ["app"]
```

### Imports

```python
# ✅ Correcto - Agrupados y ordenados
from __future__ import annotations

# Standard library
import json
from datetime import datetime
from typing import Optional, List

# Third party
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

# Local
from app.config import settings
from app.core.database import get_session
from app.models.user import User

# ❌ Incorrecto
from app.models.user import *  # No usar import *
import json, os, sys  # No múltiples en una línea
```

### Naming Conventions

```python
# Módulos y archivos: snake_case
user_service.py
database_utils.py

# Clases: PascalCase
class UserService:
    pass

class HTTPRequestHandler:  # Acronyms en mayúsculas
    pass

# Funciones y métodos: snake_case
def get_user_by_email(email: str) -> User:
    pass

async def fetch_external_data():
    pass

# Variables: snake_case
user_count = 0
is_active = True
api_response = {}

# Constantes: UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3
DEFAULT_TIMEOUT = 30
API_VERSION = "v1"

# Privados: prefijo _
def _internal_helper():
    pass

class MyClass:
    def __init__(self):
        self._private_attr = None
```

### Type Hints (Obligatorios)

```python
# ✅ Correcto - Type hints en todo
from typing import Optional, List, Dict, Any

def process_user(
    user_id: int,
    options: Optional[Dict[str, Any]] = None
) -> User:
    """Procesa un usuario por ID."""
    pass

async def fetch_users(
    limit: int = 10,
    offset: int = 0
) -> List[User]:
    """Obtiene lista de usuarios paginada."""
    pass

# Variables con tipos cuando no es obvio
users: List[User] = []
config: Dict[str, Any] = load_config()

# ❌ Incorrecto - Sin types
def process_user(user_id, options=None):
    pass
```

### Docstrings

```python
def calculate_discount(
    price: float,
    discount_percent: float,
    max_discount: Optional[float] = None
) -> float:
    """
    Calcula el precio con descuento aplicado.
    
    Args:
        price: Precio original del producto.
        discount_percent: Porcentaje de descuento (0-100).
        max_discount: Descuento máximo permitido en valor absoluto.
    
    Returns:
        Precio final después de aplicar el descuento.
    
    Raises:
        ValueError: Si discount_percent está fuera de rango (0-100).
    
    Example:
        >>> calculate_discount(100.0, 20.0)
        80.0
        >>> calculate_discount(100.0, 50.0, max_discount=30.0)
        70.0
    """
    if not 0 <= discount_percent <= 100:
        raise ValueError("discount_percent must be between 0 and 100")
    
    discount = price * (discount_percent / 100)
    if max_discount is not None:
        discount = min(discount, max_discount)
    
    return price - discount


class UserService:
    """
    Servicio para gestión de usuarios.
    
    Maneja la lógica de negocio relacionada con usuarios,
    incluyendo creación, actualización y validaciones.
    
    Attributes:
        repository: Repositorio para acceso a datos de usuarios.
        cache: Cliente de cache para optimización.
    
    Example:
        >>> service = UserService(repository, cache)
        >>> user = await service.create({"email": "test@example.com"})
    """
```

### Clases y Métodos

```python
from abc import ABC, abstractmethod
from typing import Optional

class BaseService(ABC):
    """Clase base para servicios."""
    
    def __init__(self, repository: BaseRepository):
        self.repository = repository
        self._cache: Dict[str, Any] = {}
    
    @abstractmethod
    async def get_by_id(self, id: int) -> Optional[Model]:
        """Obtiene entidad por ID."""
        pass
    
    async def get_all(self, limit: int = 100) -> List[Model]:
        """Obtiene todas las entidades."""
        return await self.repository.find_all(limit=limit)


class UserService(BaseService):
    """Servicio de usuarios."""
    
    async def get_by_id(self, id: int) -> Optional[User]:
        """Obtiene usuario por ID."""
        # Intentar cache primero
        cache_key = f"user:{id}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        user = await self.repository.find_by_id(id)
        if user:
            self._cache[cache_key] = user
        
        return user
    
    async def create(self, data: UserCreate) -> User:
        """Crea un nuevo usuario."""
        # Validar
        self._validate_email(data.email)
        
        # Crear
        user = await self.repository.create(data)
        
        # Invalidar cache
        self._cache.clear()
        
        return user
    
    def _validate_email(self, email: str) -> None:
        """Valida formato de email."""
        if "@" not in email:
            raise ValueError("Invalid email format")
```

### Async/Await

```python
# ✅ Correcto - Consistente uso de async
async def fetch_user_data(user_id: int) -> UserData:
    """Obtiene datos completos del usuario."""
    # Ejecutar en paralelo cuando sea posible
    user, orders, preferences = await asyncio.gather(
        get_user(user_id),
        get_orders(user_id),
        get_preferences(user_id)
    )
    
    return UserData(user=user, orders=orders, preferences=preferences)

# ❌ Incorrecto - Blocking en código async
async def bad_fetch():
    import requests  # Blocking!
    response = requests.get(url)  # Bloquea el event loop
```

### Manejo de Errores

```python
# Definir excepciones específicas
class ServiceError(Exception):
    """Error base para servicios."""
    pass

class NotFoundError(ServiceError):
    """Recurso no encontrado."""
    pass

class ValidationError(ServiceError):
    """Error de validación."""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

# Uso
async def get_user(user_id: int) -> User:
    user = await repository.find_by_id(user_id)
    if not user:
        raise NotFoundError(f"User {user_id} not found")
    return user

# En routers, convertir a HTTPException
@router.get("/users/{user_id}")
async def get_user_endpoint(user_id: int):
    try:
        return await service.get_user(user_id)
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

---

## TypeScript

### Herramientas
```bash
# Linting y formatting
eslint .
prettier --write .

# Type checking
tsc --noEmit
```

### Configuración (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Naming Conventions

```typescript
// Archivos: kebab-case
user-service.ts
database-utils.ts

// Interfaces: PascalCase con prefijo I (opcional)
interface User {
  id: number;
  email: string;
}

interface IUserService {  // Prefijo I para interfaces de servicio
  getUser(id: number): Promise<User>;
}

// Types: PascalCase
type UserId = number;
type UserRole = 'admin' | 'user' | 'guest';

// Clases: PascalCase
class UserService implements IUserService {
  // ...
}

// Funciones y métodos: camelCase
function getUserById(id: number): Promise<User> {
  // ...
}

// Variables: camelCase
const userCount = 0;
const isActive = true;

// Constantes: UPPER_SNAKE_CASE o camelCase
const MAX_RETRY_COUNT = 3;
const defaultTimeout = 30;

// Enums: PascalCase para nombre y valores
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}
```

### Types (Obligatorios)

```typescript
// ✅ Correcto - Types explícitos
interface CreateUserDto {
  email: string;
  name: string;
  role?: UserRole;
}

interface UserResponse {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

async function createUser(data: CreateUserDto): Promise<UserResponse> {
  // ...
}

// Usar generics cuando sea apropiado
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

class UserRepository implements Repository<User> {
  // ...
}

// ❌ Incorrecto - Usar any
function processData(data: any): any {
  // Evitar any, usar unknown si es necesario
}
```

### Imports

```typescript
// ✅ Correcto - Organizados
// Node built-ins
import { readFile } from 'fs/promises';
import path from 'path';

// External packages
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

// Internal - absolute imports
import { UserService } from '@/services/user-service';
import { User } from '@/models/user';

// Internal - relative imports
import { validateEmail } from './utils';
```

### Error Handling

```typescript
// Custom errors
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

class ValidationError extends AppError {
  constructor(
    public field: string,
    message: string
  ) {
    super(400, `${field}: ${message}`);
  }
}

// Uso
async function getUser(id: number): Promise<User> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
}

// Error handler middleware
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## Reglas Comunes

### Comentarios

```python
# ✅ Comentarios que explican POR QUÉ, no QUÉ
# Usamos cache de 5 minutos porque los datos de usuario
# cambian con poca frecuencia pero se consultan mucho
CACHE_TTL = 300

# ❌ Comentarios innecesarios
# Incrementar contador
counter += 1  # Increment counter
```

### TODO y FIXME

```python
# TODO: Implementar paginación cuando tengamos más de 1000 usuarios
# FIXME: Este workaround es necesario por bug en librería X, remover en v2.0
# HACK: Solución temporal hasta que se resuelva issue #123
```

### Longitud de Línea
- Máximo: 88 caracteres (Python), 100 caracteres (TypeScript)
- Preferir líneas más cortas cuando sea posible

### Espaciado
- 4 espacios para indentación (Python)
- 2 espacios para indentación (TypeScript)
- Una línea en blanco entre funciones/métodos
- Dos líneas en blanco entre clases

---

## ✅ Checklist de Validación (Antes de PR)

### Python
- [ ] `ruff check .` pasa sin errores
- [ ] `ruff format --check .` pasa
- [ ] Type hints en todas las funciones públicas
- [ ] Docstrings en funciones públicas
- [ ] Imports ordenados (stdlib → 3rd party → local)

### TypeScript
- [ ] `eslint .` pasa sin errores
- [ ] `prettier --check .` pasa
- [ ] `tsc --noEmit` sin errores de tipos
- [ ] Sin uso de `any`
- [ ] Imports ordenados

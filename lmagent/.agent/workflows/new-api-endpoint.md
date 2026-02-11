---
description: Workflow para agregar un nuevo endpoint/API
---

# New API Endpoint Workflow

Usa este workflow para agregar un nuevo endpoint REST.

## 1. Definir el Endpoint

- **Método**: GET | POST | PUT | DELETE
- **Path**: /api/v1/{resource}
- **Request body**: (si aplica)
- **Response**: Estructura esperada

## 2. Crear el Esquema (Pydantic/Zod)

### Python (FastAPI)
```python
# schemas/{resource}.py
from pydantic import BaseModel

class ResourceCreate(BaseModel):
    name: str
    description: str | None = None

class ResourceResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
```

### TypeScript (NestJS)
```typescript
// dto/{resource}.dto.ts
export class CreateResourceDto {
  @IsString()
  name: string;
  
  @IsOptional()
  description?: string;
}
```

## 3. Crear el Servicio

```python
# services/{resource}_service.py
class ResourceService:
    async def create(self, data: ResourceCreate) -> Resource:
        # Implementar lógica
        pass
```

## 4. Crear el Endpoint

```python
# routes/{resource}.py
@router.post("/", response_model=ResourceResponse)
async def create_resource(data: ResourceCreate):
    return await service.create(data)
```

## 5. Agregar Tests

```python
# tests/test_{resource}.py
async def test_create_resource(client):
    response = await client.post("/api/v1/resources", json={...})
    assert response.status_code == 201
```

## 6. Documentar

- [ ] OpenAPI schema generado
- [ ] README actualizado (si es público)

## Checklist Final

- [ ] Schema definido
- [ ] Servicio implementado
- [ ] Endpoint creado
- [ ] Tests escritos
- [ ] Linter pasando
- [ ] Tests pasando

Para más detalles ver `@/personas/backend-engineer.md`

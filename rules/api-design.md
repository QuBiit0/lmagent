# LMAgent API Design Rules

Este documento define las reglas para diseño de APIs REST.

## 🎯 Principios

1. **Consistency**: Mismos patrones en todos los endpoints
2. **Predictability**: Comportamiento esperado
3. **Developer Experience**: Fácil de usar y documentar
4. **Backward Compatibility**: No romper clientes existentes

---

## URL Structure

### Recursos

```
# ✅ BUENO: Sustantivos en plural
GET    /api/v1/users
GET    /api/v1/users/{id}
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

# ❌ MALO: Verbos en URL
GET    /api/v1/getUsers
POST   /api/v1/createUser
```

### Recursos Anidados

```
# Relaciones
GET /api/v1/users/{id}/orders          # Órdenes de un usuario
GET /api/v1/orders/{id}/items          # Items de una orden

# Límite: máximo 2 niveles de anidación
# ❌ MALO
GET /api/v1/users/{id}/orders/{oid}/items/{iid}/reviews
```

### Query Parameters

```
# Filtrado
GET /api/v1/users?status=active&role=admin

# Paginación
GET /api/v1/users?page=1&limit=20

# Ordenamiento
GET /api/v1/users?sort=created_at&order=desc

# Búsqueda
GET /api/v1/users?search=john
```

---

## HTTP Methods

| Método | Uso | Idempotente |
|--------|-----|-------------|
| GET | Obtener recursos | Sí |
| POST | Crear recurso | No |
| PUT | Reemplazar recurso | Sí |
| PATCH | Actualizar parcial | No* |
| DELETE | Eliminar recurso | Sí |

---

## Status Codes

### Success (2xx)

| Code | Uso |
|------|-----|
| 200 | OK - GET, PUT, PATCH exitoso |
| 201 | Created - POST exitoso |
| 204 | No Content - DELETE exitoso |

### Client Errors (4xx)

| Code | Uso |
|------|-----|
| 400 | Bad Request - Input inválido |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permiso |
| 404 | Not Found - Recurso no existe |
| 409 | Conflict - Conflicto (ej: duplicate) |
| 422 | Unprocessable - Validación falló |
| 429 | Too Many Requests - Rate limit |

### Server Errors (5xx)

| Code | Uso |
|------|-----|
| 500 | Internal Server Error |
| 502 | Bad Gateway |
| 503 | Service Unavailable |

---

## Response Format

### Success Response

```json
{
  "data": {
    "id": "uuid",
    "name": "Example",
    "createdAt": "2024-01-21T00:00:00Z"
  }
}

// Lista con paginación
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

## Naming Conventions

### JSON Fields

```json
// ✅ BUENO: camelCase
{
  "userId": "123",
  "createdAt": "2024-01-21",
  "isActive": true
}

// ❌ MALO: snake_case (a menos que sea estándar del proyecto)
{
  "user_id": "123"
}
```

### Consistencia de Nombres

```
# Singular para un recurso
GET /users/123 → { "user": {...} }

# Plural para colecciones
GET /users → { "users": [...] }
```

---

## Versionado

### URL Versioning (Recomendado)

```
/api/v1/users
/api/v2/users
```

### Header Versioning (Alternativa)

```
Accept: application/vnd.api+json; version=1
```

---

## Paginación

### Offset-based

```json
GET /users?page=2&limit=20

{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Cursor-based (para grandes datasets)

```json
GET /users?cursor=eyJpZCI6MTAwfQ&limit=20

{
  "data": [...],
  "meta": {
    "nextCursor": "eyJpZCI6MTIwfQ",
    "hasMore": true
  }
}
```

---

## Filtrado y Búsqueda

```
# Filtros exactos
GET /users?status=active

# Filtros con operadores
GET /users?age[gte]=18&age[lte]=65

# Búsqueda full-text
GET /users?q=john

# Campos específicos
GET /users?fields=id,name,email
```

---

## HATEOAS (Opcional)

```json
{
  "data": {
    "id": "123",
    "name": "Order"
  },
  "links": {
    "self": "/orders/123",
    "items": "/orders/123/items",
    "customer": "/users/456"
  }
}
```

---

## Rate Limiting

### Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705795200
```

### Respuesta 429

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

---

## Checklist de API Design

```markdown
## Nuevo Endpoint
- [ ] URL sigue convención de recursos
- [ ] Método HTTP correcto
- [ ] Status codes apropiados
- [ ] Request validado
- [ ] Response consistente
- [ ] Documentación OpenAPI
- [ ] Tests escritos

## Breaking Changes
- [ ] Nueva versión de API
- [ ] Deprecation notice
- [ ] Migration guide
- [ ] Timeline de sunset
```

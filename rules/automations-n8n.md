# Reglas para Integraciones con n8n - LMAgent

Este documento define las mejores prácticas para diseñar APIs y webhooks pensando en n8n.

## Principios de Diseño

### 1. n8n-First API Design
Cuando diseñes endpoints que serán consumidos por n8n:

- **Respuestas predecibles**: Siempre la misma estructura
- **Payloads estables**: No cambiar campos sin versionar
- **Documentación clara**: Ejemplos de JSON in/out
- **Errores útiles**: Mensajes que n8n pueda procesar

### 2. Arquitectura de Integración
```
┌─────────────────────────────────────────────────────────────────┐
│                         n8n Workflow                            │
└───────┬───────────────────────────────────────┬─────────────────┘
        │                                       │
        ▼                                       ▼
┌───────────────┐                     ┌───────────────┐
│   Webhook     │                     │  HTTP Request │
│   Trigger     │                     │    Node       │
└───────┬───────┘                     └───────┬───────┘
        │                                       │
        ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (FastAPI/Express)              │
│                                                                 │
│  POST /webhooks/event-name     GET /api/v1/resource            │
│  - Recibe eventos de n8n       - Devuelve datos para n8n       │
│  - Procesa en background       - Paginación, filtros           │
│  - Retorna confirmación        - Formato consistente           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diseño de Webhooks

### Estructura de Endpoint
```python
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from uuid import uuid4

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

# =====================================
# Schemas Estándar
# =====================================

class WebhookPayload(BaseModel):
    """Payload estándar que n8n debe enviar."""
    event_type: str = Field(..., description="Tipo de evento, ej: order.created")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: dict = Field(..., description="Datos del evento")
    metadata: dict = Field(default_factory=dict, description="Metadatos opcionales")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "event_type": "order.created",
                "timestamp": "2024-01-15T10:30:00Z",
                "data": {
                    "order_id": "12345",
                    "customer_email": "customer@example.com",
                    "total": 99.99
                },
                "metadata": {
                    "source": "n8n",
                    "workflow_id": "abc123"
                }
            }
        }
    }

class WebhookResponse(BaseModel):
    """Respuesta estándar para n8n."""
    success: bool
    message: str
    request_id: str = Field(description="ID único para tracking")
    processed_at: datetime
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "message": "Event queued for processing",
                "request_id": "550e8400-e29b-41d4-a716-446655440000",
                "processed_at": "2024-01-15T10:30:01Z"
            }
        }
    }

class WebhookError(BaseModel):
    """Error estándar para n8n."""
    success: bool = False
    error: str
    error_code: str
    details: dict = {}
```

### Implementación de Webhook
```python
@router.post(
    "/order-created",
    response_model=WebhookResponse,
    responses={
        400: {"model": WebhookError, "description": "Invalid payload"},
        500: {"model": WebhookError, "description": "Processing error"}
    }
)
async def handle_order_created(
    payload: WebhookPayload,
    background_tasks: BackgroundTasks
) -> WebhookResponse:
    """
    Webhook para procesar órdenes creadas.
    
    ## Uso en n8n
    
    1. Agregar nodo **HTTP Request**
    2. **Method**: POST
    3. **URL**: `{{$env.BACKEND_URL}}/webhooks/order-created`
    4. **Headers**: 
       - Content-Type: application/json
       - X-API-Key: {{$env.API_KEY}} (si se requiere auth)
    5. **Body**: JSON
    
    ## Ejemplo de Body
    ```json
    {
        "event_type": "order.created",
        "data": {
            "order_id": "{{ $json.order_id }}",
            "customer_email": "{{ $json.email }}",
            "total": {{ $json.total }}
        }
    }
    ```
    
    ## Flujo de Procesamiento
    
    1. Se valida el payload
    2. Se encola para procesamiento async
    3. Se retorna inmediatamente con request_id
    4. El procesamiento ocurre en background
    
    ## Para verificar estado
    
    GET /webhooks/status/{request_id}
    """
    request_id = str(uuid4())
    
    # Validar evento
    if payload.event_type != "order.created":
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": f"Expected event_type 'order.created', got '{payload.event_type}'",
                "error_code": "INVALID_EVENT_TYPE"
            }
        )
    
    # Procesar en background para respuesta rápida (< 3s para n8n)
    background_tasks.add_task(
        process_order_async,
        request_id=request_id,
        order_data=payload.data
    )
    
    return WebhookResponse(
        success=True,
        message="Order queued for processing",
        request_id=request_id,
        processed_at=datetime.utcnow()
    )


@router.get("/status/{request_id}")
async def get_webhook_status(request_id: str) -> dict:
    """
    Obtiene el estado de un webhook procesado.
    
    Útil para workflows de n8n que necesitan polling.
    """
    status = await get_processing_status(request_id)
    
    return {
        "request_id": request_id,
        "status": status.state,  # pending, processing, completed, failed
        "result": status.result,
        "error": status.error,
        "completed_at": status.completed_at
    }
```

---

## Diseño de APIs para n8n

### Respuestas Consistentes
```python
from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Respuesta paginada estándar para n8n."""
    items: List[T]
    total: int
    page: int
    page_size: int
    has_more: bool

class APIResponse(BaseModel, Generic[T]):
    """Respuesta API estándar."""
    success: bool = True
    data: T
    message: Optional[str] = None


# Uso
@router.get("/orders", response_model=APIResponse[PaginatedResponse[Order]])
async def list_orders(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    created_after: Optional[datetime] = None
) -> APIResponse[PaginatedResponse[Order]]:
    """
    Lista órdenes con paginación.
    
    ## Uso en n8n
    
    **HTTP Request Node**:
    - Method: GET
    - URL: {{$env.BACKEND_URL}}/api/v1/orders
    - Query Parameters:
      - page: {{$json.page || 1}}
      - page_size: 50
      - status: pending
    
    **Para iterar sobre resultados**:
    Usa el nodo "Split In Batches" después del HTTP Request.
    Accede a items con: {{$json.data.items}}
    """
    orders, total = await order_service.list(
        page=page,
        page_size=page_size,
        status=status,
        created_after=created_after
    )
    
    return APIResponse(
        success=True,
        data=PaginatedResponse(
            items=orders,
            total=total,
            page=page,
            page_size=page_size,
            has_more=(page * page_size) < total
        )
    )
```

### Filtros Flexibles
```python
from enum import Enum
from typing import Optional

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

@router.get("/orders/search")
async def search_orders(
    # Filtros de igualdad
    status: Optional[OrderStatus] = None,
    customer_id: Optional[int] = None,
    
    # Filtros de rango
    min_total: Optional[float] = None,
    max_total: Optional[float] = None,
    created_after: Optional[datetime] = None,
    created_before: Optional[datetime] = None,
    
    # Búsqueda de texto
    search: Optional[str] = None,
    
    # Paginación
    page: int = 1,
    page_size: int = 20,
    
    # Ordenamiento
    sort_by: str = "created_at",
    sort_order: str = "desc"
):
    """
    Búsqueda avanzada de órdenes.
    
    ## Ejemplos de uso en n8n
    
    **Órdenes pendientes de hoy**:
    ```
    /orders/search?status=pending&created_after={{$today}}
    ```
    
    **Órdenes mayores a $100**:
    ```
    /orders/search?min_total=100&sort_by=total&sort_order=desc
    ```
    
    **Buscar por email**:
    ```
    /orders/search?search=customer@example.com
    ```
    """
    pass
```

---

## Documentación para n8n

### Template de Documentación de Endpoint
```markdown
# [Nombre del Endpoint]

## Descripción
[Qué hace este endpoint]

## HTTP Request

| Propiedad | Valor |
|-----------|-------|
| Method | POST/GET/PUT/DELETE |
| URL | `{{$env.BACKEND_URL}}/path/to/endpoint` |
| Content-Type | application/json |
| Auth | API Key / Bearer Token / None |

## Headers

| Header | Valor | Requerido |
|--------|-------|-----------|
| Content-Type | application/json | Sí |
| X-API-Key | {{$env.API_KEY}} | Sí |

## Request Body (para POST/PUT)

```json
{
    "field1": "value",
    "field2": 123,
    "nested": {
        "subfield": "value"
    }
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| field1 | string | Sí | Descripción |
| field2 | number | No | Descripción |

## Response

### Success (200)
```json
{
    "success": true,
    "data": {
        "id": "123",
        "result": "..."
    }
}
```

### Error (400/500)
```json
{
    "success": false,
    "error": "Error message",
    "error_code": "ERROR_CODE"
}
```

## Ejemplo en n8n

![Screenshot del nodo configurado]

### Configuración del nodo HTTP Request:
1. Agregar nodo "HTTP Request"
2. Method: POST
3. URL: `{{$env.BACKEND_URL}}/path`
4. Authentication: Header Auth
5. Header Name: X-API-Key
6. Header Value: {{$env.API_KEY}}
7. Body Content Type: JSON
8. JSON Parameters: 
   ```
   {
       "field1": "{{$json.value}}"
   }
   ```

## Casos de Uso

1. **[Caso 1]**: [Descripción del workflow]
2. **[Caso 2]**: [Descripción del workflow]
```

---

## Patrones de Integración

### 1. Webhook con Callback
```
┌─────────────────────────────────────────────────────────────────┐
│  n8n Workflow                                                   │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────────┐ │
│  │ Trigger  │───▶│ HTTP Req │───▶│  Wait    │───▶│ Callback  │ │
│  │          │    │ (async)  │    │          │    │ Handler   │ │
│  └──────────┘    └──────────┘    └──────────┘    └───────────┘ │
└──────────────────────┬───────────────────────────────┬─────────┘
                       │                               │
                       ▼                               │
┌─────────────────────────────────┐                   │
│  Backend                        │                   │
│                                 │                   │
│  POST /webhooks/process         │                   │
│  - Recibe request               │                   │
│  - Inicia proceso largo         │                   │
│  - Retorna request_id           │                   │
│                                 │                   │
│  (proceso async...)             │                   │
│                                 │                   │
│  POST callback_url              │◀──────────────────┘
│  - Envía resultado a n8n        │
└─────────────────────────────────┘
```

```python
@router.post("/process-with-callback")
async def process_with_callback(
    payload: WebhookPayload,
    callback_url: str,
    background_tasks: BackgroundTasks
):
    """
    Procesa y notifica a n8n cuando termina.
    
    En n8n usar "Wait" node después de este request.
    """
    request_id = str(uuid4())
    
    # Procesar en background y hacer callback
    background_tasks.add_task(
        process_and_callback,
        request_id=request_id,
        data=payload.data,
        callback_url=callback_url
    )
    
    return {"request_id": request_id, "status": "processing"}


async def process_and_callback(
    request_id: str,
    data: dict,
    callback_url: str
):
    """Procesa y notifica resultado."""
    try:
        result = await heavy_processing(data)
        
        async with httpx.AsyncClient() as client:
            await client.post(callback_url, json={
                "request_id": request_id,
                "success": True,
                "result": result
            })
    except Exception as e:
        async with httpx.AsyncClient() as client:
            await client.post(callback_url, json={
                "request_id": request_id,
                "success": False,
                "error": str(e)
            })
```

### 2. Polling Pattern
```python
@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """
    Para n8n, usar con "Wait" + "IF" + loop.
    
    ## Workflow en n8n
    
    1. HTTP Request: POST /jobs (crear job)
    2. Loop Start
    3. Wait: 5 seconds
    4. HTTP Request: GET /jobs/{job_id}
    5. IF: {{$json.status}} == "completed"
       - True: Salir del loop
       - False: Volver a paso 3
    """
    job = await get_job(job_id)
    
    return {
        "job_id": job_id,
        "status": job.status,  # pending, running, completed, failed
        "progress": job.progress,  # 0-100
        "result": job.result if job.status == "completed" else None,
        "error": job.error if job.status == "failed" else None
    }
```

### 3. Batch Processing
```python
@router.post("/batch/process")
async def batch_process(items: List[dict]):
    """
    Procesa múltiples items en una sola llamada.
    
    Útil para n8n cuando se procesan muchos items.
    Más eficiente que llamar endpoint individual N veces.
    """
    results = []
    errors = []
    
    for i, item in enumerate(items):
        try:
            result = await process_item(item)
            results.append({"index": i, "success": True, "data": result})
        except Exception as e:
            errors.append({"index": i, "success": False, "error": str(e)})
    
    return {
        "total": len(items),
        "successful": len(results),
        "failed": len(errors),
        "results": results,
        "errors": errors
    }
```

---

## Seguridad

### Autenticación para n8n
```python
from fastapi import Header, HTTPException

async def verify_api_key(x_api_key: str = Header(...)):
    """Verifica API key de n8n."""
    if x_api_key != settings.N8N_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@router.post("/webhooks/secure-endpoint")
async def secure_endpoint(
    payload: WebhookPayload,
    _: str = Depends(verify_api_key)
):
    """Endpoint protegido con API key."""
    pass
```

### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/webhooks/rate-limited")
@limiter.limit("100/minute")
async def rate_limited_endpoint(request: Request, payload: WebhookPayload):
    """Endpoint con rate limiting."""
    pass
```

---

## Checklist de Integración

### Antes de crear endpoint para n8n
- [ ] Definir schema de request/response
- [ ] Documentar ejemplos de payload
- [ ] Implementar manejo de errores consistente
- [ ] Agregar logging apropiado
- [ ] Considerar timeout de n8n (< 60s para sync)

### Después de implementar
- [ ] Probar con n8n local
- [ ] Documentar en `automations/docs/`
- [ ] Crear workflow de ejemplo
- [ ] Agregar a colección de Postman/Insomnia

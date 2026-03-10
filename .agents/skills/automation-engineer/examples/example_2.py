from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

class WebhookPayload(BaseModel):
    """Payload estándar para webhooks de n8n."""
    event_type: str
    timestamp: datetime = None
    data: dict
    metadata: dict = {}

class WebhookResponse(BaseModel):
    """Respuesta estándar para n8n."""
    success: bool
    message: str
    request_id: str
    processed_at: datetime

@router.post("/process-order")
async def process_order_webhook(
    payload: WebhookPayload,
    background_tasks: BackgroundTasks
) -> WebhookResponse:
    """
    Webhook para procesar órdenes desde n8n.
    
    ## Uso en n8n
    
    1. Agregar nodo "HTTP Request"
    2. Method: POST
    3. URL: {{$env.BACKEND_URL}}/webhooks/process-order
    4. Body: JSON con estructura WebhookPayload
    
    ## Ejemplo de Body
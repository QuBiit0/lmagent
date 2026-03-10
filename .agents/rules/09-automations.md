# ⚡ Automation & Workflows Rules
> **Tipo**: `rule` | **Versión**: 3.6.0 | **Actualización**: 2026-03

## 📌 Quick Reference

| Principio | Regla |
|-----------|-------|
| **Secretos** | NUNCA hardcodear API Keys. Siempre `ENV_VARS` o Vaults. |
| **Webhooks** | Validar firmas (HMAC) siempre que sea posible. |
| **Retries** | Backoff exponencial con jitter. Máx 5 reintentos. |
| **Idempotencia** | `upsert` en lugar de `insert`. Workflows re-ejecutables sin duplicar. |
| **Nombres** | Nodos descriptivos (ej: `Get User Data` vs `HTTP Request`). |

### 👥 Roles que usan esta regla
`automation-engineer`, `backend-engineer`, `devops-engineer`, `orchestrator`

---

## 📌 Scope
Reglas para automatizaciones con **n8n**, **GitHub Actions**, **Webhooks**, **Zapier**, **Make** y scripts de orquestación.

> ⚠️ **FLEXIBILIDAD DE PLATAFORMAS**: Las plataformas mencionadas (ej. `n8n`, `Zapier`) son **ejemplos de referencia**. Tienes libertad para evaluar y proponer herramientas modernas de orquestación o automatización que mejor encajen con los requerimientos técnicos del proyecto.

---

## 🛡️ Security

1. **Secretos**: NUNCA hardcodear API Keys. Usar `ENV_VARS` o Vaults integrados en la plataforma.
2. **Webhooks**: Validar firmas (HMAC-SHA256) siempre que sea posible. Rechazar requests sin firma válida.
3. **Rate Limits**: Implementar backoff exponencial con jitter para retries.
4. **Tokens de Acceso**: Usar tokens de corta vida (OAuth2 refresh flow) en lugar de API keys permanentes.
5. **Logs**: Nunca loguear payloads completos con PII. Usar redacción selectiva.

---

## 🏗️ n8n Standards

### Naming
- **Nodos**: Nombrar descriptivamente (ej: `Fetch User By Email` vs `HTTP Request`).
- **Workflows**: Usar formato `[Dominio] - [Acción]` (ej: `CRM - Sync New Contacts`).
- **Credenciales**: Prefijo con entorno (ej: `PROD_Slack_Bot`, `DEV_Supabase`).

### Estructura
- **Error Trigger**: Todo workflow crítico debe tener un nodo "Error Trigger" que notifique a Slack/Discord/Email.
- **Idempotencia**: Los workflows deben poder re-ejecutarse sin duplicar efectos (ej: `upsert` en lugar de `insert`).
- **Timeout**: Configurar timeout en nodos HTTP (default: 30s, máx: 120s para operaciones pesadas).

### Documentación
- Cada workflow debe tener una nota "Sticky Note" de descripción en el canvas.
- Exportar JSON del workflow al repositorio en `.agents/workflows/n8n/`.

---

## 🔄 GitHub Actions Standards

### Estructura de Workflow

```yaml
# .github/workflows/[nombre].yml
name: "[Descripción clara]"
on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '22'  # Usar variables, no hardcodear

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 15  # Siempre definir timeout
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
```

### Best Practices
- **Secrets**: Usar `${{ secrets.API_KEY }}`, nunca hardcodear.
- **Caching**: Habilitar caché de dependencias (`cache: 'npm'` o `cache: 'pip'`).
- **Timeouts**: Asignar `timeout-minutes` a cada job para evitar ejecuciones infinitas.
- **Concurrency**: Usar `concurrency` groups para evitar deploys simultáneos conflictivos.

---

## 🔗 Webhook Standards

### Recepción
1. **Validar Firma**: Verificar HMAC antes de procesar el payload.
2. **Responder Rápido**: Retornar `200 OK` inmediatamente, procesar en background (queue).
3. **Idempotencia**: Usar `delivery_id` o `event_id` para deduplicar eventos.

### Emisión
1. **Retry Policy**: Implementar hasta 5 reintentos con backoff exponencial.
2. **Payload Mínimo**: Enviar solo datos necesarios, no objetos completos.
3. **Versionamiento**: Incluir versión del webhook en el header o URL (`/v1/webhook/...`).

```python
# ✅ Ejemplo: Validación de firma HMAC
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = hmac.new(
        secret.encode(), payload, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

---

## 📋 Error Handling & Retry Patterns

### Backoff Exponencial con Jitter

```python
import random
import time

def retry_with_backoff(func, max_retries=5, base_delay=1):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            time.sleep(delay)
```

### Clasificación de Errores
| Tipo | Acción | Retry |
|:---|:---|:---|
| **4xx Client Error** | Loguear y notificar. No reintentar. | ❌ |
| **429 Rate Limited** | Esperar `Retry-After` header. Reintentar. | ✅ |
| **5xx Server Error** | Reintentar con backoff exponencial. | ✅ |
| **Timeout** | Reintentar con timeout incrementado. | ✅ |
| **Network Error** | Reintentar con backoff. Máx 5 intentos. | ✅ |

---

## ✅ Checklist de Automatización

```markdown
## Pre-Deploy
- [ ] Secretos en ENV_VARS o Vault (no en código)
- [ ] Webhooks con validación de firma HMAC
- [ ] Error handling con retry + notificación
- [ ] Timeout configurado en todas las llamadas HTTP
- [ ] Idempotencia verificada (re-ejecución segura)

## Documentación
- [ ] Workflow documentado con Sticky Note (n8n) o README
- [ ] JSON exportado al repositorio (n8n)
- [ ] Variables de entorno documentadas en `.env.example`

## Monitoreo
- [ ] Error Trigger configurado para notificaciones
- [ ] Logs sin PII ni secretos
- [ ] Métricas de ejecución configuradas (si aplica)
```

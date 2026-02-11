---
description: Reglas para workflows de n8n y automatización
activation: always_on (when context is n8n)
---

# ⚡ Reglas para Automatización (n8n)

Estándares para construir workflows robustos y escalables en n8n.

## 1. Estructura de Workflows

### 1.1 Naming Convention
- **Nodos**: `[Action] [Entity]` (ej. "Get Users", "Post Slack Message").
- **Workflows**: `[Domain] - [Action]` (ej. "CRM - Sync Contacts").

### 1.2 Error Handling (Circuit Breaker)
**TODOS** los workflows productivos deben tener un nodo de "Error Trigger" o rutas de error.
- Si una API externa falla, el workflow no debe quedar en "Running" infinito.
- Usar nodos "Catch" para loguear errores en un canal central (Slack/Discord/DB).

## 2. Seguridad

### 2.1 Webhooks
- **Authentication**: Nunca exponer webhooks públicos sin validación.
    - Header Auth (`X-API-KEY`).
    - Basic Auth.
- **Payload Validation**: Validar el schema del JSON entrante antes de procesarlo.

### 2.2 Credenciales
- Nunca hardcodear credenciales en los nodos `HTTP Request`.
- Usar siempre **n8n Credentials Store**.

## 3. Performance

### 3.1 Split in Batches
Para listas grandes (>100 items), usar el nodo "Split In Batches".
- Evita timeouts de memoria.
- Permite control de rate-limits de APIs externas.

### 3.2 Idempotencia
Diseñar workflows para ser re-ejecutables.
- Antes de crear un registro, verificar si existe (`Check if exists`).
- Usar `UPSERT` en lugar de `INSERT` siempre que sea posible.

## 4. Documentación dentro de n8n

- Usar el nodo **Sticky Note** para explicar lógica compleja.
- Agrupar nodos relacionados visualmente.

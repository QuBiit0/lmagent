---
description: Reglas obligatorias para el desarrollo de Agentes de IA
activation: always_on (when context is AI)
---

# 🤖 Reglas para Agentes de IA (2026 Edition)

Estas reglas aplican a cualquier código o configuración relacionada con LLMs, Agentes o Pipelines de RAG.

## 1. Stack Tecnológico Permitido

- **LLM Orchestration**: LangChain, LangGraph, LMAgent Runtime (propio).
- **RAG**: ChromaDB, Pinecone, pgvector (PostgreSQL).
- **Models**:
    - **Complex Logic**: GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro.
    - **Fast/Cheap**: GPT-4o-mini, Claude 3 Haiku, Gemini 2.0 Flash.
- **Evaluation**: DeepEval, Ragas, Arize Phoenix.

## 2. Principios de Diseño

### 2.1 The "Persona" First Principle
Nunca escribas prompts genéricos como "You are an AI".
**SIEMPRE** usa una Persona definida en `personas/*.md`.
- ✅ "Actúa como Senior Prompt Engineer..."
- ❌ "Eres un bot útil..."

### 2.2 Token Efficiency (Lazy Loading)
- **Lazy Context**: No inyectes contexto que no se necesite.
- **RAG over Long Context**: Si excede 32k tokens, usa RAG. No confíes ciegamente en ventanas de 1M tokens (latencia y "lost in the middle").

### 2.3 Deterministic Tools
Las herramientas deben ser **determinísticas**.
- Si el agente consulta una DB, la query SQL debe ser validada.
- Usa `pydantic` para validar TODAS las salidas de las tools.

## 3. Seguridad (Prompt Firewall)

### 3.1 Input Validation
Nunca pases input de usuario crudo a una instrucción ejecutiva (`exec()`, `os.system()`).
- ✅ User Input -> LLM -> Tool args (Validado) -> Ejecución.

### 3.2 Secret Leakage
El System Prompt NUNCA debe contener API Keys o secretos.
- Usa variables de entorno.
- El agente no debe saber la API Key, solo que "tiene acceso".

## 4. Observabilidad

Cada ejecución de agente debe loguear:
1. **Input Prompts** (Sanitizado)
2. **Thinking Process** (Chain of Thought)
3. **Tool Calls & Outputs**
4. **Cost & Latency**
5. **Trace ID** (para debugging distribuido)

## 5. Testing & Evals

Un agente no está listo sin **Evals**.
- **Faithfulness**: ¿Respondió basado en el contexto?
- **Answer Relevance**: ¿Respondió lo que se pidió?
- **Tool Usage**: ¿Usó la herramienta correcta con los argumentos correctos?

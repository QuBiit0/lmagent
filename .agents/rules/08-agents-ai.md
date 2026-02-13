# 🤖 AI Agent Engineering Rules
> **Tipo**: `rule` | **Versión**: 3.0.0 | **Referencia**: `ai-agent-engineer`

## 📌 Core Principles
1. **Tool-First Mindset**: Los agentes no adivinan, usan herramientas.
2. **Determinismo**: `temperature=0` para llamadas a funciones (Function Calling).
3. **Traza de Ejecución**: Todo paso del agente debe ser logueado (Thinking Process).

## 🛠️ Tool Definition Standards (MCP)
- **JSON Schema**: Usar esquemas estrictos (`strict: true`).
- **Descripciones**: Deben ser exhaustivas. El LLM "lee" la descripción para saber cuándo usar la tool.
- **Error Handling**: Las tools nunca deben crashear el proceso. Deben retornar errores legibles para que el agente se corrija.

## 🧠 Memory patterns
- **Short-term**: Context window (Chat history).
- **Long-term**: Vector DB (RAG) o Archivos Markdown (`.agents/memory/`).

## 🧪 Evaluation (Evals)
Todo agente debe tener al menos 1 test de evaluación:
- **Input**: Prompt de prueba.
- **Expected Tool**: La herramienta que DEBE elegir.
- **Expected Args**: Los argumentos aproximados.

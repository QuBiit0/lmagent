# 🤖 AI Agent Engineering Rules
> **Tipo**: `rule` | **Versión**: 3.6.0 | **Actualización**: 2026-03

## 📌 Quick Reference

| Principio | Regla |
|-----------|-------|
| **Tool-First** | Los agentes usan herramientas, no adivinan. |
| **Determinismo** | `temperature=0` para Function Calling. |
| **Trazabilidad** | Todo paso del agente debe ser logueado. |
| **Memory** | Short-term (chat) + Long-term (RAG/archivos). |
| **Evals** | Todo agente debe tener al menos 1 test de evaluación. |

### 👥 Roles que usan esta regla
`ai-agent-engineer`, `prompt-engineer`, `orchestrator`, `mcp-builder`

---

> ⚠️ **FLEXIBILIDAD DE HERRAMIENTAS**: Frameworks y patrones listados (ej. MCP, RAG, Evals) son **ejemplos de referencia** conceptuales. Tienes la libertad y el deber de sugerir e implementar los protocolos y arquitecturas de agentes más modernos y eficientes del estado del arte.

## 📌 Core Principles

1. **Tool-First Mindset**: Los agentes no adivinan, usan herramientas. Si hay datos disponibles, siempre consultar antes de generar.
2. **Determinismo**: `temperature=0` para llamadas a funciones (Function Calling). Resultados reproducibles.
3. **Traza de Ejecución**: Todo paso del agente debe ser logueado (Thinking Process). Observabilidad total.
4. **Graceful Degradation**: Si una herramienta falla, el agente debe tener un plan B o informar claramente al usuario.

---

## 🧠 Arquitecturas Cognitivas Recomendadas

| Arquitectura | Cuándo Usar | Descripción |
|:---|:---|:---|
| **ReAct** | Tareas iterativas con herramientas | Bucle: Pensar → Elegir herramienta → Observar resultado → Iterar |
| **Plan-and-Solve** | Tareas complejas (Level 3+) | Dividir en sub-tareas secuenciales `[ ]` antes de ejecutar |
| **Reflection** | Código y análisis | Auto-evaluar resultado con linter/tests antes de entregarlo |
| **Self-Healing** | Errores recuperables | Detectar fallo → aplicar fix → reintentar sin intervención humana |
| **Tree of Thought** | Decisiones con múltiples caminos | Explorar alternativas en paralelo, elegir la mejor |

### ReAct Loop (Detallado)
```
THOUGHT: Necesito saber qué framework usa el proyecto
ACTION: view_file("package.json")
OBSERVATION: {"dependencies": {"fastify": "^4.0.0"}}
THOUGHT: Es Fastify, no Express. Ajusto mi implementación.
ACTION: mcp_context7_query-docs("fastify", "route declaration")
OBSERVATION: [documentación de Fastify]
THOUGHT: Ahora tengo el contexto. Implemento el endpoint.
ACTION: write_to_file(...)
```

---

## 🛠️ Tool Definition Standards (MCP)

### JSON Schema
- Usar esquemas **estrictos** (`strict: true`) para todas las herramientas.
- Cada parámetro debe tener `description` exhaustiva.
- Incluir `enum` para parámetros con valores finitos.

### Descripciones
- Deben ser **exhaustivas**. El LLM "lee" la descripción para saber cuándo usar la tool.
- Incluir cuándo usar Y cuándo NO usar la herramienta.
- Añadir ejemplos de input/output en la descripción.

### Error Handling
- Las tools **nunca** deben crashear el proceso.
- Retornar errores legibles en formato estructurado para que el agente se corrija.
- Incluir `error_code` + `message` + `suggestion` en respuestas de error.

```json
{
  "error": true,
  "error_code": "FILE_NOT_FOUND",
  "message": "El archivo config.yaml no existe en /app/",
  "suggestion": "Verifica la ruta o crea el archivo con write_to_file"
}
```

---

## 🧠 Memory Patterns

### Short-term (Context Window)
- **Chat History**: Implementar sliding windows o resúmenes periódicos para no romper el límite de tokens.
- **Compression**: Cuando el contexto supere el 70% de la ventana, resumir la conversación anterior.
- **Priority**: Información más reciente tiene mayor peso (Recency Bias).

### Long-term (Persistencia)
| Mecanismo | Cuándo Usar | Implementación |
|:---|:---|:---|
| **Vector Search (RAG)** | Similitud semántica sobre docs/código | ChromaDB, Pinecone, pgvector |
| **Graph RAG** | Relaciones complejas entre entidades | Neo4j, Apache AGE |
| **Archivos Markdown** | Contexto de proyecto local | `.agents/memory/` (nativo LMAgent) |
| **Structured Cache** | Resultados de consultas frecuentes | Redis, SQLite local |

### Protocolo de Memoria LMAgent
```
Al finalizar una tarea:
1. Actualizar .agents/memory/02-active-context.md con progreso
2. Si hubo lecciones aprendidas → 04-decision-log.md
3. Si cambió el stack → 03-tech-stack.md
4. Si se completó una feature → 05-product-state.md
```

---

## 🧪 Evaluation (Evals)

Todo agente debe tener **al menos 1 test de evaluación**:

### Estructura de un Eval

```yaml
eval:
  name: "test_file_search"
  input: "Busca todos los archivos Python en el directorio src/"
  expected_tool: "find_by_name"
  expected_args:
    SearchDirectory: "src/"
    Extensions: ["py"]
  success_criteria:
    - "Herramienta correcta seleccionada"
    - "Extensión .py incluida"
    - "Directorio correcto"
```

### Tipos de Evals
| Tipo | Qué Evalúa | Ejemplo |
|:---|:---|:---|
| **Tool Selection** | ¿Eligió la herramienta correcta? | Buscar archivo → `grep_search` |
| **Argument Quality** | ¿Los argumentos son correctos? | Ruta, filtros, opciones |
| **Output Quality** | ¿El resultado es útil? | Código limpio, sin errores |
| **Safety** | ¿Evitó acciones destructivas? | No borrar sin confirmar |

---

## 🚨 Anti-Patrones de Agentes IA

❌ **Alucinación de herramientas**: Invocar herramientas que no existen
❌ **Loop infinito**: Reintentar la misma acción sin modificar el approach
❌ **Context stuffing**: Inyectar todo el repositorio en el prompt
❌ **Blind execution**: Ejecutar código sin verificar efectos colaterales
❌ **Tool abuse**: Usar `run_command` para todo cuando hay herramientas específicas

---

## ✅ Checklist de Agentes IA

```markdown
## Diseño
- [ ] Arquitectura cognitiva definida (ReAct, Plan-and-Solve, etc.)
- [ ] Herramientas definidas con JSON Schema estricto
- [ ] Protocolo de memoria configurado

## Implementación
- [ ] Temperature=0 para Function Calling
- [ ] Error handling en todas las herramientas
- [ ] Logging de traza de ejecución

## Evaluación
- [ ] Al menos 1 eval de Tool Selection
- [ ] Tests de safety (no acciones destructivas)
- [ ] Benchmark de token consumption
```

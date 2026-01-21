# Reglas para Agentes de IA - LMAgent

Este documento define las reglas y mejores prácticas para el desarrollo de agentes de IA.

## Principios Fundamentales

### 1. Separación de Responsabilidades
```
┌─────────────────────────────────────────────────────────────┐
│  AGENTE = Orquestador de Herramientas                       │
│                                                             │
│  ┌─────────────┐                                            │
│  │    LLM      │ ← Razonamiento y decisiones                │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                            │
│  │   Tools     │ ← Acciones concretas                       │
│  └──────┬──────┘                                            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                            │
│  │   State     │ ← Memoria y contexto (Redis)               │
│  └─────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### 2. Stateless Agents
- Los agentes NO deben almacenar estado en memoria
- Usar Redis para estado entre invocaciones
- Cada llamada debe ser autocontenida

### 3. Observable Everything
- Logging de todas las interacciones con LLM
- Tracking de costos por sesión
- Métricas de latencia y errores

---

## Estructura de Agentes

### Directorio
```
agents/
├── config/
│   ├── agents.yaml        # Definición de agentes
│   ├── tools.yaml         # Registry de herramientas
│   └── models.yaml        # Configuración de LLMs
├── python/
│   ├── __init__.py
│   ├── base_agent.py      # Clase base
│   ├── agent_runner.py    # Ejecutor
│   ├── tools/             # Herramientas
│   │   ├── __init__.py
│   │   ├── registry.py    # Registry de tools
│   │   ├── base_tool.py   # Interface base
│   │   ├── http_tool.py
│   │   ├── database_tool.py
│   │   └── ...
│   ├── prompts/           # Templates de prompts
│   │   ├── system/
│   │   └── personas/
│   └── llm/               # Providers
│       ├── base_provider.py
│       ├── openai_provider.py
│       └── ...
└── README.md
```

---

## Diseño de Herramientas

### Interface Base
```python
from abc import ABC, abstractmethod
from pydantic import BaseModel, Field
from typing import Any, Dict

class ToolResult(BaseModel):
    """Resultado estándar de una herramienta."""
    success: bool
    data: Any = None
    error: str | None = None
    metadata: Dict[str, Any] = {}

class BaseTool(BaseModel, ABC):
    """Interface base para todas las herramientas."""
    
    name: str
    description: str
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Ejecuta la herramienta."""
        pass
    
    def to_function_schema(self) -> Dict:
        """Genera schema para function calling de OpenAI/Anthropic."""
        pass
```

### Reglas de Diseño de Tools

✅ **Hacer:**
- Una herramienta = una responsabilidad
- Parámetros opcionales con defaults sensatos
- Retornar siempre `ToolResult` consistente
- Incluir descripción clara para el LLM
- Logging de todas las ejecuciones
- Timeouts explícitos

❌ **No hacer:**
- Tools que hacen múltiples cosas
- Parámetros sin tipos o descripciones
- Excepciones no manejadas
- Llamadas externas sin timeout
- Logs con datos sensibles

### Ejemplo de Tool Bien Diseñada
```python
from lmagent.tools.base import BaseTool, ToolResult
from pydantic import Field
from typing import Optional
import httpx
import structlog

logger = structlog.get_logger()

class HttpRequestTool(BaseTool):
    """
    Realiza requests HTTP a APIs externas.
    
    Usa esta herramienta cuando necesites:
    - Obtener datos de una API externa
    - Enviar datos a un webhook
    - Verificar disponibilidad de un servicio
    
    NO uses para:
    - Acceso a base de datos (usa database_query)
    - Operaciones en Redis (usa redis_cache)
    """
    
    name: str = "http_request"
    description: str = "Make HTTP requests to external APIs"
    
    async def execute(
        self,
        url: str = Field(..., description="Full URL to request"),
        method: str = Field("GET", description="HTTP method"),
        headers: Optional[dict] = Field(None, description="Request headers"),
        body: Optional[dict] = Field(None, description="Request body for POST/PUT"),
        timeout: int = Field(30, description="Timeout in seconds")
    ) -> ToolResult:
        """Ejecuta request HTTP."""
        logger.info(
            "http_request_start",
            url=url,
            method=method
        )
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    json=body
                )
                
                logger.info(
                    "http_request_complete",
                    url=url,
                    status_code=response.status_code
                )
                
                return ToolResult(
                    success=response.is_success,
                    data={
                        "status_code": response.status_code,
                        "body": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text,
                        "headers": dict(response.headers)
                    },
                    metadata={
                        "elapsed_ms": response.elapsed.total_seconds() * 1000
                    }
                )
                
        except httpx.TimeoutException:
            logger.warning("http_request_timeout", url=url, timeout=timeout)
            return ToolResult(
                success=False,
                error=f"Request timed out after {timeout}s",
                metadata={"suggestion": "Try increasing timeout or check if service is available"}
            )
        except Exception as e:
            logger.error("http_request_error", url=url, error=str(e))
            return ToolResult(
                success=False,
                error=str(e)
            )
```

---

## Diseño de Prompts

### System Prompt Template
```markdown
You are {agent_name}, an AI assistant specialized in {domain}.

## Your Role
{role_description}

## Available Tools
You have access to the following tools:
{tools_list}

When using tools, always:
1. Think about which tool is most appropriate
2. Provide all required parameters
3. Handle errors gracefully

## Response Guidelines
- Be concise and direct
- Use structured formats when appropriate
- Cite sources when using external data
- Admit when you don't know something

## Constraints
- Maximum {max_tokens} tokens per response
- Do not make up information
- Do not access tools outside your allowed set
```

### Mejores Prácticas de Prompts

1. **Sea específico**: Evitar instrucciones vagas
   ```
   ❌ "Ayuda al usuario"
   ✅ "Ayuda al usuario a encontrar información sobre productos. 
       Si no encuentras el producto, sugiere alternativas similares."
   ```

2. **Dé ejemplos (Few-shot)**:
   ```
   ## Examples
   
   User: "Find product with SKU ABC123"
   Assistant: I'll search for that product.
   [Uses: search_product(sku="ABC123")]
   Result: Found "Widget Pro" priced at $99.99
   
   User: "What's the status of order 789?"
   Assistant: Let me check that order.
   [Uses: get_order(order_id="789")]
   Result: Order is "shipped", tracking: XYZ...
   ```

3. **Estructure el output**:
   ```
   ## Output Format
   
   Always respond in this JSON format:
   {
     "thinking": "Your reasoning process",
     "action": "Tool name or 'respond'",
     "action_input": {...} or null,
     "response": "Final response to user" or null
   }
   ```

4. **Defina límites claros**:
   ```
   ## You CANNOT:
   - Access production databases directly
   - Send emails without user confirmation
   - Make purchases or financial transactions
   - Access files outside the project directory
   ```

---

## Manejo de Errores

### Estrategia de Reintentos
```python
from tenacity import retry, stop_after_attempt, wait_exponential

class AgentRunner:
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10)
    )
    async def call_llm(self, messages: list) -> LLMResponse:
        """Llama al LLM con reintentos automáticos."""
        return await self.llm_provider.complete(messages)
```

### Fallback de Modelos
```python
async def get_completion(self, messages: list) -> str:
    """Intenta con modelo principal, fallback a secundario."""
    try:
        return await self.primary_model.complete(messages)
    except RateLimitError:
        logger.warning("primary_model_rate_limited, using fallback")
        return await self.fallback_model.complete(messages)
    except Exception as e:
        logger.error("llm_error", error=str(e))
        raise
```

### Errores del Agente
```python
class AgentError(Exception):
    """Error base de agentes."""
    pass

class ToolExecutionError(AgentError):
    """Error ejecutando herramienta."""
    def __init__(self, tool_name: str, error: str):
        self.tool_name = tool_name
        super().__init__(f"Tool '{tool_name}' failed: {error}")

class CostLimitExceeded(AgentError):
    """Se excedió el límite de costo."""
    def __init__(self, current_cost: float, limit: float):
        self.current_cost = current_cost
        self.limit = limit
        super().__init__(f"Cost ${current_cost:.2f} exceeded limit ${limit:.2f}")

class MaxIterationsExceeded(AgentError):
    """Se excedió el número máximo de iteraciones."""
    pass
```

---

## Observabilidad

### Logging Estructurado
```python
import structlog

logger = structlog.get_logger()

class Agent:
    async def run(self, user_input: str) -> str:
        run_id = generate_run_id()
        
        logger.info(
            "agent_run_start",
            run_id=run_id,
            agent_name=self.name,
            input_length=len(user_input)
        )
        
        try:
            result = await self._execute(user_input)
            
            logger.info(
                "agent_run_complete",
                run_id=run_id,
                iterations=self.iteration_count,
                total_cost=self.cost_tracker.total,
                output_length=len(result)
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "agent_run_error",
                run_id=run_id,
                error=str(e),
                error_type=type(e).__name__
            )
            raise
```

### Trajectory Logging
```python
class TrajectoryLogger:
    """Registra el historial completo de una ejecución."""
    
    def __init__(self, run_id: str):
        self.run_id = run_id
        self.steps: list[TrajectoryStep] = []
    
    def log_step(
        self,
        step_num: int,
        thought: str,
        action: str,
        action_input: dict,
        observation: str
    ):
        step = TrajectoryStep(
            step=step_num,
            timestamp=datetime.utcnow(),
            thought=thought,
            action=action,
            action_input=action_input,
            observation=observation
        )
        self.steps.append(step)
        
        # Log visual para debugging
        print(f"🤠 INFO STEP {step_num}")
        print(f"💭 THOUGHT: {thought}")
        print(f"🎬 ACTION: {action}")
        print(f"📤 OBSERVATION: {observation[:200]}...")
    
    def save(self, path: str):
        """Guarda trajectory para análisis posterior."""
        with open(path, 'w') as f:
            json.dump([s.model_dump() for s in self.steps], f, indent=2)
```

### Cost Tracking
```python
class CostTracker:
    """Monitorea costos de API por sesión."""
    
    def __init__(self, max_cost: float = 2.00):
        self.max_cost = max_cost
        self.total = 0.0
        self.calls: list[CostEntry] = []
    
    def track(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> float:
        """Registra y valida costo de llamada."""
        cost = self._calculate_cost(model, input_tokens, output_tokens)
        
        self.calls.append(CostEntry(
            model=model,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            cost=cost,
            timestamp=datetime.utcnow()
        ))
        
        self.total += cost
        
        if self.total >= self.max_cost:
            raise CostLimitExceeded(self.total, self.max_cost)
        
        return cost
    
    def _calculate_cost(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> float:
        """Calcula costo según modelo."""
        # Ver config/models.yaml para precios
        prices = PRICING.get(model, {"input": 0.01, "output": 0.03})
        return (
            (input_tokens / 1000) * prices["input"] +
            (output_tokens / 1000) * prices["output"]
        )
```

---

## Seguridad

### Guardrails Obligatorios

1. **Validar outputs de LLM** antes de ejecutar
2. **Limitar herramientas** a las necesarias
3. **Rate limiting** por usuario/sesión
4. **Sanitizar inputs** del usuario
5. **No exponer** API keys en logs

### Sandbox para Ejecución de Código
```python
class SandboxTool(BaseTool):
    """Ejecuta código en ambiente aislado."""
    
    name: str = "sandbox_execute"
    description: str = "Execute code in isolated Docker container"
    
    # Límites de seguridad
    MAX_MEMORY = "256m"
    MAX_CPU = "0.5"
    MAX_TIMEOUT = 300
    NETWORK = "none"  # Sin acceso a red
    
    async def execute(
        self,
        code: str,
        language: str = "python",
        timeout: int = 30
    ) -> ToolResult:
        # Sanitizar código
        if self._is_dangerous(code):
            return ToolResult(
                success=False,
                error="Code contains potentially dangerous operations"
            )
        
        # Ejecutar en container
        result = await self._run_in_docker(
            code=code,
            language=language,
            timeout=min(timeout, self.MAX_TIMEOUT)
        )
        
        return result
```

---

## Integración con n8n

Los agentes deben exponerse como endpoints HTTP para que n8n pueda invocarlos:

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/agents", tags=["agents"])

class AgentRequest(BaseModel):
    agent_name: str
    input: str
    context: dict = {}
    max_cost: float = 2.00

class AgentResponse(BaseModel):
    success: bool
    output: str
    cost: float
    iterations: int
    trajectory_id: str | None = None

@router.post("/run", response_model=AgentResponse)
async def run_agent(request: AgentRequest) -> AgentResponse:
    """
    Ejecuta un agente con el input dado.
    
    Diseñado para ser llamado desde n8n via HTTP Request node.
    """
    agent = await load_agent(request.agent_name)
    agent.cost_tracker.max_cost = request.max_cost
    
    result = await agent.run(request.input, context=request.context)
    
    return AgentResponse(
        success=True,
        output=result,
        cost=agent.cost_tracker.total,
        iterations=agent.iteration_count,
        trajectory_id=agent.trajectory_logger.run_id
    )
```

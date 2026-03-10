from abc import ABC, abstractmethod
from typing import List, Dict, Any
from pydantic import BaseModel

class Tool(BaseModel, ABC):
    """Base class para herramientas de agentes."""
    name: str
    description: str
    
    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        """Ejecuta la herramienta con los parámetros dados."""
        pass
    
    def to_openai_function(self) -> Dict:
        """Convierte a formato OpenAI function calling."""
        pass

class AgentConfig(BaseModel):
    """Configuración de un agente."""
    name: str
    system_prompt: str
    tools: List[str]  # Nombres de tools del registry
    model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 4096
    max_iterations: int = 10

class BaseAgent(ABC):
    """Base class para agentes de IA."""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.tools = self._load_tools()
        self.history = []
    
    async def run(self, user_input: str) -> str:
        """Ejecuta el agente con el input del usuario."""
        self.history.append({"role": "user", "content": user_input})
        
        for iteration in range(self.config.max_iterations):
            response = await self._get_llm_response()
            
            if response.tool_calls:
                results = await self._execute_tools(response.tool_calls)
                self.history.append({"role": "tool", "results": results})
            else:
                self.history.append({
                    "role": "assistant", 
                    "content": response.content
                })
                return response.content
        
        return "Max iterations reached"
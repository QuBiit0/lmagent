"""
Base Tool class for LMAgent.

All tools must inherit from BaseTool and implement the execute method.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
import structlog

logger = structlog.get_logger()


class ToolResult(BaseModel):
    """Standardized result from tool execution."""
    
    success: bool = Field(..., description="Whether the tool execution succeeded")
    data: Any = Field(default=None, description="Result data from the tool")
    error: Optional[str] = Field(default=None, description="Error message if failed")
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata about the execution"
    )
    
    def __str__(self) -> str:
        if self.success:
            return f"Success: {self.data}"
        return f"Error: {self.error}"


class BaseTool(BaseModel, ABC):
    """
    Abstract base class for all LMAgent tools.
    
    All tools must:
    1. Define name and description
    2. Implement the execute method
    3. Return a ToolResult
    
    Example:
        class MyTool(BaseTool):
            name: str = "my_tool"
            description: str = "Does something useful"
            
            async def execute(self, param1: str, param2: int = 10) -> ToolResult:
                # Implementation
                return ToolResult(success=True, data="result")
    """
    
    name: str = Field(..., description="Unique tool name")
    description: str = Field(..., description="Description for the LLM")
    
    class Config:
        arbitrary_types_allowed = True
    
    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """
        Execute the tool with given parameters.
        
        Must be implemented by all tools.
        
        Returns:
            ToolResult with success status and data or error
        """
        pass
    
    def to_openai_function(self) -> Dict[str, Any]:
        """
        Convert tool to OpenAI function calling format.
        
        Returns:
            Dict compatible with OpenAI's function calling API
        """
        # Get parameters from execute method signature
        import inspect
        sig = inspect.signature(self.execute)
        
        properties = {}
        required = []
        
        for param_name, param in sig.parameters.items():
            if param_name in ('self', 'kwargs'):
                continue
                
            # Determine type
            param_type = "string"
            if param.annotation != inspect.Parameter.empty:
                if param.annotation == int:
                    param_type = "integer"
                elif param.annotation == bool:
                    param_type = "boolean"
                elif param.annotation == float:
                    param_type = "number"
                elif param.annotation == list:
                    param_type = "array"
                elif param.annotation == dict:
                    param_type = "object"
            
            properties[param_name] = {
                "type": param_type,
                "description": f"Parameter: {param_name}"
            }
            
            # Check if required
            if param.default == inspect.Parameter.empty:
                required.append(param_name)
        
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": properties,
                    "required": required
                }
            }
        }
    
    def to_anthropic_tool(self) -> Dict[str, Any]:
        """
        Convert tool to Anthropic tool format.
        
        Returns:
            Dict compatible with Anthropic's tool use API
        """
        openai_format = self.to_openai_function()
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": openai_format["function"]["parameters"]
        }
    
    def log_execution(
        self,
        params: Dict[str, Any],
        result: ToolResult,
        duration_ms: float
    ) -> None:
        """Log tool execution for observability."""
        logger.info(
            "tool_execution",
            tool=self.name,
            success=result.success,
            duration_ms=duration_ms,
            params=self._sanitize_params(params),
            error=result.error if not result.success else None
        )
    
    def _sanitize_params(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Remove sensitive data from params for logging."""
        sensitive_keys = {'password', 'token', 'secret', 'api_key', 'key'}
        return {
            k: '***' if any(s in k.lower() for s in sensitive_keys) else v
            for k, v in params.items()
        }

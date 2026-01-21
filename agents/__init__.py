"""
LMAgent - Framework for automation and AI agent development.

This package provides:
- Tool registry and implementations
- Agent runtime with ReAct loop
- Cost tracking and trajectory logging
- Multi-IDE compatibility
"""

__version__ = "1.0.0"
__author__ = "LMAgent Team"

from agents.runtime import LMAgentRuntime, run_agent, AgentConfig
from agents.tools.base_tool import BaseTool, ToolResult

__all__ = [
    "LMAgentRuntime",
    "run_agent",
    "AgentConfig",
    "BaseTool",
    "ToolResult",
]

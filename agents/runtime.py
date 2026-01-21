"""
LMAgent Runtime - Main Agent Execution Engine (SWE-agent style)

This is the core agent runtime that:
1. Loads configuration
2. Initializes tools
3. Manages the ReAct loop
4. Tracks costs and trajectories
5. Provides the main entry point for agent execution
"""

from __future__ import annotations

import asyncio
import json
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import structlog
from pydantic import BaseModel, Field
import yaml

# Local imports
from agents.tools.base_tool import BaseTool, ToolResult
from agents.tools import (
    ShellTool,
    GitStatusTool,
    GitDiffTool,
    GitAddTool,
    GitCommitTool,
    GitPushTool,
    GitBranchTool,
    GitLogTool,
    FileReadTool,
    FileWriteTool,
    FileSearchTool,
    PythonLintTool,
    PythonFormatTool,
    TypeCheckTool,
    TestRunnerTool,
    HttpTool,
    DatabaseTool,
    EditLintTool,
)

logger = structlog.get_logger()


# ============================================
# COST TRACKING
# ============================================

# Cost per 1K tokens (update with current prices)
LLM_COSTS = {
    "gpt-4o": {"input": 0.0025, "output": 0.01},
    "gpt-4o-mini": {"input": 0.00015, "output": 0.0006},
    "claude-sonnet-4": {"input": 0.003, "output": 0.015},
    "claude-3-5-haiku": {"input": 0.0008, "output": 0.004},
    "gemini-2.0-flash": {"input": 0.0, "output": 0.0},  # Free tier
    "gemini-2.5-pro": {"input": 0.00125, "output": 0.005},
}


class CostTracker(BaseModel):
    """Tracks LLM API costs during agent execution."""
    
    max_cost: float = Field(default=2.00, description="Maximum allowed cost in USD")
    total_cost: float = Field(default=0.0)
    costs_by_model: Dict[str, float] = Field(default_factory=dict)
    
    def track(self, model: str, input_tokens: int, output_tokens: int) -> float:
        """Track cost for a single API call."""
        costs = LLM_COSTS.get(model, {"input": 0.01, "output": 0.03})
        
        call_cost = (
            (input_tokens / 1000) * costs["input"] +
            (output_tokens / 1000) * costs["output"]
        )
        
        self.total_cost += call_cost
        self.costs_by_model[model] = self.costs_by_model.get(model, 0) + call_cost
        
        logger.debug(
            "cost_tracked",
            model=model,
            call_cost=call_cost,
            total_cost=self.total_cost
        )
        
        return call_cost
    
    def check_limit(self) -> bool:
        """Check if cost limit has been exceeded."""
        return self.total_cost >= self.max_cost
    
    def remaining(self) -> float:
        """Get remaining budget."""
        return max(0, self.max_cost - self.total_cost)


# ============================================
# TRAJECTORY LOGGING
# ============================================

class TrajectoryStep(BaseModel):
    """Single step in agent trajectory."""
    
    step: int
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    thought: Optional[str] = None
    action: Optional[str] = None
    action_args: Optional[Dict[str, Any]] = None
    observation: Optional[str] = None
    error: Optional[str] = None


class TrajectoryLogger(BaseModel):
    """Logs full trajectory of agent execution (SWE-agent style)."""
    
    trajectory_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    steps: List[TrajectoryStep] = Field(default_factory=list)
    start_time: float = Field(default_factory=time.time)
    
    def log_step(
        self,
        step: int,
        thought: str = None,
        action: str = None,
        action_args: Dict = None,
        observation: str = None,
        error: str = None
    ) -> None:
        """Log a single step."""
        entry = TrajectoryStep(
            step=step,
            thought=thought,
            action=action,
            action_args=action_args,
            observation=observation[:1000] if observation else None,
            error=error
        )
        self.steps.append(entry)
        
        # Print SWE-agent style output
        print(f"\n🤠 INFO ========================= STEP {step} =========================")
        if thought:
            print(f"💭 THOUGHT: {thought}")
        if action:
            args_str = json.dumps(action_args, default=str) if action_args else ""
            print(f"🎬 ACTION: {action}({args_str})")
        if observation:
            obs_preview = observation[:500] + "..." if len(observation) > 500 else observation
            print(f"📤 OBSERVATION: {obs_preview}")
        if error:
            print(f"❌ ERROR: {error}")
    
    def save(self, path: Path) -> None:
        """Save trajectory to file."""
        path.parent.mkdir(parents=True, exist_ok=True)
        
        data = {
            "trajectory_id": self.trajectory_id,
            "start_time": self.start_time,
            "duration_seconds": time.time() - self.start_time,
            "total_steps": len(self.steps),
            "steps": [s.model_dump() for s in self.steps]
        }
        
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info("trajectory_saved", path=str(path))
    
    def to_markdown(self) -> str:
        """Convert trajectory to markdown format."""
        lines = [
            f"# Trajectory: {self.trajectory_id}",
            f"",
            f"**Duration**: {time.time() - self.start_time:.1f}s",
            f"**Steps**: {len(self.steps)}",
            f""
        ]
        
        for step in self.steps:
            lines.append(f"## Step {step.step}")
            if step.thought:
                lines.append(f"**Thought**: {step.thought}")
            if step.action:
                lines.append(f"**Action**: `{step.action}`")
                if step.action_args:
                    lines.append(f"```json\n{json.dumps(step.action_args, indent=2)}\n```")
            if step.observation:
                lines.append(f"**Observation**:")
                lines.append(f"```\n{step.observation[:500]}\n```")
            if step.error:
                lines.append(f"**Error**: {step.error}")
            lines.append("")
        
        return "\n".join(lines)


# ============================================
# AGENT RUNTIME
# ============================================

class AgentConfig(BaseModel):
    """Agent configuration."""
    
    name: str = "lmagent"
    model: str = "gpt-4o"
    provider: str = "openai"
    temperature: float = 0.7
    max_tokens: int = 4096
    max_iterations: int = 15
    max_cost: float = 2.00
    timeout_seconds: int = 300
    system_prompt_path: Optional[str] = None
    tools: List[str] = Field(default_factory=list)
    
    @classmethod
    def from_yaml(cls, path: Path) -> "AgentConfig":
        """Load config from YAML."""
        with open(path) as f:
            data = yaml.safe_load(f)
        
        return cls(
            name=data.get("name", "lmagent"),
            model=data.get("llm", {}).get("model", "gpt-4o"),
            provider=data.get("llm", {}).get("provider", "openai"),
            temperature=data.get("llm", {}).get("temperature", 0.7),
            max_tokens=data.get("llm", {}).get("max_tokens", 4096),
            max_iterations=data.get("limits", {}).get("max_iterations", 15),
            max_cost=data.get("limits", {}).get("max_cost", 2.00),
            tools=data.get("tools", {}).get("from_registry", [])
        )


class LMAgentRuntime:
    """
    Main agent runtime engine.
    
    Implements the ReAct loop with tool use, cost tracking, and trajectory logging.
    """
    
    def __init__(
        self,
        config: Optional[AgentConfig] = None,
        project_root: Optional[Path] = None
    ):
        self.config = config or AgentConfig()
        self.project_root = project_root or Path.cwd()
        
        # Initialize components
        self.cost_tracker = CostTracker(max_cost=self.config.max_cost)
        self.trajectory = TrajectoryLogger()
        self.tools: Dict[str, BaseTool] = {}
        
        # Load tools
        self._load_tools()
        
        # Track state
        self.iteration = 0
        self.messages: List[Dict] = []
        
        logger.info(
            "agent_runtime_initialized",
            name=self.config.name,
            model=self.config.model,
            tools=list(self.tools.keys())
        )
    
    def _load_tools(self) -> None:
        """Initialize all available tools."""
        # Map of tool names to classes
        TOOL_MAP = {
            "shell_execute": ShellTool,
            "git_status": GitStatusTool,
            "git_diff": GitDiffTool,
            "git_add": GitAddTool,
            "git_commit": GitCommitTool,
            "git_push": GitPushTool,
            "git_branch": GitBranchTool,
            "git_log": GitLogTool,
            "file_read": FileReadTool,
            "file_write": FileWriteTool,
            "file_search": FileSearchTool,
            "lint_python": PythonLintTool,
            "format_python": PythonFormatTool,
            "type_check": TypeCheckTool,
            "run_tests": TestRunnerTool,
            "http_request": HttpTool,
            "database_query": DatabaseTool,
            "edit_and_lint": EditLintTool,
        }
        
        for tool_name, tool_class in TOOL_MAP.items():
            if hasattr(tool_class, 'project_root'):
                self.tools[tool_name] = tool_class(project_root=self.project_root)
            else:
                self.tools[tool_name] = tool_class()
    
    def get_tools_for_llm(self) -> List[Dict]:
        """Get tool definitions in OpenAI format."""
        return [tool.to_openai_function() for tool in self.tools.values()]
    
    async def execute_tool(self, tool_name: str, args: Dict[str, Any]) -> ToolResult:
        """Execute a tool by name."""
        if tool_name not in self.tools:
            return ToolResult(
                success=False,
                error=f"Unknown tool: {tool_name}"
            )
        
        tool = self.tools[tool_name]
        
        try:
            start_time = time.perf_counter()
            result = await tool.execute(**args)
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            tool.log_execution(args, result, duration_ms)
            
            return result
            
        except Exception as e:
            logger.error("tool_execution_error", tool=tool_name, error=str(e))
            return ToolResult(success=False, error=str(e))
    
    async def run(
        self,
        user_input: str,
        context: Optional[Dict] = None
    ) -> str:
        """
        Run the agent with user input.
        
        Implements the main ReAct loop:
        1. Get LLM response
        2. If tool calls, execute and continue
        3. If text response, return
        4. Track costs and trajectory
        """
        logger.info("agent_run_start", input_length=len(user_input))
        
        # Initialize messages
        system_prompt = self._get_system_prompt()
        self.messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
        
        # Main loop
        for self.iteration in range(1, self.config.max_iterations + 1):
            # Check cost limit
            if self.cost_tracker.check_limit():
                logger.warning("cost_limit_exceeded")
                return f"Cost limit exceeded (${self.cost_tracker.total_cost:.2f}). Stopping."
            
            # Get LLM response
            response = await self._call_llm()
            
            if not response:
                return "Failed to get LLM response"
            
            # Check for tool calls
            tool_calls = response.get("tool_calls", [])
            
            if tool_calls:
                # Execute each tool call
                for tool_call in tool_calls:
                    tool_name = tool_call.get("name", "")
                    tool_args = tool_call.get("arguments", {})
                    
                    # Log the action
                    self.trajectory.log_step(
                        step=self.iteration,
                        thought=response.get("thinking", ""),
                        action=tool_name,
                        action_args=tool_args
                    )
                    
                    # Execute tool
                    result = await self.execute_tool(tool_name, tool_args)
                    
                    # Log observation
                    observation = str(result.data) if result.success else result.error
                    self.trajectory.log_step(
                        step=self.iteration,
                        observation=observation,
                        error=result.error if not result.success else None
                    )
                    
                    # Add to messages
                    self.messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.get("id", ""),
                        "name": tool_name,
                        "content": json.dumps(result.model_dump(), default=str)
                    })
            else:
                # No tool calls - agent wants to respond
                final_response = response.get("content", "")
                
                self.trajectory.log_step(
                    step=self.iteration,
                    thought="Final response",
                    observation=final_response[:200]
                )
                
                # Save trajectory
                trajectory_path = self.project_root / "trajectories" / f"{self.trajectory.trajectory_id}.json"
                self.trajectory.save(trajectory_path)
                
                logger.info(
                    "agent_run_complete",
                    iterations=self.iteration,
                    cost=self.cost_tracker.total_cost,
                    trajectory_id=self.trajectory.trajectory_id
                )
                
                return final_response
        
        # Max iterations reached
        logger.warning("max_iterations_reached")
        return f"Reached maximum iterations ({self.config.max_iterations}). Partial progress made."
    
    async def _call_llm(self) -> Optional[Dict]:
        """
        Call the LLM.
        
        This is a placeholder - implement with your preferred LLM library:
        - OpenAI: openai.ChatCompletion.create()
        - Anthropic: anthropic.messages.create()
        - LiteLLM: litellm.acompletion()
        """
        # Placeholder implementation
        logger.info("llm_call", model=self.config.model);
        
        # Simulate cost tracking
        self.cost_tracker.track(self.config.model, 500, 200)
        
        # Return mock response for template
        return {
            "content": "This is a placeholder LLM response. Implement _call_llm() with your LLM provider.",
            "tool_calls": []
        }
    
    def _get_system_prompt(self) -> str:
        """Get system prompt for the agent."""
        if self.config.system_prompt_path:
            prompt_path = self.project_root / self.config.system_prompt_path
            if prompt_path.exists():
                return prompt_path.read_text()
        
        # Default system prompt
        tool_descriptions = "\n".join([
            f"- {name}: {tool.description}"
            for name, tool in self.tools.items()
        ])
        
        return f"""You are LMAgent, an AI coding assistant.

You have access to the following tools:
{tool_descriptions}

When you need to take an action:
1. Think about what you need to do
2. Choose the appropriate tool
3. Call the tool with the required parameters
4. Observe the result
5. Continue or provide final answer

Be concise and efficient. Focus on solving the user's task."""


# ============================================
# ENTRY POINTS
# ============================================

async def run_agent(
    task: str,
    config_path: Optional[Path] = None,
    project_root: Optional[Path] = None
) -> str:
    """Quick helper to run an agent."""
    config = None
    if config_path:
        config = AgentConfig.from_yaml(config_path)
    
    runtime = LMAgentRuntime(config=config, project_root=project_root)
    return await runtime.run(task)


if __name__ == "__main__":
    # Example usage
    async def main():
        result = await run_agent(
            task="List all Python files in the agents directory",
            project_root=Path(".")
        )
        print(f"\n📝 Final Response:\n{result}")
    
    asyncio.run(main())

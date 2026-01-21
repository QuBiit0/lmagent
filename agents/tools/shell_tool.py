"""
Shell execution tool for LMAgent.

Allows agents to execute shell commands safely within the project directory.
"""

from __future__ import annotations

import asyncio
import os
import re
import time
from pathlib import Path
from typing import Dict, List, Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult

logger = structlog.get_logger()


class ShellTool(BaseTool):
    """
    Execute shell commands in the project directory.
    
    Security features:
    - Commands are logged
    - Dangerous patterns are blocked
    - Execution is sandboxed to project directory
    - Timeout enforced
    
    Example:
        tool = ShellTool()
        result = await tool.execute(command="ls -la", cwd="app")
    """
    
    name: str = "shell_execute"
    description: str = "Execute shell commands in the project directory"
    
    # Configuration
    project_root: Path = Field(default_factory=Path.cwd)
    max_output_length: int = Field(default=10000)
    
    # Dangerous patterns that are blocked
    dangerous_patterns: List[str] = Field(default_factory=lambda: [
        r"rm\s+-rf\s+/",
        r"rm\s+-rf\s+~",
        r"rm\s+-rf\s+\*",
        r">\s*/dev/sd",
        r"mkfs\.",
        r"dd\s+if=",
        r":\(\)\{:\|:&\};:",  # Fork bomb
        r"chmod\s+-R\s+777\s+/",
        r"curl.*\|\s*(bash|sh)",
        r"wget.*\|\s*(bash|sh)",
    ])
    
    async def execute(
        self,
        command: str = Field(..., description="Shell command to execute"),
        cwd: Optional[str] = Field(None, description="Working directory relative to project"),
        timeout: int = Field(60, description="Timeout in seconds"),
        env: Optional[Dict[str, str]] = Field(None, description="Additional env vars")
    ) -> ToolResult:
        """
        Execute a shell command.
        
        Args:
            command: The shell command to execute
            cwd: Working directory relative to project root
            timeout: Maximum execution time in seconds
            env: Additional environment variables
            
        Returns:
            ToolResult with stdout, stderr, and exit code
        """
        start_time = time.perf_counter()
        
        # Security check - block dangerous commands
        if self._is_dangerous(command):
            return ToolResult(
                success=False,
                error="Command blocked: contains dangerous pattern",
                metadata={"blocked": True, "command": command}
            )
        
        # Determine working directory
        work_dir = self.project_root
        if cwd:
            work_dir = self.project_root / cwd
            if not work_dir.exists():
                return ToolResult(
                    success=False,
                    error=f"Directory does not exist: {cwd}"
                )
            # Security: ensure we stay within project
            try:
                work_dir.resolve().relative_to(self.project_root.resolve())
            except ValueError:
                return ToolResult(
                    success=False,
                    error="Cannot execute outside project directory"
                )
        
        # Prepare environment
        exec_env = os.environ.copy()
        if env:
            exec_env.update(env)
        
        logger.info(
            "shell_execute_start",
            command=command,
            cwd=str(work_dir)
        )
        
        try:
            # Create subprocess
            process = await asyncio.create_subprocess_shell(
                command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                cwd=str(work_dir),
                env=exec_env
            )
            
            # Wait with timeout
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=timeout
                )
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()
                return ToolResult(
                    success=False,
                    error=f"Command timed out after {timeout}s",
                    metadata={"timeout": True, "command": command}
                )
            
            duration_ms = (time.perf_counter() - start_time) * 1000
            
            # Decode outputs
            stdout_str = stdout.decode('utf-8', errors='replace')
            stderr_str = stderr.decode('utf-8', errors='replace')
            
            # Truncate if too long
            if len(stdout_str) > self.max_output_length:
                stdout_str = stdout_str[:self.max_output_length] + "\n... (truncated)"
            if len(stderr_str) > self.max_output_length:
                stderr_str = stderr_str[:self.max_output_length] + "\n... (truncated)"
            
            exit_code = process.returncode
            
            logger.info(
                "shell_execute_complete",
                command=command,
                exit_code=exit_code,
                duration_ms=duration_ms
            )
            
            return ToolResult(
                success=exit_code == 0,
                data={
                    "stdout": stdout_str,
                    "stderr": stderr_str,
                    "exit_code": exit_code
                },
                error=stderr_str if exit_code != 0 else None,
                metadata={
                    "duration_ms": duration_ms,
                    "command": command,
                    "cwd": str(work_dir)
                }
            )
            
        except Exception as e:
            logger.error(
                "shell_execute_error",
                command=command,
                error=str(e)
            )
            return ToolResult(
                success=False,
                error=f"Execution error: {str(e)}"
            )
    
    def _is_dangerous(self, command: str) -> bool:
        """Check if command contains dangerous patterns."""
        for pattern in self.dangerous_patterns:
            if re.search(pattern, command, re.IGNORECASE):
                logger.warning(
                    "dangerous_command_blocked",
                    command=command,
                    pattern=pattern
                )
                return True
        return False


# Convenience functions
async def run_command(command: str, cwd: Optional[str] = None) -> ToolResult:
    """Quick helper to run a shell command."""
    tool = ShellTool()
    return await tool.execute(command=command, cwd=cwd)

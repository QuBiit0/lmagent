"""
Linting and formatting tools for LMAgent.

Provides tools to run linters, formatters, and type checkers.
"""

from __future__ import annotations

import asyncio
import json
import re
from pathlib import Path
from typing import List, Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult

logger = structlog.get_logger()


async def _run_command(cmd: List[str], cwd: Path = None) -> tuple[str, str, int]:
    """Run a command and return stdout, stderr, exit_code."""
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=str(cwd) if cwd else None
    )
    stdout, stderr = await process.communicate()
    return (
        stdout.decode('utf-8', errors='replace'),
        stderr.decode('utf-8', errors='replace'),
        process.returncode
    )


class PythonLintTool(BaseTool):
    """Run ruff linter on Python code."""
    
    name: str = "lint_python"
    description: str = "Run ruff linter on Python code"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        path: str = ".",
        fix: bool = False
    ) -> ToolResult:
        """Run ruff linter."""
        try:
            target = self.project_root / path
            
            args = ["ruff", "check", str(target), "--output-format=json"]
            if fix:
                args.append("--fix")
            
            stdout, stderr, code = await _run_command(args, self.project_root)
            
            errors = []
            warnings = []
            fixed = 0
            
            try:
                # Parse JSON output
                if stdout.strip():
                    issues = json.loads(stdout)
                    for issue in issues:
                        entry = {
                            "file": issue.get("filename", ""),
                            "line": issue.get("location", {}).get("row", 0),
                            "code": issue.get("code", ""),
                            "message": issue.get("message", "")
                        }
                        # Separate errors and warnings
                        if issue.get("code", "").startswith(("E", "F")):
                            errors.append(entry)
                        else:
                            warnings.append(entry)
            except json.JSONDecodeError:
                # Fallback: parse text output
                for line in stdout.split('\n'):
                    if ':' in line and re.match(r'.+:\d+:\d+:', line):
                        errors.append({"raw": line})
            
            # Check for fixes in stderr
            if fix and "Fixed" in stderr:
                match = re.search(r'Fixed (\d+)', stderr)
                if match:
                    fixed = int(match.group(1))
            
            return ToolResult(
                success=len(errors) == 0,
                data={
                    "errors": errors[:50],  # Limit output
                    "warnings": warnings[:50],
                    "fixed": fixed,
                    "total_issues": len(errors) + len(warnings)
                },
                error="Lint errors found" if errors else None
            )
            
        except FileNotFoundError:
            return ToolResult(
                success=False,
                error="ruff not found. Install with: pip install ruff"
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class PythonFormatTool(BaseTool):
    """Format Python code with ruff."""
    
    name: str = "format_python"
    description: str = "Format Python code with ruff"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        path: str = ".",
        check: bool = False
    ) -> ToolResult:
        """Run ruff formatter."""
        try:
            target = self.project_root / path
            
            args = ["ruff", "format", str(target)]
            if check:
                args.append("--check")
            
            stdout, stderr, code = await _run_command(args, self.project_root)
            
            formatted = []
            would_format = []
            
            # Parse output
            output = stdout + stderr
            for line in output.split('\n'):
                if line.strip():
                    if "would be reformatted" in line.lower():
                        would_format.append(line.split()[0])
                    elif "reformatted" in line.lower() or line.endswith('.py'):
                        formatted.append(line.strip())
            
            return ToolResult(
                success=code == 0,
                data={
                    "formatted": formatted,
                    "would_format": would_format
                },
                error="Files need formatting" if code != 0 and check else None
            )
            
        except FileNotFoundError:
            return ToolResult(
                success=False,
                error="ruff not found. Install with: pip install ruff"
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class TypeCheckTool(BaseTool):
    """Run type checker (mypy for Python, tsc for TypeScript)."""
    
    name: str = "type_check"
    description: str = "Run type checker"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        language: str = "python",
        path: str = "."
    ) -> ToolResult:
        """Run type checker."""
        try:
            target = self.project_root / path
            
            if language == "python":
                args = ["mypy", str(target), "--no-error-summary"]
                stdout, stderr, code = await _run_command(args, self.project_root)
                output = stdout
            elif language == "typescript":
                args = ["npx", "tsc", "--noEmit", "--pretty", "false"]
                stdout, stderr, code = await _run_command(args, self.project_root)
                output = stdout + stderr
            else:
                return ToolResult(
                    success=False,
                    error=f"Unsupported language: {language}"
                )
            
            errors = []
            files_checked = set()
            
            for line in output.split('\n'):
                if line.strip():
                    # Parse mypy/tsc error format
                    match = re.match(r'(.+):(\d+):(\d+)?:?\s*(error|warning)?:?\s*(.*)', line)
                    if match:
                        filename = match.group(1)
                        files_checked.add(filename)
                        errors.append({
                            "file": filename,
                            "line": int(match.group(2)),
                            "column": int(match.group(3)) if match.group(3) else 0,
                            "severity": match.group(4) or "error",
                            "message": match.group(5)
                        })
            
            return ToolResult(
                success=len(errors) == 0,
                data={
                    "errors": errors[:50],
                    "files_checked": len(files_checked)
                },
                error="Type errors found" if errors else None
            )
            
        except FileNotFoundError as e:
            tool_name = "mypy" if language == "python" else "tsc"
            return ToolResult(
                success=False,
                error=f"{tool_name} not found. Install it first."
            )
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class TypeScriptLintTool(BaseTool):
    """Run ESLint on TypeScript/JavaScript code."""
    
    name: str = "lint_typescript"
    description: str = "Run ESLint on TypeScript/JavaScript code"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        path: str = ".",
        fix: bool = False
    ) -> ToolResult:
        """Run ESLint."""
        try:
            target = self.project_root / path
            
            args = ["npx", "eslint", str(target), "--format", "json"]
            if fix:
                args.append("--fix")
            
            stdout, stderr, code = await _run_command(args, self.project_root)
            
            errors = []
            warnings = []
            fixed = 0
            
            try:
                if stdout.strip():
                    results = json.loads(stdout)
                    for file_result in results:
                        for msg in file_result.get("messages", []):
                            entry = {
                                "file": file_result.get("filePath", ""),
                                "line": msg.get("line", 0),
                                "column": msg.get("column", 0),
                                "rule": msg.get("ruleId", ""),
                                "message": msg.get("message", "")
                            }
                            if msg.get("severity") == 2:
                                errors.append(entry)
                            else:
                                warnings.append(entry)
                        fixed += file_result.get("fixableErrorCount", 0)
                        fixed += file_result.get("fixableWarningCount", 0)
            except json.JSONDecodeError:
                pass
            
            return ToolResult(
                success=len(errors) == 0,
                data={
                    "errors": errors[:50],
                    "warnings": warnings[:50],
                    "fixed": fixed if fix else 0
                },
                error="ESLint errors found" if errors else None
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))

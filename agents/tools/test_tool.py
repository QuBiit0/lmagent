"""
Test runner tools for LMAgent.

Provides tools to run test suites with pytest/jest.
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


class TestRunnerTool(BaseTool):
    """Run test suite."""
    
    name: str = "run_tests"
    description: str = "Run test suite with pytest or jest"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        framework: str = "auto",
        path: Optional[str] = None,
        pattern: Optional[str] = None,
        coverage: bool = False,
        verbose: bool = True
    ) -> ToolResult:
        """Run tests."""
        try:
            # Auto-detect framework
            if framework == "auto":
                framework = self._detect_framework()
            
            if framework == "pytest":
                return await self._run_pytest(path, pattern, coverage, verbose)
            elif framework == "jest":
                return await self._run_jest(path, pattern, coverage, verbose)
            else:
                return ToolResult(
                    success=False,
                    error=f"Unknown framework: {framework}"
                )
                
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def _detect_framework(self) -> str:
        """Detect test framework based on project files."""
        if (self.project_root / "pytest.ini").exists():
            return "pytest"
        if (self.project_root / "pyproject.toml").exists():
            return "pytest"
        if (self.project_root / "setup.py").exists():
            return "pytest"
        if (self.project_root / "jest.config.js").exists():
            return "jest"
        if (self.project_root / "jest.config.ts").exists():
            return "jest"
        if (self.project_root / "package.json").exists():
            return "jest"
        return "pytest"  # Default
    
    async def _run_pytest(
        self,
        path: Optional[str],
        pattern: Optional[str],
        coverage: bool,
        verbose: bool
    ) -> ToolResult:
        """Run pytest."""
        args = ["pytest", "--tb=short", "-q"]
        
        if verbose:
            args = ["pytest", "--tb=short", "-v"]
        
        if path:
            args.append(path)
        
        if pattern:
            args.extend(["-k", pattern])
        
        if coverage:
            args.extend(["--cov=.", "--cov-report=term-missing"])
        
        # Add JSON output
        args.extend(["--json-report", "--json-report-file=/dev/stdout"])
        
        stdout, stderr, code = await _run_command(args, self.project_root)
        
        # Parse results
        passed = 0
        failed = 0
        skipped = 0
        duration = 0.0
        coverage_percent = None
        failures = []
        
        # Try to parse JSON output
        try:
            # Find JSON in output
            json_match = re.search(r'\{.*"summary".*\}', stdout, re.DOTALL)
            if json_match:
                report = json.loads(json_match.group())
                summary = report.get("summary", {})
                passed = summary.get("passed", 0)
                failed = summary.get("failed", 0)
                skipped = summary.get("skipped", 0)
                duration = report.get("duration", 0)
                
                # Get failures
                for test in report.get("tests", []):
                    if test.get("outcome") == "failed":
                        failures.append({
                            "name": test.get("nodeid", ""),
                            "message": test.get("call", {}).get("longrepr", "")[:500]
                        })
        except (json.JSONDecodeError, AttributeError):
            # Fallback: parse text output
            passed_match = re.search(r'(\d+) passed', stdout + stderr)
            failed_match = re.search(r'(\d+) failed', stdout + stderr)
            skipped_match = re.search(r'(\d+) skipped', stdout + stderr)
            
            if passed_match:
                passed = int(passed_match.group(1))
            if failed_match:
                failed = int(failed_match.group(1))
            if skipped_match:
                skipped = int(skipped_match.group(1))
            
            # Parse duration
            duration_match = re.search(r'in ([\d.]+)s', stdout + stderr)
            if duration_match:
                duration = float(duration_match.group(1))
        
        # Parse coverage
        if coverage:
            cov_match = re.search(r'TOTAL\s+\d+\s+\d+\s+(\d+)%', stdout + stderr)
            if cov_match:
                coverage_percent = int(cov_match.group(1))
        
        return ToolResult(
            success=failed == 0 and code == 0,
            data={
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
                "duration_seconds": duration,
                "coverage_percent": coverage_percent,
                "failures": failures[:10]
            },
            error=f"{failed} test(s) failed" if failed > 0 else None
        )
    
    async def _run_jest(
        self,
        path: Optional[str],
        pattern: Optional[str],
        coverage: bool,
        verbose: bool
    ) -> ToolResult:
        """Run jest."""
        args = ["npx", "jest", "--json"]
        
        if path:
            args.append(path)
        
        if pattern:
            args.extend(["-t", pattern])
        
        if coverage:
            args.append("--coverage")
        
        if not verbose:
            args.append("--silent")
        
        stdout, stderr, code = await _run_command(args, self.project_root)
        
        passed = 0
        failed = 0
        skipped = 0
        duration = 0.0
        coverage_percent = None
        failures = []
        
        try:
            # Jest outputs JSON
            result = json.loads(stdout)
            passed = result.get("numPassedTests", 0)
            failed = result.get("numFailedTests", 0)
            skipped = result.get("numPendingTests", 0)
            
            # Get failures
            for test_result in result.get("testResults", []):
                for assertion in test_result.get("assertionResults", []):
                    if assertion.get("status") == "failed":
                        failures.append({
                            "name": assertion.get("fullName", ""),
                            "message": "\n".join(assertion.get("failureMessages", []))[:500]
                        })
            
            # Get coverage if available
            if coverage and "coverageMap" in result:
                # Simplified coverage calculation
                coverage_data = result.get("coverageMap", {})
                if coverage_data:
                    total_covered = 0
                    total_lines = 0
                    for file_data in coverage_data.values():
                        s = file_data.get("s", {})
                        total_lines += len(s)
                        total_covered += sum(1 for v in s.values() if v > 0)
                    if total_lines > 0:
                        coverage_percent = int((total_covered / total_lines) * 100)
                        
        except json.JSONDecodeError:
            # Fallback
            pass
        
        return ToolResult(
            success=failed == 0 and code == 0,
            data={
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
                "duration_seconds": duration,
                "coverage_percent": coverage_percent,
                "failures": failures[:10]
            },
            error=f"{failed} test(s) failed" if failed > 0 else None
        )


class SingleTestTool(BaseTool):
    """Run a single test."""
    
    name: str = "run_single_test"
    description: str = "Run a single test by name"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        test_name: str,
        verbose: bool = True
    ) -> ToolResult:
        """Run a specific test."""
        try:
            # Determine framework from test path
            if test_name.endswith('.py') or '::' in test_name:
                args = ["pytest", test_name, "-v", "--tb=short"]
            else:
                args = ["npx", "jest", "-t", test_name, "--verbose"]
            
            stdout, stderr, code = await _run_command(args, self.project_root)
            
            output = stdout + '\n' + stderr
            output = output[:5000]  # Limit output size
            
            return ToolResult(
                success=code == 0,
                data={
                    "passed": code == 0,
                    "output": output,
                    "duration_seconds": 0  # Would need parsing
                },
                error="Test failed" if code != 0 else None
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))

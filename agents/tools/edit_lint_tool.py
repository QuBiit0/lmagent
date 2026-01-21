"""
Edit-Lint Loop tool for LMAgent (SWE-agent style).

This composite tool edits a file and automatically runs linting,
fixing issues if possible, and optionally running related tests.
"""

from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult
from .lint_tool import PythonLintTool, PythonFormatTool, TypeScriptLintTool
from .test_tool import TestRunnerTool

logger = structlog.get_logger()


class EditLintTool(BaseTool):
    """
    Edit a file and automatically run linter.
    
    This implements the SWE-agent "edit-lint loop" pattern where
    after each file edit, the linter is automatically run and
    simple issues are auto-fixed.
    """
    
    name: str = "edit_and_lint"
    description: str = "Edit a file and automatically run linter, fixing issues if possible"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        file: str,
        content: str,
        auto_fix: bool = True,
        run_tests: bool = False
    ) -> ToolResult:
        """
        Edit file and run lint.
        
        Args:
            file: File path relative to project root
            content: New content for the file
            auto_fix: Automatically fix lint issues
            run_tests: Run related tests after edit
            
        Returns:
            ToolResult with edit status, lint results, and optional test results
        """
        try:
            file_path = self.project_root / file
            
            # 1. Write the file
            logger.info("edit_lint_write", file=file)
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text(content, encoding='utf-8')
            
            # 2. Determine file type and run appropriate linter
            lint_result = None
            lint_issues = []
            auto_fixed = []
            
            if file.endswith('.py'):
                # Python: run ruff
                lint_tool = PythonLintTool(project_root=self.project_root)
                lint_result = await lint_tool.execute(path=file, fix=auto_fix)
                
                if lint_result.success:
                    logger.info("edit_lint_passed", file=file)
                else:
                    lint_issues = lint_result.data.get("errors", [])
                    auto_fixed = [f"Fixed {lint_result.data.get('fixed', 0)} issues"]
                    logger.info(
                        "edit_lint_issues",
                        file=file,
                        issues=len(lint_issues),
                        fixed=lint_result.data.get('fixed', 0)
                    )
                
                # Also run formatter
                format_tool = PythonFormatTool(project_root=self.project_root)
                format_result = await format_tool.execute(path=file, check=False)
                if format_result.data.get("formatted"):
                    auto_fixed.append("Formatted code")
                    
            elif file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                # TypeScript/JavaScript: run eslint
                lint_tool = TypeScriptLintTool(project_root=self.project_root)
                lint_result = await lint_tool.execute(path=file, fix=auto_fix)
                
                if lint_result.success:
                    logger.info("edit_lint_passed", file=file)
                else:
                    lint_issues = lint_result.data.get("errors", [])
                    auto_fixed = [f"Fixed {lint_result.data.get('fixed', 0)} issues"]
            
            # 3. Optionally run tests
            tests_passed = None
            tests_output = None
            
            if run_tests:
                test_tool = TestRunnerTool(project_root=self.project_root)
                
                # Try to find related test file
                test_patterns = self._find_related_tests(file)
                
                if test_patterns:
                    test_result = await test_tool.execute(
                        path=test_patterns[0] if len(test_patterns) == 1 else None,
                        pattern=None
                    )
                    tests_passed = test_result.success
                    tests_output = str(test_result.data)[:2000]
            
            # 4. Re-read the file (may have been modified by auto-fix)
            final_content = file_path.read_text(encoding='utf-8')
            
            return ToolResult(
                success=True,
                data={
                    "file_updated": True,
                    "lint_passed": lint_result.success if lint_result else True,
                    "lint_issues": lint_issues[:10],
                    "auto_fixed": auto_fixed,
                    "tests_passed": tests_passed,
                    "tests_output": tests_output
                },
                metadata={
                    "file": file,
                    "content_lines": len(final_content.split('\n'))
                }
            )
            
        except Exception as e:
            logger.error("edit_lint_error", file=file, error=str(e))
            return ToolResult(success=False, error=str(e))
    
    def _find_related_tests(self, file: str) -> list[str]:
        """Find test files related to the edited file."""
        file_path = Path(file)
        stem = file_path.stem
        
        # Common test file patterns
        patterns = [
            f"tests/test_{stem}.py",
            f"test_{stem}.py",
            f"tests/{stem}_test.py",
            f"{stem}.test.ts",
            f"{stem}.test.js",
            f"__tests__/{stem}.test.ts",
            f"__tests__/{stem}.test.js",
        ]
        
        existing = []
        for pattern in patterns:
            test_path = self.project_root / pattern
            if test_path.exists():
                existing.append(pattern)
        
        return existing


class FileEditTool(BaseTool):
    """
    Edit a specific portion of a file.
    
    Similar to SWE-agent's edit command, this allows precise edits
    by specifying line numbers and replacement content.
    """
    
    name: str = "file_edit"
    description: str = "Edit specific lines in a file"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        file: str,
        start_line: int,
        end_line: int,
        new_content: str,
        auto_lint: bool = True
    ) -> ToolResult:
        """
        Edit specific lines in a file.
        
        Args:
            file: File path relative to project root
            start_line: First line to replace (1-indexed)
            end_line: Last line to replace (1-indexed, inclusive)
            new_content: Content to insert in place of removed lines
            auto_lint: Run linter after edit
            
        Returns:
            ToolResult with edit details
        """
        try:
            file_path = self.project_root / file
            
            if not file_path.exists():
                return ToolResult(success=False, error=f"File not found: {file}")
            
            # Read current content
            lines = file_path.read_text(encoding='utf-8').split('\n')
            
            # Validate line numbers
            if start_line < 1 or end_line > len(lines) or start_line > end_line:
                return ToolResult(
                    success=False,
                    error=f"Invalid line range: {start_line}-{end_line} (file has {len(lines)} lines)"
                )
            
            # Perform edit
            new_lines = new_content.split('\n')
            lines = lines[:start_line-1] + new_lines + lines[end_line:]
            
            # Write back
            new_content = '\n'.join(lines)
            file_path.write_text(new_content, encoding='utf-8')
            
            logger.info(
                "file_edit_complete",
                file=file,
                lines_removed=end_line - start_line + 1,
                lines_added=len(new_lines)
            )
            
            # Optionally run linter
            lint_result = None
            if auto_lint:
                edit_lint = EditLintTool(project_root=self.project_root)
                # Just run lint, don't re-write the file
                if file.endswith('.py'):
                    lint_tool = PythonLintTool(project_root=self.project_root)
                    lint_result = await lint_tool.execute(path=file, fix=True)
            
            return ToolResult(
                success=True,
                data={
                    "lines_before": end_line - start_line + 1,
                    "lines_after": len(new_lines),
                    "total_lines": len(lines),
                    "lint_passed": lint_result.success if lint_result else None
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))

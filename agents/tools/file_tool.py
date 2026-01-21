"""
File operation tools for LMAgent.

Provides tools for reading, writing, and searching files.
"""

from __future__ import annotations

import asyncio
import re
from pathlib import Path
from typing import List, Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult

logger = structlog.get_logger()


class FileReadTool(BaseTool):
    """Read contents of a file."""
    
    name: str = "file_read"
    description: str = "Read contents of a file with optional line range"
    project_root: Path = Field(default_factory=Path.cwd)
    max_size_bytes: int = Field(default=1_000_000)  # 1MB limit
    
    async def execute(
        self,
        path: str,
        start_line: Optional[int] = None,
        end_line: Optional[int] = None
    ) -> ToolResult:
        """
        Read file contents.
        
        Args:
            path: File path relative to project root
            start_line: Optional starting line (1-indexed)
            end_line: Optional ending line (1-indexed, inclusive)
        """
        try:
            file_path = self.project_root / path
            
            # Security: ensure path is within project
            try:
                file_path.resolve().relative_to(self.project_root.resolve())
            except ValueError:
                return ToolResult(
                    success=False,
                    error="Cannot read files outside project directory"
                )
            
            if not file_path.exists():
                return ToolResult(success=False, error=f"File not found: {path}")
            
            if not file_path.is_file():
                return ToolResult(success=False, error=f"Not a file: {path}")
            
            # Check file size
            size = file_path.stat().st_size
            if size > self.max_size_bytes:
                return ToolResult(
                    success=False,
                    error=f"File too large: {size} bytes (max: {self.max_size_bytes})"
                )
            
            content = file_path.read_text(encoding='utf-8')
            lines = content.split('\n')
            total_lines = len(lines)
            
            # Apply line range if specified
            if start_line is not None or end_line is not None:
                start = (start_line or 1) - 1  # Convert to 0-indexed
                end = end_line or total_lines
                lines = lines[start:end]
                content = '\n'.join(lines)
            
            return ToolResult(
                success=True,
                data={
                    "content": content,
                    "total_lines": total_lines,
                    "lines_returned": len(lines),
                    "path": path
                }
            )
            
        except UnicodeDecodeError:
            return ToolResult(success=False, error="File is not valid UTF-8 text")
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class FileWriteTool(BaseTool):
    """Write or modify files."""
    
    name: str = "file_write"
    description: str = "Write content to a file"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        path: str,
        content: str,
        mode: str = "overwrite"
    ) -> ToolResult:
        """
        Write to file.
        
        Args:
            path: File path relative to project root
            content: Content to write
            mode: "overwrite", "append", or "create_only"
        """
        try:
            file_path = self.project_root / path
            
            # Security: ensure path is within project
            try:
                file_path.resolve().relative_to(self.project_root.resolve())
            except ValueError:
                return ToolResult(
                    success=False,
                    error="Cannot write files outside project directory"
                )
            
            # Check mode
            if mode == "create_only" and file_path.exists():
                return ToolResult(
                    success=False,
                    error=f"File already exists: {path}"
                )
            
            # Create parent directories
            file_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Write content
            if mode == "append":
                with open(file_path, 'a', encoding='utf-8') as f:
                    f.write(content)
            else:
                file_path.write_text(content, encoding='utf-8')
            
            logger.info("file_write_complete", path=path, mode=mode)
            
            return ToolResult(
                success=True,
                data={
                    "path": path,
                    "lines": len(content.split('\n')),
                    "bytes": len(content.encode('utf-8')),
                    "mode": mode
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class FileSearchTool(BaseTool):
    """Search for patterns in files."""
    
    name: str = "file_search"
    description: str = "Search for patterns in project files (like grep)"
    project_root: Path = Field(default_factory=Path.cwd)
    max_results: int = Field(default=50)
    
    async def execute(
        self,
        pattern: str,
        path: str = ".",
        include: Optional[List[str]] = None,
        exclude: Optional[List[str]] = None,
        regex: bool = False
    ) -> ToolResult:
        """
        Search for pattern in files.
        
        Args:
            pattern: Search pattern (string or regex)
            path: Directory to search in (relative to project root)
            include: File patterns to include (e.g., ["*.py", "*.js"])
            exclude: File patterns to exclude
            regex: Treat pattern as regex
        """
        try:
            search_path = self.project_root / path
            
            if not search_path.exists():
                return ToolResult(success=False, error=f"Path not found: {path}")
            
            # Compile pattern
            if regex:
                try:
                    compiled = re.compile(pattern)
                except re.error as e:
                    return ToolResult(success=False, error=f"Invalid regex: {e}")
            else:
                compiled = None
            
            results = []
            files_searched = 0
            
            # Default excludes
            default_excludes = {
                'node_modules', '__pycache__', '.git', '.venv', 
                'venv', 'dist', 'build', '.next', '.cache'
            }
            
            for file_path in search_path.rglob('*'):
                if not file_path.is_file():
                    continue
                
                # Check excludes
                if any(ex in file_path.parts for ex in default_excludes):
                    continue
                
                if exclude:
                    if any(file_path.match(ex) for ex in exclude):
                        continue
                
                # Check includes
                if include:
                    if not any(file_path.match(inc) for inc in include):
                        continue
                
                # Search in file
                try:
                    content = file_path.read_text(encoding='utf-8')
                    files_searched += 1
                    
                    for line_num, line in enumerate(content.split('\n'), 1):
                        matched = False
                        
                        if compiled:
                            matched = bool(compiled.search(line))
                        else:
                            matched = pattern in line
                        
                        if matched:
                            rel_path = str(file_path.relative_to(self.project_root))
                            results.append({
                                "file": rel_path,
                                "line": line_num,
                                "content": line.strip()[:200]
                            })
                            
                            if len(results) >= self.max_results:
                                return ToolResult(
                                    success=True,
                                    data={
                                        "matches": results,
                                        "total_matches": len(results),
                                        "files_searched": files_searched,
                                        "truncated": True
                                    }
                                )
                except (UnicodeDecodeError, PermissionError):
                    continue
            
            return ToolResult(
                success=True,
                data={
                    "matches": results,
                    "total_matches": len(results),
                    "files_searched": files_searched,
                    "truncated": False
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class FileListTool(BaseTool):
    """List files in a directory."""
    
    name: str = "file_list"
    description: str = "List files in a directory"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        path: str = ".",
        recursive: bool = False,
        include: Optional[List[str]] = None
    ) -> ToolResult:
        """List files in directory."""
        try:
            dir_path = self.project_root / path
            
            if not dir_path.exists():
                return ToolResult(success=False, error=f"Path not found: {path}")
            
            if not dir_path.is_dir():
                return ToolResult(success=False, error=f"Not a directory: {path}")
            
            files = []
            dirs = []
            
            if recursive:
                items = dir_path.rglob('*')
            else:
                items = dir_path.iterdir()
            
            for item in items:
                # Skip hidden and common excludes
                if item.name.startswith('.'):
                    continue
                if item.name in ('node_modules', '__pycache__', 'venv', '.venv'):
                    continue
                
                rel_path = str(item.relative_to(self.project_root))
                
                if item.is_file():
                    # Check include filter
                    if include and not any(item.match(p) for p in include):
                        continue
                    
                    files.append({
                        "path": rel_path,
                        "size": item.stat().st_size
                    })
                elif item.is_dir() and not recursive:
                    dirs.append(rel_path)
            
            return ToolResult(
                success=True,
                data={
                    "files": files[:100],
                    "directories": dirs[:50],
                    "total_files": len(files),
                    "total_directories": len(dirs)
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))

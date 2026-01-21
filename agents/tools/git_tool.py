"""
Git operation tools for LMAgent.

Provides tools for all common git operations needed by agents.
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


async def _run_git(args: List[str], cwd: Path = None) -> tuple[str, str, int]:
    """Run a git command and return stdout, stderr, exit_code."""
    cmd = ["git"] + args
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        cwd=str(cwd) if cwd else None
    )
    stdout, stderr = await process.communicate()
    return (
        stdout.decode('utf-8', errors='replace').strip(),
        stderr.decode('utf-8', errors='replace').strip(),
        process.returncode
    )


class GitStatusTool(BaseTool):
    """Get current git status."""
    
    name: str = "git_status"
    description: str = "Get current git status (modified, staged, untracked files)"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(self) -> ToolResult:
        """Get git status."""
        try:
            # Get current branch
            stdout, _, _ = await _run_git(
                ["branch", "--show-current"],
                self.project_root
            )
            branch = stdout.strip()
            
            # Get status
            stdout, stderr, code = await _run_git(
                ["status", "--porcelain", "-b"],
                self.project_root
            )
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            lines = stdout.split('\n')
            
            modified = []
            staged = []
            untracked = []
            ahead = 0
            behind = 0
            
            for line in lines:
                if not line:
                    continue
                    
                if line.startswith('##'):
                    # Parse ahead/behind from branch line
                    match = re.search(r'\[ahead (\d+)', line)
                    if match:
                        ahead = int(match.group(1))
                    match = re.search(r'behind (\d+)', line)
                    if match:
                        behind = int(match.group(1))
                else:
                    status = line[:2]
                    filename = line[3:]
                    
                    if status[0] in 'MADRC':
                        staged.append(filename)
                    if status[1] in 'MD':
                        modified.append(filename)
                    if status == '??':
                        untracked.append(filename)
            
            return ToolResult(
                success=True,
                data={
                    "branch": branch,
                    "modified": modified,
                    "staged": staged,
                    "untracked": untracked,
                    "ahead": ahead,
                    "behind": behind
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class GitDiffTool(BaseTool):
    """Get diff of changes."""
    
    name: str = "git_diff"
    description: str = "Get diff of changes"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        file: Optional[str] = None,
        staged: bool = False
    ) -> ToolResult:
        """Get git diff."""
        try:
            args = ["diff"]
            if staged:
                args.append("--staged")
            if file:
                args.append(file)
            args.append("--stat")
            
            # Get stats first
            stdout, stderr, code = await _run_git(args, self.project_root)
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            # Parse stats
            lines = stdout.strip().split('\n')
            files_changed = 0
            insertions = 0
            deletions = 0
            
            if lines and lines[-1]:
                stat_line = lines[-1]
                match = re.search(r'(\d+) files? changed', stat_line)
                if match:
                    files_changed = int(match.group(1))
                match = re.search(r'(\d+) insertions?', stat_line)
                if match:
                    insertions = int(match.group(1))
                match = re.search(r'(\d+) deletions?', stat_line)
                if match:
                    deletions = int(match.group(1))
            
            # Get actual diff
            args_full = ["diff"]
            if staged:
                args_full.append("--staged")
            if file:
                args_full.append(file)
            
            diff_stdout, _, _ = await _run_git(args_full, self.project_root)
            
            return ToolResult(
                success=True,
                data={
                    "diff": diff_stdout[:10000] if len(diff_stdout) > 10000 else diff_stdout,
                    "files_changed": files_changed,
                    "insertions": insertions,
                    "deletions": deletions
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class GitAddTool(BaseTool):
    """Stage files for commit."""
    
    name: str = "git_add"
    description: str = "Stage files for commit"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        files: List[str] = Field(..., description="Files to stage")
    ) -> ToolResult:
        """Stage files."""
        try:
            args = ["add"] + files
            stdout, stderr, code = await _run_git(args, self.project_root)
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            return ToolResult(
                success=True,
                data={"staged": files}
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class GitCommitTool(BaseTool):
    """Commit staged changes."""
    
    name: str = "git_commit"
    description: str = "Commit staged changes"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        message: str = Field(..., description="Commit message"),
        amend: bool = False
    ) -> ToolResult:
        """Create a commit."""
        try:
            # Validate conventional commit format
            if not self._validate_commit_message(message):
                logger.warning("commit_message_not_conventional", message=message)
            
            args = ["commit", "-m", message]
            if amend:
                args.append("--amend")
            
            stdout, stderr, code = await _run_git(args, self.project_root)
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            # Get commit hash
            hash_stdout, _, _ = await _run_git(
                ["rev-parse", "HEAD"],
                self.project_root
            )
            
            # Count files
            files_stdout, _, _ = await _run_git(
                ["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"],
                self.project_root
            )
            files_count = len([f for f in files_stdout.split('\n') if f])
            
            return ToolResult(
                success=True,
                data={
                    "commit_hash": hash_stdout.strip()[:8],
                    "message": message,
                    "files_committed": files_count
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def _validate_commit_message(self, message: str) -> bool:
        """Check if message follows conventional commits."""
        pattern = r'^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .+'
        return bool(re.match(pattern, message))


class GitPushTool(BaseTool):
    """Push commits to remote."""
    
    name: str = "git_push"
    description: str = "Push commits to remote"
    project_root: Path = Field(default_factory=Path.cwd)
    protected_branches: List[str] = Field(default=["main", "master", "production"])
    
    async def execute(
        self,
        remote: str = "origin",
        branch: Optional[str] = None,
        force: bool = False
    ) -> ToolResult:
        """Push to remote."""
        try:
            # Get current branch if not specified
            if not branch:
                stdout, _, _ = await _run_git(
                    ["branch", "--show-current"],
                    self.project_root
                )
                branch = stdout.strip()
            
            # Block force push to protected branches
            if force and branch in self.protected_branches:
                return ToolResult(
                    success=False,
                    error=f"Force push blocked: {branch} is protected"
                )
            
            args = ["push", remote, branch]
            if force:
                args.append("--force-with-lease")  # Safer than --force
            
            stdout, stderr, code = await _run_git(args, self.project_root)
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            return ToolResult(
                success=True,
                data={
                    "remote": remote,
                    "branch": branch,
                    "forced": force
                }
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class GitBranchTool(BaseTool):
    """Create, switch, or list branches."""
    
    name: str = "git_branch"
    description: str = "Create, switch, or list branches"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        action: str = "list",
        name: Optional[str] = None,
        base: Optional[str] = None
    ) -> ToolResult:
        """Manage branches."""
        try:
            if action == "list":
                stdout, stderr, code = await _run_git(
                    ["branch", "-a"],
                    self.project_root
                )
                if code != 0:
                    return ToolResult(success=False, error=stderr)
                
                branches = []
                current = None
                for line in stdout.split('\n'):
                    if line.strip():
                        if line.startswith('*'):
                            current = line[2:].strip()
                            branches.append(current)
                        else:
                            branches.append(line.strip())
                
                return ToolResult(
                    success=True,
                    data={"branches": branches, "current": current}
                )
            
            elif action == "create":
                if not name:
                    return ToolResult(success=False, error="Branch name required")
                
                args = ["checkout", "-b", name]
                if base:
                    args.append(base)
                
                stdout, stderr, code = await _run_git(args, self.project_root)
                if code != 0:
                    return ToolResult(success=False, error=stderr)
                
                return ToolResult(
                    success=True,
                    data={"created": name, "current": name}
                )
            
            elif action == "switch":
                if not name:
                    return ToolResult(success=False, error="Branch name required")
                
                stdout, stderr, code = await _run_git(
                    ["checkout", name],
                    self.project_root
                )
                if code != 0:
                    return ToolResult(success=False, error=stderr)
                
                return ToolResult(
                    success=True,
                    data={"current": name}
                )
            
            elif action == "delete":
                if not name:
                    return ToolResult(success=False, error="Branch name required")
                
                stdout, stderr, code = await _run_git(
                    ["branch", "-d", name],
                    self.project_root
                )
                if code != 0:
                    return ToolResult(success=False, error=stderr)
                
                return ToolResult(
                    success=True,
                    data={"deleted": name}
                )
            
            else:
                return ToolResult(
                    success=False,
                    error=f"Unknown action: {action}"
                )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))


class GitLogTool(BaseTool):
    """Get commit history."""
    
    name: str = "git_log"
    description: str = "Get commit history"
    project_root: Path = Field(default_factory=Path.cwd)
    
    async def execute(
        self,
        count: int = 10,
        file: Optional[str] = None
    ) -> ToolResult:
        """Get git log."""
        try:
            args = [
                "log",
                f"-{count}",
                "--pretty=format:%H|%s|%an|%ai"
            ]
            if file:
                args.extend(["--", file])
            
            stdout, stderr, code = await _run_git(args, self.project_root)
            
            if code != 0:
                return ToolResult(success=False, error=stderr)
            
            commits = []
            for line in stdout.split('\n'):
                if line:
                    parts = line.split('|')
                    if len(parts) >= 4:
                        commits.append({
                            "hash": parts[0][:8],
                            "message": parts[1],
                            "author": parts[2],
                            "date": parts[3]
                        })
            
            return ToolResult(
                success=True,
                data=commits
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))

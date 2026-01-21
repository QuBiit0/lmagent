"""
LMAgent CLI - Command Line Interface.

Usage:
    lmagent run "Your task description"
    lmagent --config config.yaml run "Task"
    lmagent /pm "Define requirements for login system"
    lmagent /yolo /dev "Fix typo in README"
"""

from __future__ import annotations

import argparse
import asyncio
import shutil
import sys
from pathlib import Path
from typing import Optional

__version__ = "1.0.0"

import yaml
import structlog

from agents.runtime import LMAgentRuntime, AgentConfig

logger = structlog.get_logger()


def parse_commands(input_text: str) -> tuple[list[str], str]:
    """
    Parse slash commands from input.
    
    Example:
        "/yolo /dev Fix the bug" 
        -> (["yolo", "dev"], "Fix the bug")
    """
    words = input_text.split()
    commands = []
    task_start = 0
    
    for i, word in enumerate(words):
        if word.startswith('/'):
            commands.append(word[1:].lower())
            task_start = i + 1
        else:
            break
    
    task = ' '.join(words[task_start:])
    return commands, task


def load_command_aliases(project_root: Path) -> dict:
    """Load command aliases from config."""
    commands_file = project_root / "config" / "commands.yaml"
    if commands_file.exists():
        with open(commands_file) as f:
            return yaml.safe_load(f)
    return {}


def apply_commands(commands: list[str], config: dict) -> dict:
    """Apply parsed commands to configuration."""
    aliases = load_command_aliases(Path.cwd())
    alias_map = aliases.get('aliases', {})
    modes = aliases.get('modes', {})
    
    settings = {
        'personas': [],
        'workflows': [],
        'modes': [],
        'level': None
    }
    
    for cmd in commands:
        # Check if it's an alias
        resolved = alias_map.get(cmd, cmd)
        
        if resolved.startswith('persona:'):
            settings['personas'].append(resolved.split(':')[1])
        elif resolved.startswith('workflow:'):
            settings['workflows'].append(resolved.split(':')[1])
        elif resolved.startswith('mode:'):
            mode = resolved.split(':')[1]
            settings['modes'].append(mode)
        elif resolved.startswith('level:'):
            settings['level'] = int(resolved.split(':')[1])
    
    return settings


async def run(
    task: str,
    config_path: Optional[Path] = None,
    project_root: Optional[Path] = None,
    commands: Optional[list[str]] = None
) -> str:
    """Run the agent with given task."""
    # Load config
    config = None
    if config_path and config_path.exists():
        config = AgentConfig.from_yaml(config_path)
    
    # Apply command settings
    if commands:
        cmd_settings = apply_commands(commands, {})
        logger.info(
            "commands_applied",
            personas=cmd_settings['personas'],
            workflows=cmd_settings['workflows'],
            modes=cmd_settings['modes']
        )
    
    # Create runtime and run
    runtime = LMAgentRuntime(
        config=config,
        project_root=project_root or Path.cwd()
    )
    
    return await runtime.run(task)


def get_package_root() -> Path:
    """Get the root directory of the installed lmagent package."""
    return Path(__file__).parent.parent


def init_project(project_path: Path, force: bool = False) -> bool:
    """
    Initialize a project with LMAgent framework.
    
    Copies framework files to .agent/ directory and creates IDE config files.
    """
    package_root = get_package_root()
    agent_dir = project_path / ".agent"
    
    # Check if already initialized
    if agent_dir.exists() and not force:
        print("⚠️  Project already initialized. Use --force to reinitialize.")
        return False
    
    print(f"🚀 Initializing LMAgent in {project_path}")
    print(f"   Package root: {package_root}")
    
    # Create .agent directory structure
    agent_dir.mkdir(exist_ok=True)
    
    # Directories to copy into .agent/
    dirs_to_copy = ['personas', 'workflows', 'checklists', 'config', 'rules']
    
    for dir_name in dirs_to_copy:
        src = package_root / dir_name
        dst = agent_dir / dir_name
        
        if src.exists():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            print(f"   ✅ Copied {dir_name}/")
        else:
            print(f"   ⚠️  {dir_name}/ not found in package")
    
    # Copy AGENTS.md to .agent/README.md
    agents_md = package_root / "AGENTS.md"
    if agents_md.exists():
        shutil.copy(agents_md, agent_dir / "README.md")
        print("   ✅ Created .agent/README.md")
    
    # Create IDE config files in project root
    # CLAUDE.md
    claude_md = package_root / "CLAUDE.md"
    if claude_md.exists():
        shutil.copy(claude_md, project_path / "CLAUDE.md")
        print("   ✅ Created CLAUDE.md")
    
    # .cursorrules
    cursorrules = package_root / ".cursorrules"
    if cursorrules.exists():
        shutil.copy(cursorrules, project_path / ".cursorrules")
        print("   ✅ Created .cursorrules")
    
    # Create empty project rules file
    project_rules = agent_dir / "rules" / "project.md"
    if not project_rules.exists():
        project_rules.parent.mkdir(parents=True, exist_ok=True)
        project_rules.write_text("""# Project-Specific Rules

<!-- Add your project-specific rules here -->

## Stack
- Language: 
- Framework: 
- Database: 

## Conventions
- 
""")
        print("   ✅ Created .agent/rules/project.md (customize this!)")
    
    print("\n✨ LMAgent initialized successfully!")
    print("\n📁 Structure created:")
    print("   .agent/")
    print("   ├── README.md")
    print("   ├── personas/")
    print("   ├── workflows/")
    print("   ├── checklists/")
    print("   ├── config/")
    print("   └── rules/project.md  ← Add your project rules here")
    print("   CLAUDE.md")
    print("   .cursorrules")
    
    return True


def update_project(project_path: Path, keep_rules: bool = True) -> bool:
    """
    Update an existing project with latest LMAgent framework.
    
    By default, preserves user's custom rules.
    """
    agent_dir = project_path / ".agent"
    
    if not agent_dir.exists():
        print("❌ Project not initialized. Run 'lmagent init' first.")
        return False
    
    package_root = get_package_root()
    
    print(f"🔄 Updating LMAgent in {project_path}")
    
    # Backup rules if keeping them
    rules_backup = None
    if keep_rules:
        rules_dir = agent_dir / "rules"
        if rules_dir.exists():
            rules_backup = {}
            for f in rules_dir.glob("*.md"):
                rules_backup[f.name] = f.read_text()
            print(f"   📦 Backed up {len(rules_backup)} rule files")
    
    # Update directories (except rules)
    dirs_to_update = ['personas', 'workflows', 'checklists', 'config']
    
    for dir_name in dirs_to_update:
        src = package_root / dir_name
        dst = agent_dir / dir_name
        
        if src.exists():
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            print(f"   ✅ Updated {dir_name}/")
    
    # Restore rules if we backed them up
    if rules_backup:
        rules_dir = agent_dir / "rules"
        rules_dir.mkdir(exist_ok=True)
        for name, content in rules_backup.items():
            (rules_dir / name).write_text(content)
        print(f"   📦 Restored {len(rules_backup)} rule files")
    
    # Update IDE config files
    claude_md = package_root / "CLAUDE.md"
    if claude_md.exists():
        shutil.copy(claude_md, project_path / "CLAUDE.md")
        print("   ✅ Updated CLAUDE.md")
    
    cursorrules = package_root / ".cursorrules"
    if cursorrules.exists():
        shutil.copy(cursorrules, project_path / ".cursorrules")
        print("   ✅ Updated .cursorrules")
    
    print("\n✨ LMAgent updated successfully!")
    return True


def doctor(project_path: Path) -> bool:
    """Check LMAgent installation and configuration."""
    print("🩺 LMAgent Doctor\n")
    
    all_ok = True
    
    # Check package installation
    print("Package Installation:")
    package_root = get_package_root()
    print(f"   📦 Package root: {package_root}")
    print(f"   📦 Version: {__version__}")
    
    # Check project initialization
    print("\nProject Configuration:")
    agent_dir = project_path / ".agent"
    
    checks = [
        (agent_dir / "README.md", ".agent/README.md"),
        (agent_dir / "personas", ".agent/personas/"),
        (agent_dir / "workflows", ".agent/workflows/"),
        (agent_dir / "config", ".agent/config/"),
        (agent_dir / "rules", ".agent/rules/"),
        (project_path / "CLAUDE.md", "CLAUDE.md"),
        (project_path / ".cursorrules", ".cursorrules"),
    ]
    
    for path, name in checks:
        if path.exists():
            print(f"   ✅ {name}")
        else:
            print(f"   ❌ {name} (missing)")
            all_ok = False
    
    # Count resources
    print("\nResources:")
    personas_count = len(list((agent_dir / "personas").glob("*.md"))) if (agent_dir / "personas").exists() else 0
    workflows_count = len(list((agent_dir / "workflows").glob("*.md"))) if (agent_dir / "workflows").exists() else 0
    rules_count = len(list((agent_dir / "rules").glob("*.md"))) if (agent_dir / "rules").exists() else 0
    
    print(f"   👤 Personas: {personas_count}")
    print(f"   📋 Workflows: {workflows_count}")
    print(f"   📝 Rules: {rules_count}")
    
    if all_ok:
        print("\n✨ All checks passed!")
    else:
        print("\n⚠️  Some checks failed. Run 'lmagent init' to fix.")
    
    return all_ok


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="LMAgent - AI Agent Framework CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    lmagent run "List all Python files"
    lmagent run "/pm Define login requirements"
    lmagent run "/yolo /dev Fix the typo"
    lmagent --config my-config.yaml run "Complex task"
    
Use /command syntax:
    /pm     - Product Manager mode
    /dev    - Developer mode
    /yolo   - No confirmation mode
    /fix    - Bugfix workflow
        """
    )
    
    parser.add_argument(
        '--config', '-c',
        type=Path,
        help='Path to agent config YAML file'
    )
    
    parser.add_argument(
        '--project', '-p',
        type=Path,
        default=Path.cwd(),
        help='Project root directory'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Verbose output'
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Commands')
    
    # Run command
    run_parser = subparsers.add_parser('run', help='Run the agent with a task')
    run_parser.add_argument('task', nargs='+', help='Task description')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List available resources')
    list_parser.add_argument(
        'resource',
        choices=['personas', 'workflows', 'tools', 'commands'],
        help='Resource type to list'
    )
    
    # Init command
    init_parser = subparsers.add_parser('init', help='Initialize LMAgent in current project')
    init_parser.add_argument(
        '--force', '-f',
        action='store_true',
        help='Force reinitialize even if already initialized'
    )
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update LMAgent to latest version')
    update_parser.add_argument(
        '--no-keep-rules',
        action='store_true',
        help='Do not preserve custom rules (overwrite all)'
    )
    
    # Doctor command
    subparsers.add_parser('doctor', help='Check LMAgent installation and configuration')
    
    # Version command
    subparsers.add_parser('version', help='Show LMAgent version')
    
    args = parser.parse_args()
    
    if args.command == 'run':
        task_text = ' '.join(args.task)
        
        # Parse commands from task
        commands, task = parse_commands(task_text)
        
        if not task:
            print("Error: No task provided")
            sys.exit(1)
        
        # Run async
        result = asyncio.run(run(
            task=task,
            config_path=args.config,
            project_root=args.project,
            commands=commands
        ))
        
        print("\n" + "="*60)
        print("📝 Result:")
        print(result)
        
    elif args.command == 'list':
        project_root = args.project
        
        if args.resource == 'personas':
            personas_dir = project_root / 'personas'
            if personas_dir.exists():
                print("Available Personas:")
                for f in personas_dir.glob('*.md'):
                    print(f"  - {f.stem}")
                    
        elif args.resource == 'workflows':
            workflows_dir = project_root / 'workflows'
            if workflows_dir.exists():
                print("Available Workflows:")
                for f in workflows_dir.glob('*.md'):
                    print(f"  - {f.stem}")
                    
        elif args.resource == 'tools':
            print("Available Tools:")
            from agents.tools import __all__ as tools
            for tool in tools:
                if tool.endswith('Tool'):
                    print(f"  - {tool}")
                    
        elif args.resource == 'commands':
            aliases = load_command_aliases(project_root)
            print("Available Commands:")
            for cmd, target in aliases.get('aliases', {}).items():
                print(f"  /{cmd} -> {target}")
    
    elif args.command == 'init':
        init_project(args.project, force=args.force)
    
    elif args.command == 'update':
        update_project(args.project, keep_rules=not args.no_keep_rules)
    
    elif args.command == 'doctor':
        doctor(args.project)
    
    elif args.command == 'version':
        print(f"LMAgent v{__version__}")
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()

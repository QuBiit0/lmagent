import pytest
from agents.cli import __version__
from agents import cli

def test_version_exists():
    """Verify that version is defined."""
    assert __version__ is not None
    assert isinstance(__version__, str)

def test_parse_commands_simple():
    """Test parsing a single command."""
    commands, task = cli.parse_commands("/dev Fix bug")
    assert "dev" in commands
    assert task == "Fix bug"

def test_parse_commands_multiple():
    """Test parsing multiple commands."""
    commands, task = cli.parse_commands("/yolo /dev Fix bug")
    assert "yolo" in commands
    assert "dev" in commands
    assert task == "Fix bug"

def test_parse_commands_no_slash():
    """Test parsing logic when no commands are present."""
    commands, task = cli.parse_commands("Just a task")
    assert len(commands) == 0
    assert task == "Just a task"

def test_parse_commands_empty():
    """Test parsing empty string."""
    commands, task = cli.parse_commands("")
    assert len(commands) == 0
    assert task == ""

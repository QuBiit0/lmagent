import sys
from pathlib import Path
import pytest

# Add project root to pythonpath ensuring agents module is importable
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

@pytest.fixture
def project_root_path():
    """Fixture that returns the root directory of the project."""
    return project_root

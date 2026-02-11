# LMAgent Tests
# ==============
# El CLI principal es Node.js (install.js).
# Los tests unitarios del CLI deben escribirse con un framework JS (Jest, Vitest, etc.).
#
# Este archivo conftest.py se reserva para futuros tests Python
# del módulo agents/ cuando se implemente el runtime Python.

import sys
from pathlib import Path

# Add project root to pythonpath ensuring future agents module is importable
project_root = Path(__file__).parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

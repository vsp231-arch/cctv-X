"""
CCTV-X – conftest.py
Shared pytest fixtures and configuration for the test suite.
"""

import pytest


# pytest-asyncio is configured to run in "auto" mode via pyproject.toml:
#   [tool.pytest.ini_options]
#   asyncio_mode = "auto"
# This means all async test functions automatically run under asyncio.

"""
WarpTorch Jupyter Setup
Automatically adds project root to Python path for seamless imports.
"""

import sys
import os

# Get the current notebook directory and add parent to path
current_dir = os.getcwd()
project_root = os.path.dirname(current_dir)

if project_root not in sys.path:
    sys.path.insert(0, project_root)

print(f"✓ WarpTorch: Added {project_root} to Python path")

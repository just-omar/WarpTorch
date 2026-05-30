# WarpTorch Jupyter Notebooks 🧪

## Quick Setup for New Notebooks

### The Problem:
When you create a new notebook, Python can't find the `core` module because it's in the parent directory.

### The Solution:

**Option 1: Automatic (Recommended)**
Add this to the **first cell** of your notebook and run it:

```python
import sys, os
sys.path.insert(0, os.path.abspath('..'))
```

**Option 2: Docker Users**
Everything works automatically if you use `make up` - no setup needed.

---

## Available Notebooks

- `01_alcubierre_bubble_analysis.ipynb` - Complete Alcubierre warp drive simulation
- `02_schwarzschild_black_hole.ipynb` - Black hole spacetime analysis

## Tips

- Always run the setup cell first (if not using Docker)
- GPU acceleration is automatic if available
- Check `core.utils.get_best_device()` for your device

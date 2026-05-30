# Quick Start

Try WarpTorch in 3 minutes! Let's get started.

## Requirements 💻

- Python 3.10+
- (Optional) NVIDIA/AMD/Apple Silicon GPU for acceleration

## Step 1: Installation (2 minutes) 📥

### Linux/macOS:

```bash
git clone https://github.com/just-omar/WarpTorch.git
cd WarpTorch

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install PyTorch
pip install torch

# Install dependencies
pip install -r requirements.txt
```

### Windows:

```bash
git clone https://github.com/just-omar/WarpTorch.git
cd WarpTorch

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install PyTorch
pip install torch

# Install dependencies
pip install -r requirements.txt
```

### GPU acceleration (optional):

For **NVIDIA** GPU (10-100x faster):
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu121
```

For **AMD** GPU (Linux only):
```bash
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0
```

For **Apple Silicon** (M1/M2/M3):
```bash
pip install torch
# Works automatically with MPS
```

## Step 2: First simulation (30 seconds) 🫧

Run the interactive menu:

```bash
python run_simulation.py
```

You'll see a menu:

```
🫧 WarpTorch Simulation Runner
=============================

Select simulation:
  ▸ Alcubierre Warp Bubble
    Lentz Soliton (positive energy)
    Schwarzschild Black Hole
    Van Den Broeck Bubble
    Minkowski Space (flat)

[↑↓] Navigate  |  [Enter] Run  |  [q] Quit
```

**Select "Alcubierre Warp Bubble"** → press Enter → wait 5 seconds...

**Done!**

Simulation saved in `output/` folder.

## Step 3: Visualization (30 seconds) 📊

Launch Jupyter Lab:

```bash
jupyter lab
```

**⚠️ Setup for new notebooks:** Add this to your **first cell**:

```python
import sys, os
sys.path.insert(0, os.path.abspath('..'))
```

Then create a new cell and enter:

```python
import torch
import plotly.graph_objects as go
import numpy as np

from core.metrics.alcubierre import get_alcubierre_metric
from core.solver.energy import get_energy_tensor
from core.visualizer.slicing import get_2d_slice
from core.utils import get_best_device

# Setup
device = get_best_device()
grid_size = (1, 64, 64, 64)
grid_scale = (0.1, 0.5, 0.5, 0.5)
world_center = (0.0, 16.0, 16.0, 16.0)

# Create a warp bubble
metric = get_alcubierre_metric(
    grid_size=grid_size,
    world_center=world_center,
    v=1.5,                          # 1.5x speed of light
    R=6.0,                          # bubble radius
    sigma=2.0,                       # wall thickness
    grid_scale=grid_scale,
    device=device
)

# Calculate energy
energy = get_energy_tensor(metric)

# Visualize as interactive 2D slice
energy_slice = get_2d_slice(energy, component=(0, 0), slice_plane='xy')

# Create coordinate axes
x_coords = (np.arange(grid_size[1]) * grid_scale[1]) - world_center[1]
y_coords = (np.arange(grid_size[2]) * grid_scale[2]) - world_center[2]

fig = go.Figure(data=go.Heatmap(
    z=energy_slice.T, x=x_coords, y=y_coords,
    colorscale='RdBu', zmid=0,
    colorbar=dict(title="Energy Density")
))
fig.update_layout(
    title="Warp Bubble Energy Density",
    xaxis_title="X (Meters)", yaxis_title="Y (Meters)"
)
fig.show()
```

**You'll see a beautiful interactive visualization of the warp bubble's energy density!**

## What's next? ➡️

### Try different parameters:

```python
# Slow warp (v=0.5)
metric = get_alcubierre_metric(v=0.5, R=6.0)

# Fast warp (v=3.0)
metric = get_alcubierre_metric(v=3.0, R=8.0)

# Large bubble (R=10)
metric = get_alcubierre_metric(v=1.5, R=10.0)
```

### Try different metrics:

```python
from core.metrics.lentz import get_lentz_metric
from core.metrics.schwarzschild import get_schwarzschild_metric

# Lentz soliton (positive energy)
lentz = get_lentz_metric(v=2.0)

# Black hole
black_hole = get_schwarzschild_metric(M=10.0)
```

## Having trouble? 🤔

### GPU not found?

```bash
# Check GPU availability
python -c "import torch; print(torch.cuda.is_available())"

# If False — use CPU (slower, but works!)
device = torch.device("cpu")
```

### Installation errors?

```bash
# Try upgrading pip
pip install --upgrade pip

# Or use conda
conda install pytorch
```

### ImportError?

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## Next steps 📚

Now that you've run your first simulation:

1. **Check out examples in Jupyter notebooks:**
   ```bash
   jupyter lab jupyter_notebooks/01_alcubierre_bubble_analysis.ipynb
   ```

   **💡 For new experiments:** Use the `_template.ipynb` template in `jupyter_notebooks/` - all imports are pre-configured!

2. **Study the API for advanced usage:**
   [API Reference](/docs/api/metrics)

3. **Join the community:**
   - [GitHub](https://github.com/just-omar/WarpTorch) — Star the repository
   - [Issues](https://github.com/just-omar/WarpTorch/issues) — Report bugs or suggest features
   - [Discussions](https://github.com/just-omar/WarpTorch/discussions) — Ask questions

---

**Congratulations!** You're now part of the warp drive research community!

**Let's make warp drives a reality together!**
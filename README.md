# WarpTorch 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch GPU](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![CUDA Acceleration](https://img.shields.io/badge/CUDA-Accelerated-green.svg)](https://developer.nvidia.com/cuda-toolkit)

![WarpTorch Demo](https://raw.githubusercontent.com/just-omar/WarpTorch/main/documentation/static/img/Warptoch-demo.gif)

**WarpTorch** is a high-performance, GPU-accelerated General Relativity (GR) toolkit designed for simulating, analyzing, and visualizing warp drive spacetimes. By porting and optimizing numerical relativity methods to modern tensor frameworks, WarpTorch enables physicists and enthusiasts to solve Einstein's field equations and evaluate exotic geometries at unprecedented speeds using NVIDIA CUDA, AMD ROCm, and Intel Arc hardware.

---

## 🌟 Key Features

- **Massive Acceleration:** Replaces nested MATLAB CPU loops with highly optimized PyTorch tensor computations (`torch.meshgrid`, `torch.einsum`), executing 4D spacetime operations directly on GPU Tensor Cores.
- **Comprehensive Metric Library:** Native vectorized implementations of classical and novel warp metrics, including Alcubierre, Lentz (positive energy soliton), Van Den Broeck, and Schwarzschild geometries.
- **Advanced Field Solvers:** 4th-order central finite difference stencils for computing arbitrary metric derivatives, Christoffel symbols, Ricci tensors, and scalar curvature.
- **Spacetime Flow Diagnostics:** Instantaneous evaluation of kinematic scalars (Expansion, Shear, Vorticity) and rigorous energy condition validation maps (NEC, WEC, SEC).
- **Web-Ready Export Pipeline:** Lightweight 2D slice and 3D vector field JSON exporters designed for immediate integration with WebGL frontends (Three.js / React Three Fiber).

---

## ✅ Prerequisites Check

**Before installing WarpTorch, verify your system has the required software:**

```bash
# Check Python version (need 3.10+)
python --version
# OR
python3 --version

# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

**If any command fails, install the missing software:**
- **Python 3.10+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)

---

## ⚙️ Installation & Setup

Choose your installation method based on how you plan to use WarpTorch:

- **🎯 Method A: Web Interface** - Interactive 3D visualization in your browser 
- **🔬 Method B: Jupyter Lab** - Direct Python programming for custom analysis 

Both methods require the same initial setup steps below.

---

## 📥 Initial Setup (Required for Both Methods)

### Step 1: Clone and Navigate to Project

```bash
git clone https://github.com/just-omar/WarpTorch.git
cd WarpTorch
```

### Step 2: Create Virtual Environment

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install PyTorch for Your Hardware

Choose the option that matches your hardware:

**For CPU-only (universal, works everywhere):**
```bash
pip install torch
```

**For NVIDIA GPU with CUDA 12.1+ (faster):**
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu121
```

**For AMD GPU (ROCm 6.0, Linux only):**
```bash
pip install torch --index-url https://download.pytorch.org/whl/rocm6.0
```

**For macOS (Apple Silicon M1/M2/M3):**
```bash
pip install torch
```

**For Intel GPU (Arc):**
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/test/xpu
```

### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

This installs numpy, plotly, rich, jupyterlab, fastapi, and other dependencies.

**✅ Verify torch installation:**
```bash
python -c "import torch; print(f'PyTorch {torch.__version__} installed successfully')"
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"
```

---

## 🎯 Method A: Web Interface Installation

After completing Initial Setup, continue with these steps:

### Step 5: Frontend Setup


**Install Node.js dependencies:**

```bash
cd frontend  # From project root

npm install
```

### Step 6: Run the Application

**Terminal 1 - Start Backend (from project root with venv active):**

```bash
# Make sure you're in WarpTorch/ folder and venv is activated
cd WarpTorch
venv\Scripts\activate     # Windows

# source venv/bin/activate  # Linux/macOS


python backend/main.py
```

Backend will run on: `http://localhost:8099`

**Terminal 2 - Start Frontend (from frontend/ folder):**

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3005`

**Open your browser to:** `http://localhost:3005`

---

## 🔬 Method B: Jupyter Lab Installation

After completing Initial Setup, simply launch Jupyter Lab:

### Step 5: Launch Jupyter Lab

```bash
jupyter lab
```

**Jupyter Lab will automatically open in your browser at:** `http://localhost:8888`


---

## 🚀 Quickstart Commands

**For Web Interface (2 terminals):**

```bash
# Terminal 1 - Backend
cd WarpTorch
source venv/bin/activate           # Linux/macOS
python backend/main.py             # Runs on http://localhost:8099

# Terminal 2 - Frontend
cd WarpTorch/frontend
npm install
npm run dev                        # Runs on http://localhost:3005
```

**For Jupyter Lab:**

```bash
cd WarpTorch
source venv/bin/activate           # Linux/macOS
jupyter lab                         # Opens at http://localhost:8888

# Or open specific notebook:
jupyter lab jupyter_notebooks/01_alcubierre_bubble_analysis.ipynb
```

---

## 💡 Usage Examples

### Programmatic Usage Example

```python
import torch
from core.metrics.alcubierre import get_alcubierre_metric
from core.solver.energy import get_energy_tensor
from core.analyzer.scalars import get_kinematic_scalars

# Automatically choose CUDA GPU if accessible
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize a warp drive bubble moving at 1.5 times the speed of light
metric = get_alcubierre_metric(
    grid_size=(1, 64, 64, 64),
    world_center=(0.0, 16.0, 16.0, 16.0),
    v=1.5,
    R=6.0,
    sigma=4.0,
    device=device
)

# Solve Einstein's equations to find required stress-energy constraints
energy_tensor = get_energy_tensor(metric)

# Extract expansion and contraction metrics of the warp bubble
scalars = get_kinematic_scalars(metric)

print("Simulation successful! Active device:", energy_tensor.device)
```

---

## 🎮 Hardware Acceleration Guide

**WarpTorch automatically adapts to your available hardware:**

### Supported GPU Configurations

| GPU Type | Support Level | Performance | Platform |
|----------|---------------|-------------|----------|
| **NVIDIA (CUDA 12.1+)** | ✅ Best | 10-100x faster | Win/Linux/Mac |
| **AMD (ROCm 6.0)** | ✅ Good | 5-50x faster | Linux only |
| **Apple Silicon** | ✅ Good | 3-20x faster | macOS only |
| **Intel Arc** | ⚠️ Experimental | 2-10x faster | Win/Linux |
| **CPU-only** | ✅ Universal | Baseline | All platforms |

### Performance Tips

**For maximum performance (NVIDIA GPU):**
- Requires: NVIDIA GPU + CUDA 12.1+ drivers
- Check with: `nvidia-smi` command

**For AMD GPU (Linux only):**
- Requires: AMD GPU + ROCm 6.0 drivers
- Check with: `rocm-smi` command

**For Mac users (Apple Silicon):**
- Uses Metal Performance Shaders (MPS) automatically
- Check with: `python -c "import torch; print(torch.backends.mps.is_available())"`

**For Intel GPU:**
- Requires: Latest Intel GPU drivers
- Check with: `python -c "import torch; print(torch.xpu.is_available())"`

---

## 🎮 Interactive Simulation Runner

**Run spacetime simulations directly from terminal with interactive menu:**

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# OR
venv\Scripts\activate     # Windows

# Launch interactive simulation menu
python run_simulation.py
```

**Available simulations:**
- **alcubierre** - Classic warp drive bubble (Alcubierre 1994)
- **lentz** - Positive energy soliton (Lentz 2021)
- **schwarzschild** - Black hole spacetime
- **vandenbroeck** - Modified micro-bubble
- **minkowski** - Flat vacuum baseline

**Features:**
- Interactive selection menu with arrow keys
- Batch mode (run all simulations)
- Real-time progress tracking
- Automatic JSON export to `output/` directory
- GPU acceleration detection

---

## 🐳 Docker Alternative (Optional)

**If you prefer Docker over native installation, use the Makefile:**

```bash
# Quick start
make up              # Start all services
make logs            # View logs
make down            # Stop services
make restart         # Restart services
make clean           # Clean up everything

# Hardware detection & installation
make detect          # Detect hardware and show recommended installation
make install         # Auto-install based on detected hardware
make install-cpu     # Install CPU-only version
make install-cuda    # Install NVIDIA CUDA version

# Docker builds
make docker-build       # Build with auto-detect hardware
make docker-build-cpu   # Build CPU-only Docker image
make docker-build-cuda  # Build CUDA-enabled Docker image
```

**Hardware switching (requires rebuild):**
```bash
make use-cpu   # Switch to CPU version (lightweight, ~200MB)
make use-cuda  # Switch to CUDA version (large, ~2-5GB)
```

**Services will run on:**
- Frontend: `http://localhost:3005`
- Backend: `http://localhost:8099`
- API Docs: `http://localhost:8099/docs`

**⚠️ Note:** Native installation (Methods A & B above) is recommended for most users - simpler setup and better performance.

**🐳 Jupyter Notebooks Permissions Fix:**

If you encounter "Permission denied" errors when creating new notebooks in Jupyter, fix the permissions:

```bash
# Make jupyter_notebooks directory writable for all users
chmod 777 jupyter_notebooks/

# Or restart jupyter container after fixing permissions
docker-compose restart jupyter
```

This ensures the Jupyter container (running as user `jovyan`) can create and edit notebooks.

---

## 📜 Credits & Attributions

WarpTorch is a modern, rewritten Python/PyTorch port of the pioneering open-source MATLAB project WarpFactory developed by Jared Fuchs, Christopher Helmerich, Alexey Bobrick, Gianni Martire, Brandon Melcher, and Luke Sellers.

We owe immense credit to the original authors for formulating the underlying finite difference architecture, frame transfer algebra, and numerical relativity workflows that drive this software.

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

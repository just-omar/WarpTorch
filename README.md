# WarpTorch 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![PyTorch GPU](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)

![WarpTorch Demo](https://raw.githubusercontent.com/just-omar/WarpTorch/main/documentation/static/img/Warptoch-demo.gif)

**WarpTorch** is a high-performance GPU-accelerated toolkit for simulating warp drive spacetimes. Solve Einstein's field equations in real-time using NVIDIA CUDA, AMD ROCm, or Intel Arc hardware.

---

## 🌟 What is it?

- **GPU Acceleration:** Replace slow CPU loops with fast GPU computations (10-100x speed)
- **Metric Library:** Alcubierre, Lentz, Van Den Broeck, Schwarzschild spacetimes
- **Web Interface:** Interactive 3D visualization in your browser
- **Jupyter Notebooks:** Custom analysis and code exploration

---

## 🚀 Quick Start

### Linux / macOS (Docker - Easiest Way)

```bash
git clone https://github.com/just-omar/WarpTorch.git
cd WarpTorch

# Start everything with one command
make up              # detects GPU, builds images, starts all services

# Or see all available commands
make help
```

Open `http://localhost:3005` in your browser.

### Linux / macOS / Windows (Without Docker)

```bash
git clone https://github.com/just-omar/WarpTorch.git
cd WarpTorch

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate       # Linux/macOS

# Install dependencies
pip install torch
pip install -r requirements.txt

# Start backend (Terminal 1)
python backend/main.py

# Start frontend (Terminal 2)
cd frontend
npm install
npm run dev

# OR start Jupyter Lab (Terminal 3)
jupyter lab

# OR start documentation (Terminal 4)
cd documentation
npm install
npm run start
```

**Available interfaces:**
- Frontend: `http://localhost:3005`
- Backend API: `http://localhost:8099`
- Jupyter Lab: `http://localhost:8888` (password: `warptorch`)
- Documentation: `http://localhost:3000`



---

## 🤝 Contributing

**Tech stack by component:**
- **Backend** (`core/`, `backend/`) - Python, PyTorch, FastAPI
- **Frontend** (`frontend/`) - React, Three.js, React Three Fiber
- **Documentation** (`documentation/`) - Docusaurus, MDX
- **Notebooks** (`jupyter_notebooks/`) - Jupyter Lab, Python

---

### 🌱 How to Contribute (Step-by-Step)

#### 📝 Fix a typo or small edit
**The easiest way - no coding needed:**
1. Click "Edit this file" button on GitHub
2. Make your changes
3. Click "Propose changes" → "Create Pull Request"

#### 💻 Contribute code
**Full workflow with git:**
```bash
# 1. Fork the repo (top right button)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/WarpTorch.git
cd WarpTorch

# 3. Create branch for your change
git checkout -b fix/amazing-feature

# 4. Make changes, test them
# 5. Commit and push
git add .
git commit -m "Fix: brief description of changes"
git push origin fix/amazing-feature

# 6. Open Pull Request on GitHub
```

#### ✨ Contribution Tips
- 🎯 **Keep it small** - One PR = one improvement
- 📝 **Be clear** - Describe what and why
- 🧪 **Test it** - Make sure nothing breaks
- 💬 **Ask freely** - Questions welcome in Issues

---

### 👥 Find Your Role

#### 👨‍💻 Frontend Developers
**Improve:** `frontend/` - React, Three.js, 3D visualizations, UI/UX
- Enhance 3D warp bubble rendering
- Add interactive controls and animations
- Improve responsive design and performance

#### ⚙️ Backend Developers
**Improve:** `core/`, `backend/` - Python, PyTorch, FastAPI, GPU computing
- Optimize tensor operations and GPU kernels
- Add new API endpoints and features
- Improve computation performance

#### 🔬 Physicists & Scientists
**Improve:** `core/`, `jupyter_notebooks/` - Spacetime metrics, GR equations, analysis
- Implement novel warp drive metrics
- Add energy condition validations
- Create physics tutorials and examples

#### 📊 Data Scientists / ML Engineers
**Improve:** `jupyter_notebooks/`, `core/` - PyTorch optimization, analysis workflows
- Optimize GPU memory usage
- Add advanced analysis notebooks
- Improve numerical solvers

---

**🚀 Ready?** Pick your role, follow the steps, and make your first contribution!


---

## 📜 Credits

WarpTorch is a modern Python/PyTorch port of the pioneering open-source MATLAB project WarpFactory developed by Jared Fuchs, Christopher Helmerich, Alexey Bobrick, Gianni Martire, Brandon Melcher, and Luke Sellers.

We owe immense credit to the original authors for formulating the underlying finite difference architecture, frame transfer algebra, and numerical relativity workflows that drive this software.

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

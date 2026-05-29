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

Contributions are welcome! We're looking for help with:

- **New metrics** - Implement novel spacetime geometries
- **Visualization** - Improve 3D rendering and interactive plots  
- **Performance** - Optimize GPU kernels and tensor operations
- **Documentation** - Write tutorials and examples
- **Bug fixes** - Fix issues and improve stability

**Tech stack by component:**
- **Backend** (`core/`, `backend/`) - Python, PyTorch, FastAPI
- **Frontend** (`frontend/`) - React, Three.js, React Three Fiber  
- **Documentation** (`documentation/`) - Docusaurus, MDX
- **Notebooks** (`jupyter_notebooks/`) - Jupyter Lab, Python

**Getting started:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Open a Pull Request

**First time contributors welcome!** Feel free to ask questions in Issues.


---

## 📜 Credits

WarpTorch is a modern Python/PyTorch port of the pioneering open-source MATLAB project WarpFactory developed by Jared Fuchs, Christopher Helmerich, Alexey Bobrick, Gianni Martire, Brandon Melcher, and Luke Sellers.

We owe immense credit to the original authors for formulating the underlying finite difference architecture, frame transfer algebra, and numerical relativity workflows that drive this software.

---

## 📄 License

This project is licensed under the MIT License — see the `LICENSE` file for details.

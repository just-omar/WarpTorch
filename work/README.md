# WarpTorch Jupyter Workspace

This directory contains Jupyter notebooks for analyzing WarpTorch simulation data.

## Getting Started

1. Start the Jupyter service:
   ```bash
   docker-compose up jupyter
   ```

2. Access Jupyter Lab at:
   ```
   http://localhost:8888
   ```
   Use the token from your `.env` file (default: `warptorch`)

## Available Data

- **Simulation Data**: `/home/jovyan/simulation_data` - Raw simulation outputs
- **Results Database**: `/home/jovyan/simulations.db` - SQLite database with simulation metadata
- **Output Files**: `/home/jovyan/output` - Processed results and exports
- **Core Code**: `/home/jovyan/core` - Read-only access to core physics engine

## Example Analysis Tasks

- Load and visualize simulation results
- Compare different warp metric configurations
- Analyze energy density distributions
- Generate plots for research papers
- Export data to various formats (CSV, HDF5, etc.)

## Python Environment

The Jupyter container includes:
- NumPy, SciPy, Pandas
- Matplotlib, Seaborn
- Scikit-learn
- HDF5 support
- SQLite3 support

Create your notebooks here and start analyzing your warp drive simulations!
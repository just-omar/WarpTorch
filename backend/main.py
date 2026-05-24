from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import numpy as np
import sys
import os
from dotenv import load_dotenv

# Load .env from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Add parent directory to path for WarpTorch module imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.metrics.alcubierre import get_alcubierre_metric
from core.metrics.lentz import get_lentz_metric
from core.metrics.vandenbroeck import get_vandenbroeck_metric
from core.solver.energy import get_energy_tensor
from core.solver.autodiff_curvature import get_christoffel_symbols, AutodiffCurvatureSolver
from core.visualizer.slicing import get_2d_slice
from core.utils import get_best_device

# Import database and storage
from database import SimulationDatabase, SimulationRecord, get_database
from storage import SimulationStorage, get_storage

app = FastAPI(title="WarpTorch API")

# Initialize database and storage
db = get_database()
storage = get_storage()

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3005").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AlcubierreParams(BaseModel):
    velocity: float = 1.5
    radius: float = 6.0
    sigma: float = 4.0
    gridSize: int = 96
    method: str = "finite_diff"  # "finite_diff" or "autodiff"

class LentzParams(BaseModel):
    velocity: float = 1.5
    scale: float = 8.0
    gridSize: int = 96
    method: str = "finite_diff"

class VanDenBroeckParams(BaseModel):
    velocity: float = 1.5
    R1: float = 4.0  # Inner bubble radius
    sigma1: float = 3.0  # Inner boundary thickness
    R2: float = 6.0  # Outer bubble radius
    sigma2: float = 4.0  # Outer boundary thickness
    A: float = 1.0  # Expansion factor
    gridSize: int = 96
    method: str = "finite_diff"

@app.get("/")
async def root():
    return {"message": "WarpTorch API - General Relativity Simulator"}

@app.get("/health")
async def health_check():
    device = get_best_device()
    return {
        "status": "healthy",
        "device": str(device),
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health():
    device = get_best_device()
    return {
        "status": "healthy",
        "device": str(device),
        "version": "1.0.0"
    }

# ================================================================
# SIMULATION HISTORY & MANAGEMENT ENDPOINTS
# ================================================================

@app.get("/api/simulations")
async def get_simulations(
    limit: int = 50,
    metric_type: Optional[str] = None
):
    """Get simulation history."""
    simulations = db.get_recent_simulations(limit=limit, metric_type=metric_type)
    return {
        "success": True,
        "simulations": [
            {
                "id": sim.id,
                "timestamp": sim.timestamp,
                "metric_type": sim.metric_type,
                "params": sim.params,
                "statistics": sim.statistics,
                "energy_condition": sim.energy_condition,
                "method": sim.method,
                "grid_size": sim.grid_size,
                "notes": sim.notes,
                "tags": sim.tags,
                "rating": sim.rating
            }
            for sim in simulations
        ]
    }

@app.get("/api/simulations/{sim_id}")
async def get_simulation(sim_id: int):
    """Get a specific simulation by ID."""
    record = db.get_simulation(sim_id)
    if not record:
        raise HTTPException(status_code=404, detail="Simulation not found")

    # Load full data if available
    full_data = None
    if record.file_path and os.path.exists(record.file_path):
        try:
            full_data = storage.load_simulation_data(record.file_path)
        except Exception as e:
            print(f"Warning: Could not load full data: {e}")

    return {
        "success": True,
        "simulation": {
            "id": record.id,
            "timestamp": record.timestamp,
            "metric_type": record.metric_type,
            "params": record.params,
            "statistics": record.statistics,
            "energy_condition": record.energy_condition,
            "method": record.method,
            "grid_size": record.grid_size,
            "notes": record.notes,
            "tags": record.tags,
            "rating": record.rating,
            "file_path": record.file_path
        },
        "full_data": full_data
    }

@app.put("/api/simulations/{sim_id}")
async def update_simulation(
    sim_id: int,
    notes: Optional[str] = None,
    tags: Optional[str] = None,
    rating: Optional[int] = None
):
    """Update simulation metadata (notes, tags, rating)."""
    success = db.update_simulation(sim_id, notes=notes, tags=tags, rating=rating)
    if not success:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {"success": True, "message": "Simulation updated"}

@app.delete("/api/simulations/{sim_id}")
async def delete_simulation(sim_id: int):
    """Delete a simulation and its data file."""
    success = db.delete_simulation(sim_id)
    if not success:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {"success": True, "message": "Simulation deleted"}

@app.get("/api/simulations/top-rated")
async def get_top_rated(limit: int = 10):
    """Get top-rated simulations."""
    simulations = db.get_top_rated(limit=limit)
    return {
        "success": True,
        "simulations": [
            {
                "id": sim.id,
                "timestamp": sim.timestamp,
                "metric_type": sim.metric_type,
                "params": sim.params,
                "statistics": sim.statistics,
                "rating": sim.rating,
                "notes": sim.notes,
                "tags": sim.tags
            }
            for sim in simulations
        ]
    }

@app.get("/api/simulations/search")
async def search_simulations(query: str, metric_type: Optional[str] = None):
    """Search simulations by tags, notes, or params."""
    simulations = db.search_simulations(query, metric_type=metric_type)
    return {
        "success": True,
        "simulations": [
            {
                "id": sim.id,
                "timestamp": sim.timestamp,
                "metric_type": sim.metric_type,
                "params": sim.params,
                "statistics": sim.statistics,
                "notes": sim.notes,
                "tags": sim.tags,
                "rating": sim.rating
            }
            for sim in simulations
        ]
    }

@app.get("/api/simulations/stats/overview")
async def get_statistics():
    """Get database statistics."""
    stats = db.get_statistics()
    return {"success": True, "statistics": stats}

@app.post("/api/simulations/{sim_id}/export")
async def export_simulation(sim_id: int, format: str = "json"):
    """Export simulation data for analysis."""
    record = db.get_simulation(sim_id)
    if not record:
        raise HTTPException(status_code=404, detail="Simulation not found")

    # Load data
    if record.file_path and os.path.exists(record.file_path):
        data = storage.load_simulation_data(record.file_path)
    else:
        raise HTTPException(status_code=404, detail="Data file not found")

    # Export
    try:
        export_path = storage.export_for_comparison(sim_id, data, format=format)
        return {
            "success": True,
            "export_path": export_path,
            "format": format
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

# ================================================================
# SIMULATION ENDPOINTS WITH AUTO-SAVE
# ================================================================

@app.post("/api/simulate/alcubierre")
async def simulate_alcubierre(params: AlcubierreParams, save: bool = True):
    """
    Run Alcubierre warp bubble simulation with optional auto-save.

    Args:
        params: Simulation parameters
        save: If True, save results to database (default: True)
    """
    try:
        # Get device for computations
        device = get_best_device()

        # Create Alcubierre metric
        metric_tensor = get_alcubierre_metric(
            grid_size=(1, params.gridSize, params.gridSize, params.gridSize),
            grid_scale=(0.1, 0.5, 0.5, 0.5),
            world_center=(0.0, params.gridSize // 2, params.gridSize // 2, params.gridSize // 2),
            v=params.velocity,
            R=params.radius,
            sigma=params.sigma,
            device=device
        )

        # Compute stress-energy tensor
        energy_tensor = get_energy_tensor(metric_tensor)

        # Get 2D slice for visualization
        t00_slice = get_2d_slice(energy_tensor, component=(0, 0), slice_plane='xy')

        # get_2d_slice already returns numpy array, so we use it directly
        t00_numpy = t00_slice

        # Compute statistics
        energy_stats = {
            "min": float(np.min(t00_numpy)),
            "max": float(np.max(t00_numpy)),
            "mean": float(np.mean(t00_numpy)),
            "std": float(np.std(t00_numpy))
        }

        # Prepare full data for storage
        full_data = {
            "energy_density": t00_numpy,
            "metric_tensor": metric_tensor.tensor.cpu().numpy() if hasattr(metric_tensor.tensor, 'cpu') else metric_tensor.tensor,
            "energy_tensor": energy_tensor.tensor.cpu().numpy() if hasattr(energy_tensor.tensor, 'cpu') else energy_tensor.tensor,
            "grid_scaling": metric_tensor.grid_scaling
        }

        # Save to database and storage if requested
        sim_id = None
        if save:
            # Save full data to file
            file_path = storage.save_simulation_data(
                metric_type="alcubierre",
                params=params.model_dump(),
                data=full_data,
                save_full_data=True
            )

            # Create database record
            record = SimulationRecord(
                metric_type="alcubierre",
                params=params.model_dump(),
                statistics=energy_stats,
                energy_condition="Negative (requires exotic matter)",
                method=params.method,
                grid_size=list(t00_numpy.shape),
                file_path=file_path,
                tags=f"velocity={params.velocity},radius={params.radius}"
            )

            sim_id = db.save_simulation(record)

        # Prepare data for transmission (sample for performance)
        sample_rate = max(1, params.gridSize // 64)  # Max 64x64 points
        sampled_data = t00_numpy[::sample_rate, ::sample_rate].tolist()

        return {
            "success": True,
            "simulation_id": sim_id,
            "params": params.model_dump(),
            "statistics": energy_stats,
            "grid_size": list(t00_numpy.shape),
            "data": sampled_data,
            "metadata": {
                "metric": "Alcubierre (1994)",
                "description": "Classic superluminal warp bubble",
                "energy_condition": "Negative (requires exotic matter)",
                "method": params.method,
                "saved": save and sim_id is not None
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.post("/api/simulate/lentz")
async def simulate_lentz(params: LentzParams):
    try:
        # Get device for computations
        device = get_best_device()

        # Create Lentz metric
        metric_tensor = get_lentz_metric(
            grid_size=(1, params.gridSize, params.gridSize, params.gridSize),
            grid_scale=(0.1, 0.5, 0.5, 0.5),
            world_center=(0.0, params.gridSize // 2, params.gridSize // 2, params.gridSize // 2),
            v=params.velocity,
            scale=params.scale,
            device=device
        )

        # Compute stress-energy tensor
        energy_tensor = get_energy_tensor(metric_tensor)

        # Get 2D slice for visualization
        t00_slice = get_2d_slice(energy_tensor, component=(0, 0), slice_plane='xy')

        # get_2d_slice already returns numpy array, so we use it directly
        t00_numpy = t00_slice

        # Compute statistics
        energy_stats = {
            "min": float(np.min(t00_numpy)),
            "max": float(np.max(t00_numpy)),
            "mean": float(np.mean(t00_numpy)),
            "std": float(np.std(t00_numpy))
        }

        # Prepare data for transmission (sample for performance)
        sample_rate = max(1, params.gridSize // 64)  # Max 64x64 points
        sampled_data = t00_numpy[::sample_rate, ::sample_rate].tolist()

        return {
            "success": True,
            "params": params.model_dump(),
            "statistics": energy_stats,
            "grid_size": list(t00_numpy.shape),
            "data": sampled_data,
            "metadata": {
                "metric": "Lentz (2021)",
                "description": "Positive energy warp soliton",
                "energy_condition": "Positive (satisfies energy conditions)",
                "method": params.method
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.post("/api/simulate/vandenbroeck")
async def simulate_vandenbroeck(params: VanDenBroeckParams):
    try:
        # Get device for computations
        device = get_best_device()

        # Create Van Den Broeck metric
        metric_tensor = get_vandenbroeck_metric(
            grid_size=(1, params.gridSize, params.gridSize, params.gridSize),
            grid_scale=(0.1, 0.5, 0.5, 0.5),
            world_center=(0.0, params.gridSize // 2, params.gridSize // 2, params.gridSize // 2),
            v=params.velocity,
            R1=params.R1,
            sigma1=params.sigma1,
            R2=params.R2,
            sigma2=params.sigma2,
            A=params.A,
            device=device
        )

        # Compute stress-energy tensor
        energy_tensor = get_energy_tensor(metric_tensor)

        # Get 2D slice for visualization
        t00_slice = get_2d_slice(energy_tensor, component=(0, 0), slice_plane='xy')

        # get_2d_slice already returns numpy array, so we use it directly
        t00_numpy = t00_slice

        # Compute statistics
        energy_stats = {
            "min": float(np.min(t00_numpy)),
            "max": float(np.max(t00_numpy)),
            "mean": float(np.mean(t00_numpy)),
            "std": float(np.std(t00_numpy))
        }

        # Prepare data for transmission (sample for performance)
        sample_rate = max(1, params.gridSize // 64)  # Max 64x64 points
        sampled_data = t00_numpy[::sample_rate, ::sample_rate].tolist()

        return {
            "success": True,
            "params": params.model_dump(),
            "statistics": energy_stats,
            "grid_size": list(t00_numpy.shape),
            "data": sampled_data,
            "metadata": {
                "metric": "Van Den Broeck (1999)",
                "description": "Microscopic Alcubierre bubble with expanded internal volume",
                "energy_condition": "Negative (requires exotic matter)",
                "method": params.method
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.get("/api/metrics")
async def get_metrics():
    return {
        "metrics": [
            {
                "id": "alcubierre",
                "name": "Alcubierre (1994)",
                "description": "Classic superluminal warp bubble",
                "status": "available"
            },
            {
                "id": "lentz",
                "name": "Lentz Soliton (2021)",
                "description": "Positive energy density",
                "status": "available"
            },
            {
                "id": "vandenbroeck",
                "name": "Van Den Broeck (1999)",
                "description": "Microscopic warp bubble with expanded internal volume",
                "status": "available"
            },
            {
                "id": "schwarzschild",
                "name": "Schwarzschild Black Hole",
                "description": "Static singularity and event horizon",
                "status": "coming_soon"
            }
        ]
    }

@app.post("/api/compare/methods")
async def compare_methods(params: AlcubierreParams):
    """
    Compare autodiff vs finite difference methods for warp metric computation.
    Shows accuracy and performance differences.
    """
    try:
        device = get_best_device()
        import torch
        import time

        # Use smaller grid for quick comparison
        grid_size = min(params.gridSize, 32)  # Limit to 32 for speed

        results = {
            "finite_diff": {"timing": 0, "max_curvature": 0, "success": False},
            "autodiff": {"timing": 0, "max_curvature": 0, "success": False},
            "comparison": {"improvement": 0, "recommendation": ""}
        }

        # Method 1: Finite Difference
        try:
            start_time = time.time()

            metric_fd = get_alcubierre_metric(
                grid_size=(1, grid_size, grid_size, grid_size),
                grid_scale=(0.1, 0.5, 0.5, 0.5),
                world_center=(0.0, grid_size // 2, grid_size // 2, grid_size // 2),
                v=params.velocity,
                R=params.radius,
                sigma=params.sigma,
                device=device
            )

            # Compute using finite difference
            gamma_fd = get_christoffel_symbols(
                metric_fd.tensor,
                metric_fd.grid_scaling,
                method="finite_diff"
            )

            fd_time = time.time() - start_time
            max_gamma_fd = float(gamma_fd.abs().max().item())

            results["finite_diff"] = {
                "timing": round(fd_time, 4),
                "max_curvature": max_gamma_fd,
                "success": True
            }

        except Exception as e:
            results["finite_diff"]["success"] = False
            results["finite_diff"]["error"] = str(e)

        # Method 2: Autodiff
        try:
            start_time = time.time()

            # Create metric with gradient support
            import torch
            T, X, Y, Z = 1, grid_size, grid_size, grid_size
            dt, dx, dy, dz = 0.1, 0.5, 0.5, 0.5

            # Coordinate grids with gradients
            t_grid = torch.linspace(0, T * dt, T, requires_grad=False)
            x_grid = torch.linspace(0, X * dx, X, requires_grad=True)
            y_grid = torch.linspace(0, Y * dy, Y, requires_grad=True)
            z_grid = torch.linspace(0, Z * dz, Z, requires_grad=True)

            # Create meshgrids
            t_mesh, x_mesh, y_mesh, z_mesh = torch.meshgrid(
                t_grid, x_grid, y_grid, z_grid, indexing='ij'
            )

            # Compute metric components
            from core.constants import C
            x_s = t_mesh * (params.velocity * C)
            r = torch.sqrt((x_mesh - x_s)**2 + y_mesh**2 + z_mesh**2)

            # Shape function
            import math
            term1 = torch.tanh(params.sigma * (params.radius + r))
            term2 = torch.tanh(params.sigma * (params.radius - r))
            denominator = 2 * math.tanh(params.radius * params.sigma)
            f_s = (term1 + term2) / denominator
            beta_x = -params.velocity * f_s

            # Assemble metric
            g_autodiff = torch.zeros((4, 4, T, X, Y, Z), dtype=torch.float64)
            g_autodiff[0, 0] = -1.0 + beta_x ** 2
            g_autodiff[0, 1] = beta_x
            g_autodiff[1, 0] = beta_x
            g_autodiff[1, 1] = 1.0
            g_autodiff[2, 2] = 1.0
            g_autodiff[3, 3] = 1.0

            # Compute using autodiff
            solver = AutodiffCurvatureSolver()
            coords = {'t': t_mesh, 'x': x_mesh, 'y': y_mesh, 'z': z_mesh}

            gamma_ad = solver.get_christoffel_symbols_autodiff(g_autodiff, coords)

            ad_time = time.time() - start_time
            max_gamma_ad = float(gamma_ad.abs().max().item())

            results["autodiff"] = {
                "timing": round(ad_time, 4),
                "max_curvature": max_gamma_ad,
                "success": True
            }

        except Exception as e:
            results["autodiff"]["success"] = False
            results["autodiff"]["error"] = str(e)

        # Comparison analysis
        if results["finite_diff"]["success"] and results["autodiff"]["success"]:
            fd_val = results["finite_diff"]["max_curvature"]
            ad_val = results["autodiff"]["max_curvature"]

            if abs(fd_val - ad_val) < 1e-6:
                recommendation = "Both methods perform well for these parameters."
                improvement = 0
            elif abs(fd_val - ad_val) / max(ad_val, 1e-10) > 0.1:  # 10% difference
                recommendation = f"Significant difference detected! Autodiff recommended for σ={params.sigma}"
                improvement = round(abs(fd_val - ad_val) / max(ad_val, 1e-10) * 100, 1)
            else:
                recommendation = "Methods agree reasonably. Finite difference acceptable for exploration."
                improvement = round(abs(fd_val - ad_val) / max(ad_val, 1e-10) * 100, 1)

            results["comparison"] = {
                "improvement": improvement,
                "recommendation": recommendation,
                "speedup": round(results["finite_diff"]["timing"] / max(results["autodiff"]["timing"], 1e-10), 2)
            }

        return {
            "success": True,
            "params": params.model_dump(),
            "results": results,
            "grid_size_used": grid_size
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", "8099"))
    uvicorn.run(app, host="0.0.0.0", port=port)

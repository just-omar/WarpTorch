from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import sys
import os
from dotenv import load_dotenv

# Load .env from parent directory (project root)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# Add parent directory to path for WarpTorch module imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.metrics.alcubierre import get_alcubierre_metric
from core.solver.energy import get_energy_tensor
from core.solver.autodiff_curvature import get_christoffel_symbols, AutodiffCurvatureSolver
from core.visualizer.slicing import get_2d_slice
from core.utils import get_best_device

app = FastAPI(title="WarpTorch API")

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

@app.post("/api/simulate/alcubierre")
async def simulate_alcubierre(params: AlcubierreParams):
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
                "metric": "Alcubierre (1994)",
                "description": "Classic superluminal warp bubble",
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
                "status": "coming_soon"
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

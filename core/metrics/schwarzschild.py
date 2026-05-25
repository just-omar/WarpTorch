"""
Generator for the Schwarzschild metric (Non-rotating Black Hole).
Original implementation: metricGet_Schwarzschild.m
"""
import torch
from typing import Tuple, Optional
from core.metrics.base import MetricTensor
from core.utils import get_best_device

def get_schwarzschild_metric(
    grid_size: Tuple[int, int, int, int],
    world_center: Tuple[float, float, float, float],
    rs: float,
    grid_scale: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0),
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float64
) -> MetricTensor:
    """
    Constructs a covariant Schwarzschild metric tensor for a 4D grid.
   
    
    Args:
        grid_size: Grid dimensions [T, X, Y, Z].
        world_center: World center coordinates [t, x, y, z].
        rs: Schwarzschild radius (2GM/c^2).
        grid_scale: Grid step sizes [dt, dx, dy, dz].
        device: Target computation device.
        dtype: Tensor data type.
        
    Returns:
        MetricTensor object for the Schwarzschild geometry.
    """
    if grid_size[0] > 1:
        import warnings
        warnings.warn("The time grid is greater than 1. Typically, only a size of 1 is used for static Schwarzschild solutions.")
        
    if device is None:
        device = get_best_device()
        
    T, X, Y, Z = grid_size
    dt, dx, dy, dz = grid_scale
    
    # Generate 1-based axes translated by world center
    t_axis = (torch.arange(1, T + 1, device=device, dtype=dtype) * dt) - world_center[0]
    x_axis = (torch.arange(1, X + 1, device=device, dtype=dtype) * dx) - world_center[1]
    y_axis = (torch.arange(1, Y + 1, device=device, dtype=dtype) * dy) - world_center[2]
    z_axis = (torch.arange(1, Z + 1, device=device, dtype=dtype) * dz) - world_center[3]

    t_grid, x_grid, y_grid, z_grid = torch.meshgrid(t_axis, x_axis, y_axis, z_axis, indexing='ij')

    # Add very small offset (epsilon) to mitigate divide by zero errors at the singularity
    #
    epsilon = 1e-10
    r = torch.sqrt(x_grid**2 + y_grid**2 + z_grid**2) + epsilon
    
    # Initialize flat metric
    g = torch.zeros((4, 4, T, X, Y, Z), dtype=dtype, device=device)
    
    # Precompute common terms
    rs_r = rs / r
    r_sq = r**2
    denom = r**3 - r**2 * rs
    
    # Diagonal terms
    g[0, 0] = -(1.0 - rs_r)
    g[1, 1] = (x_grid**2 / (1.0 - rs_r) + y_grid**2 + z_grid**2) / r_sq
    g[2, 2] = (x_grid**2 + y_grid**2 / (1.0 - rs_r) + z_grid**2) / r_sq
    g[3, 3] = (x_grid**2 + y_grid**2 + z_grid**2 / (1.0 - rs_r)) / r_sq
    
    # Cross terms
    g[1, 2] = g[2, 1] = (rs / denom) * x_grid * y_grid
    g[1, 3] = g[3, 1] = (rs / denom) * x_grid * z_grid
    g[2, 3] = g[3, 2] = (rs / denom) * y_grid * z_grid

    return MetricTensor(
        name="Schwarzschild",
        grid_size=grid_size,
        grid_scaling=grid_scale,
        tensor=g,
        params={"rs": rs, "world_center": world_center}
    )
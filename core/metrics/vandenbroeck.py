"""
Generator for the Van Den Broeck metric (Microscopic Alcubierre bubble with expanded internal volume).
Original implementation: metricGet_VanDenBroeck.m
"""
import torch
from typing import Tuple, Optional
from core.metrics.base import MetricTensor
from core.metrics.alcubierre import shape_function_alcubierre
from core.constants import C
from core.utils import get_best_device

def get_vandenbroeck_metric(
    grid_size: Tuple[int, int, int, int],
    world_center: Tuple[float, float, float, float],
    v: float,
    R1: float,
    sigma1: float,
    R2: float,
    sigma2: float,
    A: float,
    grid_scale: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0),
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float64
) -> MetricTensor:
    """
    Constructs a covariant Van Den Broeck metric tensor.
   
    """
    if device is None:
        device = get_best_device()
        
    T, X, Y, Z = grid_size
    dt, dx, dy, dz = grid_scale
    
    t_axis = (torch.arange(1, T + 1, device=device, dtype=dtype) * dt) - world_center[0]
    x_axis = (torch.arange(1, X + 1, device=device, dtype=dtype) * dx) - world_center[1]
    y_axis = (torch.arange(1, Y + 1, device=device, dtype=dtype) * dy) - world_center[2]
    z_axis = (torch.arange(1, Z + 1, device=device, dtype=dtype) * dz) - world_center[3]

    t_grid, x_grid, y_grid, z_grid = torch.meshgrid(t_axis, x_axis, y_axis, z_axis, indexing='ij')

    # Effective velocity multiplier in Van Den Broeck geometry
    v_eff = v * (1 + A)**2
    x_s = t_grid * (v_eff * C)
    
    r = torch.sqrt((x_grid - x_s)**2 + y_grid**2 + z_grid**2)
    
    # B function (Spatial expansion modifier)
    B = 1.0 + shape_function_alcubierre(r, R1, sigma1) * A
    B_sq = B**2
    
    # fs function (Shift vector modifier)
    f_s = shape_function_alcubierre(r, R2, sigma2) * v
    
    # Assemble metric
    g = torch.zeros((4, 4, T, X, Y, Z), dtype=dtype, device=device)
    
    g[0, 0] = -(1.0 - B_sq * f_s**2)
    g[0, 1] = g[1, 0] = -B_sq * f_s
    g[1, 1] = B_sq
    g[2, 2] = B_sq
    g[3, 3] = B_sq

    return MetricTensor(
        name="Van Den Broeck", grid_size=grid_size, grid_scaling=grid_scale, tensor=g,
        params={"v": v_eff, "R1": R1, "sigma1": sigma1, "R2": R2, "sigma2": sigma2, "A": A}
    )
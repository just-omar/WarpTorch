"""
Generator for the Lentz metric (Positive Energy Warp Soliton).
Original implementation: metricGet_Lentz.m
"""
import torch
from typing import Tuple, Optional
from core.metrics.base import MetricTensor
from core.constants import C
from core.utils import get_best_device

def get_lentz_metric(
    grid_size: Tuple[int, int, int, int],
    world_center: Tuple[float, float, float, float],
    v: float,
    scale: Optional[float] = None,
    grid_scale: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0),
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float64
) -> MetricTensor:
    """
    Constructs a covariant Lentz metric tensor using fully vectorized boolean masking.
   
    """
    if scale is None:
        scale = max(grid_size[1:4]) / 7.0
        
    if device is None:
        device = get_best_device()
        
    T, X, Y, Z = grid_size
    dt, dx, dy, dz = grid_scale
    
    t_axis = (torch.arange(1, T + 1, device=device, dtype=dtype) * dt) - world_center[0]
    x_axis = (torch.arange(1, X + 1, device=device, dtype=dtype) * dx) - world_center[1]
    y_axis = (torch.arange(1, Y + 1, device=device, dtype=dtype) * dy) - world_center[2]
    z_axis = (torch.arange(1, Z + 1, device=device, dtype=dtype) * dz) - world_center[3]

    t_grid, x_grid, y_grid, z_grid = torch.meshgrid(t_axis, x_axis, y_axis, z_axis, indexing='ij')

    # Shift vector xs centered in time
    x_s = t_grid * (v * C)
    xp = x_grid - x_s
    y_abs = torch.abs(y_grid)
    
    # Initialize Warp Factors
    WFX = torch.zeros_like(xp)
    WFY = torch.zeros_like(xp)
    
    # -------------------------------------------------------------
    # Vectorized Lentz Template (Replaces getWarpFactorByRegion)
    #
    # -------------------------------------------------------------
    c1 = (xp >= scale) & (xp <= 2*scale) & (xp - scale >= y_abs)
    WFX = torch.where(c1, torch.tensor(-2.0, device=device, dtype=dtype), WFX)
    
    c2 = (xp > scale) & (xp <= 2*scale) & (xp - scale <= y_abs) & (-y_abs + 3*scale >= xp)
    WFX = torch.where(c2, torch.tensor(-1.0, device=device, dtype=dtype), WFX)
    WFY = torch.where(c2, torch.tensor(1.0, device=device, dtype=dtype), WFY)
    
    c3 = (xp > 0) & (xp <= scale) & (xp + scale > y_abs) & (-y_abs + scale < xp)
    WFY = torch.where(c3, torch.tensor(1.0, device=device, dtype=dtype), WFY)
    
    c4 = (xp > 0) & (xp <= scale) & (xp + scale <= y_abs) & (-y_abs + 3*scale >= xp)
    WFX = torch.where(c4, torch.tensor(-0.5, device=device, dtype=dtype), WFX)
    WFY = torch.where(c4, torch.tensor(0.5, device=device, dtype=dtype), WFY)
    
    c5 = (xp > -scale) & (xp <= 0) & (-xp + scale < y_abs) & (-y_abs + 3*scale >= -xp)
    WFX = torch.where(c5, torch.tensor(0.5, device=device, dtype=dtype), WFX)
    WFY = torch.where(c5, torch.tensor(0.5, device=device, dtype=dtype), WFY)
    
    c6 = (xp > -scale) & (xp <= 0) & (xp + scale <= y_abs) & (-y_abs + scale >= xp)
    WFX = torch.where(c6, torch.tensor(1.0, device=device, dtype=dtype), WFX)
    
    c7 = (xp >= -scale) & (xp <= scale) & (xp + scale > y_abs)
    WFX = torch.where(c7, torch.tensor(1.0, device=device, dtype=dtype), WFX)
    
    # Restore Y sign
    WFY = torch.sign(y_grid) * WFY
    
    # Shift vector components
    beta_x = -WFX * v
    beta_y = WFY * v
    
    # Assemble metric (3+1 formalism)
    g = torch.zeros((4, 4, T, X, Y, Z), dtype=dtype, device=device)
    
    g[0, 0] = -1.0 + (beta_x**2 + beta_y**2)
    g[0, 1] = g[1, 0] = beta_x
    g[0, 2] = g[2, 0] = beta_y
    g[1, 1] = 1.0
    g[2, 2] = 1.0
    g[3, 3] = 1.0

    return MetricTensor(
        name="Lentz", grid_size=grid_size, grid_scaling=grid_scale, tensor=g,
        params={"v": v, "scale": scale, "world_center": world_center}
    )
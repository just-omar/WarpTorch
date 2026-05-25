"""
Generator for the Alcubierre metric (Warp Bubble).
Original implementation: metricGet_Alcubierre.m and shapeFunction_Alcubierre.m
"""
import torch
import math
from typing import Tuple, Optional
from core.metrics.base import MetricTensor
from core.constants import C  # Import Speed of Light from constants module
from core.utils import get_best_device

def shape_function_alcubierre(r: torch.Tensor, R: float, sigma: float) -> torch.Tensor:
    """
    Computes the shape function f(r) for the Alcubierre warp bubble.
   
    
    Args:
        r: Distance tensor from the center of the bubble.
        R: Radius of the warp bubble.
        sigma: Thickness parameter of the bubble walls.
        
    Returns:
        Tensor representing the shape function values at given distances.
    """
    term1 = torch.tanh(sigma * (R + r))
    term2 = torch.tanh(sigma * (R - r))
    denominator = 2 * math.tanh(R * sigma)
    return (term1 + term2) / denominator

def get_alcubierre_metric(
    grid_size: Tuple[int, int, int, int],
    world_center: Tuple[float, float, float, float],
    v: float,
    R: float,
    sigma: float,
    grid_scale: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0),
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float64
) -> MetricTensor:
    """
    Constructs a covariant Alcubierre metric tensor using fully vectorized operations.
   
    
    Args:
        grid_size: Grid dimensions [T, X, Y, Z].
        world_center: World center coordinates [t, x, y, z].
        v: Speed of the warp drive in fractions of c (speed of light).
        R: Radius of the warp bubble.
        sigma: Thickness parameter.
        grid_scale: Grid step sizes [dt, dx, dy, dz].
        device: Target computation device.
        dtype: Tensor data type.
        
    Returns:
        MetricTensor object for the Alcubierre geometry.
    """
    if device is None:
        device = get_best_device()
        
    T, X, Y, Z = grid_size
    dt, dx, dy, dz = grid_scale
    
    # 1. Generate physical coordinate axes (1-based to align with original MATLAB formulation)
    #
    t_axis = (torch.arange(1, T + 1, device=device, dtype=dtype) * dt) - world_center[0]
    x_axis = (torch.arange(1, X + 1, device=device, dtype=dtype) * dx) - world_center[1]
    y_axis = (torch.arange(1, Y + 1, device=device, dtype=dtype) * dy) - world_center[2]
    z_axis = (torch.arange(1, Z + 1, device=device, dtype=dtype) * dz) - world_center[3]

    # 2. Create a 4D meshgrid for fully vectorized computation
    #
    t_grid, x_grid, y_grid, z_grid = torch.meshgrid(t_axis, x_axis, y_axis, z_axis, indexing='ij')

    # 3. Compute bubble shift (xs) and distance (r) from the center concurrently for all points
    #
    x_s = t_grid * (v * C)  
    r = torch.sqrt((x_grid - x_s)**2 + y_grid**2 + z_grid**2)

    # 4. Calculate shape function f(r) and shift vector (beta_x)
    #
    f_s = shape_function_alcubierre(r, R, sigma)
    beta_x = -v * f_s

    # 5. Assemble the metric tensor (3+1 ADM formalism decomposition)
    g = torch.zeros((4, 4, T, X, Y, Z), dtype=dtype, device=device)
    
    g[0, 0] = -1.0 + (beta_x ** 2)
    g[0, 1] = beta_x
    g[1, 0] = beta_x
    g[1, 1] = 1.0
    g[2, 2] = 1.0
    g[3, 3] = 1.0
    
    params = {
        "world_center": world_center,
        "velocity": v,
        "R": R,
        "sigma": sigma
    }

    return MetricTensor(
        name="Alcubierre",
        grid_size=grid_size,
        grid_scaling=grid_scale,
        tensor=g,
        params=params
    )

if __name__ == "__main__":
    # Smoke Test
    print("Running Smoke Test: Alcubierre...")
    grid_size = (10, 40, 40, 40)
    world_center = (0.0, 0.0, 0.0, 0.0)
    
    metric = get_alcubierre_metric(
        grid_size=grid_size,
        world_center=world_center,
        v=0.5,       # 0.5c
        R=10.0,      # Bubble radius
        sigma=8.0    # Wall thickness
    )
    
    assert metric.tensor.shape == (4, 4, 10, 40, 40, 40), "Dimension mismatch!"
    
    # Verify asymptotic flatness (far from the bubble, metric approaches Minkowski)
    g_00_far = metric.tensor[0, 0, 0, 39, 39, 39].item()
    assert abs(g_00_far - (-1.0)) < 1e-4, f"g_00 far from bubble should be ~ -1.0, got {g_00_far}"
    
    print("Alcubierre Smoke Test passed! Vectorization works correctly.")
"""
Generator for the Minkowski metric (flat spacetime).
Original implementation: metricGet_Minkowski.m
"""
import torch
from typing import Tuple, Optional
from core.metrics.base import MetricTensor
from core.utils import get_best_device

def get_minkowski_metric(
    grid_size: Tuple[int, int, int, int],
    grid_scaling: Tuple[float, float, float, float] = (1.0, 1.0, 1.0, 1.0),
    device: Optional[torch.device] = None,
    dtype: torch.dtype = torch.float64
) -> MetricTensor:
    """
    Constructs a covariant Minkowski metric tensor for a 4D grid.
    
    Args:
        grid_size: Tuple representing grid dimensions [T, X, Y, Z].
        grid_scaling: Tuple representing step sizes [dt, dx, dy, dz].
        device: Target computation device (CPU/CUDA).
        dtype: Tensor data type (float64 is recommended for General Relativity).
        
    Returns:
        MetricTensor object containing a tensor of shape (4, 4, T, X, Y, Z).
    """
    if device is None:
        device = get_best_device()
        
    # Initialize the metric tensor with zeros
    metric_tensor = torch.zeros((4, 4, *grid_size), dtype=dtype, device=device)
    
    # dt^2 term (-1)
    metric_tensor[0, 0, ...] = -1.0
    
    # Non-time diagonal spatial terms (1)
    metric_tensor[1, 1, ...] = 1.0
    metric_tensor[2, 2, ...] = 1.0
    metric_tensor[3, 3, ...] = 1.0

    return MetricTensor(
        name="Minkowski",
        grid_size=grid_size,
        grid_scaling=grid_scaling,
        tensor=metric_tensor
    )

if __name__ == "__main__":
    # Smoke Test
    print("Running Smoke Test: Minkowski...")
    size = (10, 50, 50, 50)
    metric = get_minkowski_metric(size)
    assert metric.tensor.shape == (4, 4, 10, 50, 50, 50), "Dimension mismatch!"
    assert metric.tensor[0, 0, 0, 0, 0, 0].item() == -1.0, "g_00 must be -1"
    assert metric.tensor[1, 1, 0, 0, 0, 0].item() == 1.0, "g_11 must be 1"
    print("Minkowski Smoke Test passed successfully!")
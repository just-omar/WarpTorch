"""
Base data structures for WarpTorch metrics.
"""
from dataclasses import dataclass, field
from typing import Tuple, Dict, Any
import torch

@dataclass
class MetricTensor:
    """
    Container class for storing 4D metric tensors and their metadata.
    This replaces the dynamic 'metric' struct used in the original MATLAB WarpFactory.
    """
    name: str
    grid_size: Tuple[int, int, int, int]  # [T, X, Y, Z]
    grid_scaling: Tuple[float, float, float, float]  # [dt, dx, dy, dz]
    tensor: torch.Tensor  # Tensor of shape (4, 4, T, X, Y, Z)
    
    type: str = "metric"
    coords: str = "cartesian"
    index: str = "covariant"
    params: Dict[str, Any] = field(default_factory=dict)
    
    @property
    def device(self) -> torch.device:
        """Returns the computation device (CPU/GPU) of the underlying tensor."""
        return self.tensor.device
        
    @property
    def dtype(self) -> torch.dtype:
        """Returns the data type of the underlying tensor."""
        return self.tensor.dtype
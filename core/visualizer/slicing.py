"""
Tensor Slicing and Data Extraction for Visualization.
Replaces: getSliceData.m, trilinearInterp.m
"""
import torch
import numpy as np
from core.metrics.base import MetricTensor

def get_2d_slice(
    metric: MetricTensor, 
    component: tuple[int, int], 
    slice_plane: str = 'xy', 
    z_index: int = None, 
    t_index: int = 0
) -> np.ndarray:
    """
    Extracts a 2D scalar field from a 4D tensor component for plotting (e.g., heatmaps).
   
    
    Args:
        metric: Any MetricTensor (Metric, Energy, etc.).
        component: Tuple representing the tensor indices (mu, nu), e.g., (0, 0).
        slice_plane: 'xy', 'xz', or 'yz'.
        z_index: The index of the orthogonal axis to slice at (defaults to center).
        t_index: Time slice index.
        
    Returns:
        A 2D NumPy array ready for Plotly or Matplotlib.
    """
    mu, nu = component
    tensor = metric.tensor[mu, nu, t_index] # Shape: (X, Y, Z)

    _, X, Y, Z = metric.grid_size
    
    if slice_plane == 'xy':
        idx = z_index if z_index is not None else Z // 2
        slice_data = tensor[:, :, idx]
    elif slice_plane == 'xz':
        idx = z_index if z_index is not None else Y // 2
        slice_data = tensor[:, idx, :]
    elif slice_plane == 'yz':
        idx = z_index if z_index is not None else X // 2
        slice_data = tensor[idx, :, :]
    else:
        raise ValueError("slice_plane must be 'xy', 'xz', or 'yz'")
        
    # Handle both torch.Tensor and numpy.ndarray inputs
    #
    if isinstance(slice_data, torch.Tensor):
        return slice_data.detach().cpu().to(torch.float32).numpy()
    elif isinstance(slice_data, np.ndarray):
        return slice_data.astype(np.float32)
    else:
        raise TypeError(f"Expected torch.Tensor or numpy.ndarray, got {type(slice_data)}")
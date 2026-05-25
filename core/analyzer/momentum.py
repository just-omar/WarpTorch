"""
Momentum Flow Field Analyzer.
Extracts the spatial momentum density vectors from the Stress-Energy tensor.
Replaces: getMomentumFlowLines.m
"""
import torch
from core.metrics.base import MetricTensor
from core.analyzer.frames import do_frame_transfer

def get_momentum_vector_field(
    energy_tensor: MetricTensor, 
    metric: MetricTensor, 
    time_slice: int = 0
) -> torch.Tensor:
    """
    Extracts the 3D momentum vector field (T^{0i}) from the Stress-Energy tensor.
    Automatically transfers to the Eulerian frame to get physical momentum density.
   
    
    Args:
        energy_tensor: Contravariant Stress-Energy tensor.
        metric: Base spacetime metric.
        time_slice: The time index 't' to extract the flow from.
        
    Returns:
        Tensor of shape (3, X, Y, Z) representing (p_x, p_y, p_z) momentum vectors.
    """
    # Momentum flow is physically meaningful in the local Eulerian frame
    #
    eulerian_energy = do_frame_transfer(energy_tensor, metric, "Eulerian")
    
    T_eulerian = eulerian_energy.tensor
    
    # Extract T^{0i} components for the given time slice
    # Shape: (3, X, Y, Z)
    p_x = T_eulerian[0, 1, time_slice, :, :, :]
    p_y = T_eulerian[0, 2, time_slice, :, :, :]
    p_z = T_eulerian[0, 3, time_slice, :, :, :]
    
    momentum_field = torch.stack([p_x, p_y, p_z], dim=0)
    
    return momentum_field
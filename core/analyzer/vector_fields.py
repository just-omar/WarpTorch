"""
Uniform Vector Field Generator for Energy Condition Testing.
Replaces: generateUniformField.m, getEvenPointsOnSphere.m
"""
import torch
import math

def generate_fibonacci_sphere(num_points: int, device: torch.device) -> torch.Tensor:
    """
    Generates roughly evenly spaced points on a 3D unit sphere using the Fibonacci spiral.
    Returns a tensor of shape (num_points, 3).
    """
    indices = torch.arange(0, num_points, dtype=torch.float64, device=device)
    phi = math.acos(-1.0) * (3.0 - math.sqrt(5.0))  # Golden angle
    
    y = 1 - (indices / float(num_points - 1)) * 2  # y goes from 1 to -1
    radius = torch.sqrt(1 - y * y)  # radius at y
    
    theta = phi * indices
    
    x = torch.cos(theta) * radius
    z = torch.sin(theta) * radius
    
    return torch.stack([x, y, z], dim=1)

def generate_test_vectors(
    condition_type: str, 
    num_angular: int = 100, 
    device: torch.device = torch.device('cpu')
) -> torch.Tensor:
    """
    Generates test vectors for energy conditions.
    Replaces: generateUniformField.m
    
    Args:
        condition_type: "nulllike" (k^mu k_mu = 0) or "timelike" (V^mu V_mu < 0).
        num_angular: Number of spatial directions to sample.
        
    Returns:
        Tensor of shape (N_vectors, 4) containing the components [V^0, V^1, V^2, V^3].
    """
    spatial_dirs = generate_fibonacci_sphere(num_angular, device)
    
    if condition_type == "nulllike":
        # k^mu = (1, v^x, v^y, v^z) where |v| = 1
        time_comp = torch.ones((num_angular, 1), dtype=torch.float64, device=device)
        return torch.cat([time_comp, spatial_dirs], dim=1)
        
    elif condition_type == "timelike":
        # V^mu = (1, v^x, v^y, v^z) where |v| < 1
        # For a robust test, we test multiple velocity magnitudes
        velocities = [0.0, 0.5, 0.9, 0.99]
        vectors = []
        for v in velocities:
            time_comp = torch.ones((num_angular, 1), dtype=torch.float64, device=device)
            spatial_comp = spatial_dirs * v
            vectors.append(torch.cat([time_comp, spatial_comp], dim=1))
        
        return torch.cat(vectors, dim=0) # Shape: (num_angular * len(velocities), 4)
        
    else:
        raise ValueError("Type must be 'nulllike' or 'timelike'")
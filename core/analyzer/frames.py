"""
Reference Frame Transformations.
Replaces: doFrameTransfer.m, getEulerianTransformationMatrix.m
"""
import torch
from core.metrics.base import MetricTensor
from core.analyzer.three_plus_one import decompose_3_plus_1
from core.solver.curvature import get_inverse_metric

def get_eulerian_transformation_matrix(metric: MetricTensor) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Computes the transformation matrix Lambda^mu_hat{nu} and its inverse 
    to convert between coordinate frames and Eulerian (comoving) observer frames.
   
    
    Args:
        metric: Covariant MetricTensor.
        
    Returns:
        L_coord_to_euler: Tensor of shape (4, 4, T, X, Y, Z)
        L_euler_to_coord: Tensor of shape (4, 4, T, X, Y, Z)
    """
    alpha, beta_up = decompose_3_plus_1(metric)
    device, dtype = metric.device, metric.dtype
    grid_shape = metric.grid_size
    
    # Initialize transformation matrices
    L_c2e = torch.zeros((4, 4, *grid_shape), dtype=dtype, device=device)
    L_e2c = torch.zeros((4, 4, *grid_shape), dtype=dtype, device=device)
    
    # 1. Coordinate to Eulerian (Lambda^hat{mu}_nu)
    #
    L_c2e[0, 0] = alpha
    L_c2e[1, 0] = beta_up[0]
    L_c2e[2, 0] = beta_up[1]
    L_c2e[3, 0] = beta_up[2]
    L_c2e[1, 1] = 1.0
    L_c2e[2, 2] = 1.0
    L_c2e[3, 3] = 1.0
    
    # 2. Eulerian to Coordinate (Lambda^mu_hat{nu})
    L_e2c[0, 0] = 1.0 / alpha
    L_e2c[1, 0] = -beta_up[0] / alpha
    L_e2c[2, 0] = -beta_up[1] / alpha
    L_e2c[3, 0] = -beta_up[2] / alpha
    L_e2c[1, 1] = 1.0
    L_e2c[2, 2] = 1.0
    L_e2c[3, 3] = 1.0
    
    return L_c2e, L_e2c

def do_frame_transfer(tensor_obj: MetricTensor, base_metric: MetricTensor, target_frame: str = "Eulerian") -> MetricTensor:
    """
    Transforms a tensor to the specified local reference frame.
   
    """
    if target_frame.lower() != "eulerian":
        raise NotImplementedError("Only Eulerian frame transfer is currently supported.")
        
    L_c2e, _ = get_eulerian_transformation_matrix(base_metric)
    T_original = tensor_obj.tensor
    
    # Transform based on index type
    # For a contravariant tensor: T^hat{mu}hat{nu} = L^hat{mu}_alpha L^hat{nu}_beta T^{alpha beta}
    #
    if tensor_obj.index == "contravariant":
        T_transformed = torch.einsum('ma..., nb..., ab... -> mn...', L_c2e, L_c2e, T_original)
    elif tensor_obj.index == "covariant":
        # Requires inverse transformation for covariant indices
        _, L_e2c = get_eulerian_transformation_matrix(base_metric)
        T_transformed = torch.einsum('am..., bn..., ab... -> mn...', L_e2c, L_e2c, T_original)
    else:
        raise ValueError("Tensor index type must be 'covariant' or 'contravariant'.")
        
    return MetricTensor(
        name=f"{tensor_obj.name}_{target_frame}",
        grid_size=tensor_obj.grid_size,
        grid_scaling=tensor_obj.grid_scaling,
        tensor=T_transformed,
        type=tensor_obj.type,
        index=tensor_obj.index,
        params=tensor_obj.params
    )
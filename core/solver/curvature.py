"""
Curvature tensor calculations (Inverse Metric, Ricci Tensor, Ricci Scalar).
Replaces original MATLAB implementations: c4Inv.m, ricciT.m, ricciS.m
"""
import torch
from core.solver.finite_difference import take_finite_difference_1
from core.solver.christoffel import get_christoffel_symbols

def get_inverse_metric(g_cov: torch.Tensor) -> torch.Tensor:
    """
    Calculates the contravariant (inverse) metric tensor g^{mu nu}.
    Replaces the manual analytical inverse from c4Inv.m.
    
    Args:
        g_cov: Covariant metric tensor of shape (4, 4, T, X, Y, Z).
        
    Returns:
        Contravariant inverse metric tensor of shape (4, 4, T, X, Y, Z).
    """
    # PyTorch's linalg.inv expects matrices in the last two dimensions.
    # We permute (4, 4, T, X, Y, Z) -> (T, X, Y, Z, 4, 4)
    g_reshaped = g_cov.permute(2, 3, 4, 5, 0, 1)
    
    # Compute batched inverse natively on GPU/CPU
    gu_reshaped = torch.linalg.inv(g_reshaped)
    
    # Permute back to (4, 4, T, X, Y, Z)
    return gu_reshaped.permute(4, 5, 0, 1, 2, 3)

def get_ricci_tensor(
    gamma: torch.Tensor, 
    grid_scaling: tuple[float, float, float, float]
) -> torch.Tensor:
    """
    Computes the covariant Ricci tensor R_{mu nu} from Christoffel symbols.
    Mathematically identical to ricciT.m but uses clean tensor calculus instead of 
    manual 2nd derivative expansions.
    
    Formula: R_{mu nu} = d_{alpha} Gamma^{alpha}_{mu nu} - d_{nu} Gamma^{alpha}_{mu alpha} 
                         + Gamma^{alpha}_{beta alpha} Gamma^{beta}_{mu nu} 
                         - Gamma^{alpha}_{beta nu} Gamma^{beta}_{mu alpha}
                         
    Args:
        gamma: Christoffel symbols of the second kind (4, 4, 4, T, X, Y, Z). Dims: (rho, mu, nu, ...)
        grid_scaling: Grid steps (dt*c, dx, dy, dz) adjusted for speed of light.
        
    Returns:
        Ricci tensor of shape (4, 4, T, X, Y, Z).
    """
    # 1. Compute first derivatives of Christoffel symbols: d_lambda Gamma^rho_{mu nu}
    # Shape will be (4, 4, 4, 4, T, X, Y, Z) -> dims: (lambda, rho, mu, nu, ...)
    d_gamma = torch.zeros((4, *gamma.shape), dtype=gamma.dtype, device=gamma.device)
    for dim in range(4):
        d_gamma[dim] = take_finite_difference_1(gamma, dim + 4, grid_scaling[dim])

    # Term 1: d_{alpha} Gamma^{alpha}_{mu nu} (contraction on dim 0 and 1 of d_gamma)
    term1 = torch.einsum('aamnu... -> mnu...', d_gamma)
    
    # Term 2: d_{nu} Gamma^{alpha}_{mu alpha} (contraction on dim 1 and 3 of d_gamma)
    term2 = torch.einsum('namau... -> mnu...', d_gamma)
    
    # Term 3: Gamma^{alpha}_{beta alpha} Gamma^{beta}_{mu nu}
    term3 = torch.einsum('aba..., bmnu... -> mnu...', gamma, gamma)
    
    # Term 4: Gamma^{alpha}_{beta nu} Gamma^{beta}_{mu alpha}
    term4 = torch.einsum('abnu..., bmau... -> mnu...', gamma, gamma)
    
    R_cov = term1 - term2 + term3 - term4
    
    # Symmetrize to correct minor floating point errors
    return 0.5 * (R_cov + R_cov.transpose(0, 1))

def get_ricci_scalar(R_cov: torch.Tensor, gu: torch.Tensor) -> torch.Tensor:
    """
    Computes the Ricci scalar R = g^{mu nu} R_{mu nu}.
    Replaces ricciS.m.
    """
    return torch.einsum('mn..., mn... -> ...', gu, R_cov)
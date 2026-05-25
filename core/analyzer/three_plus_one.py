"""
3+1 (ADM) Formalism Decomposer.
Extracts Lapse (alpha), Shift (beta), and spatial metric (gamma) from a 4D metric.
Replaces: threePlusOneDecomposer.m
"""
import torch
from core.metrics.base import MetricTensor
from core.solver.curvature import get_inverse_metric

def decompose_3_plus_1(metric: MetricTensor) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Decomposes a covariant metric into 3+1 ADM variables.
    
    Args:
        metric: MetricTensor object (must be covariant).
        
    Returns:
        alpha: Lapse function, shape (T, X, Y, Z).
        beta_up: Contravariant Shift vector beta^i, shape (3, T, X, Y, Z).
    """
    if metric.index != "covariant":
        raise ValueError("Metric must be covariant for 3+1 decomposition.")
        
    g_cov = metric.tensor
    gu = get_inverse_metric(g_cov)
    
    # 1. Extract Lapse function (alpha)
    # alpha = 1 / sqrt(-g^{00})
    # Protect against floating point errors giving tiny negative roots
    g00_inv = gu[0, 0]
    alpha = 1.0 / torch.sqrt(torch.clamp(-g00_inv, min=1e-15))
    
    # 2. Extract Contravariant Shift vector (beta^i)
    # beta^i = -g^{0i} / g^{00} = g^{0i} * alpha^2
    beta_up = torch.zeros((3, *metric.grid_size), dtype=g_cov.dtype, device=g_cov.device)
    alpha_sq = alpha ** 2
    
    beta_up[0] = gu[0, 1] * alpha_sq  # beta^x
    beta_up[1] = gu[0, 2] * alpha_sq  # beta^y
    beta_up[2] = gu[0, 3] * alpha_sq  # beta^z
    
    return alpha, beta_up
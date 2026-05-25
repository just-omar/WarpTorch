"""
Tensor Index Manipulations and Traces.
Replaces: changeTensorIndex.m, getTrace.m
"""
import torch
from core.metrics.base import MetricTensor
from core.solver.curvature import get_inverse_metric

def raise_indices(T_cov: torch.Tensor, gu: torch.Tensor) -> torch.Tensor:
    """
    Converts a fully covariant tensor T_{mu nu} to contravariant T^{mu nu}.
    T^{mu nu} = g^{mu alpha} g^{nu beta} T_{alpha beta}
    """
    return torch.einsum('ma..., nb..., ab... -> mn...', gu, gu, T_cov)

def lower_indices(T_contra: torch.Tensor, g_cov: torch.Tensor) -> torch.Tensor:
    """
    Converts a fully contravariant tensor T^{mu nu} to covariant T_{mu nu}.
    T_{mu nu} = g_{mu alpha} g_{nu beta} T^{alpha beta}
    """
    return torch.einsum('ma..., nb..., ab... -> mn...', g_cov, g_cov, T_contra)

def mixed_indices(T_contra: torch.Tensor, g_cov: torch.Tensor) -> torch.Tensor:
    """
    Converts to mixed tensor T^{mu}_{nu} (First index up, second down).
    T^{mu}_{nu} = T^{mu alpha} g_{alpha nu}
    """
    return torch.einsum('ma..., an... -> mn...', T_contra, g_cov)

def get_trace(T_tensor: torch.Tensor, metric: MetricTensor) -> torch.Tensor:
    """
    Calculates the trace of a rank-2 tensor: T = T^{mu nu} g_{mu nu}.
    Replaces: getTrace.m
    """
    if metric.index != "covariant":
        raise ValueError("Metric must be covariant to compute trace.")
    
    g_cov = metric.tensor
    # If the input tensor is covariant, we need g^{mu nu} to contract it: T = T_{mu nu} g^{mu nu}
    # For simplicity, we assume T_tensor is contravariant T^{mu nu}.
    # T = T^{mu nu} g_{mu nu}
    return torch.einsum('mn..., mn... -> ...', T_tensor, g_cov)
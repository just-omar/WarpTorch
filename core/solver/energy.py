"""
Main pipeline for evaluating the metric and producing the Stress-Energy Tensor.
Original implementations: getEnergyTensor.m, einE.m
"""
import torch
import math
from core.metrics.base import MetricTensor
from core.solver.finite_difference import take_finite_difference_1
from core.solver.christoffel import get_christoffel_symbols
from core.solver.curvature import get_inverse_metric, get_ricci_tensor, get_ricci_scalar
from core.constants import C, G

def get_energy_tensor(metric: MetricTensor) -> MetricTensor:
    """
    Full pipeline to convert a covariant Metric tensor into a contravariant Stress-Energy tensor.
    Replaces getEnergyTensor.m.
    
    Args:
        metric: MetricTensor object (must be covariant).
        
    Returns:
        A new MetricTensor object representing the contravariant Stress-Energy tensor (T^{mu nu}).
    """
    if metric.index != "covariant":
        raise ValueError("Input metric must be in covariant index form.")

    g_cov = metric.tensor
    
    # Adjust scaling for time derivative: x^0 = c * t. 
    # ricciT.m scales diffs by 1/c. We bake it directly into the grid scaling.
    dt, dx, dy, dz = metric.grid_scaling
    scaled_grid = (dt * C, dx, dy, dz)

    # 1. Inverse Metric
    gu = get_inverse_metric(g_cov)

    # 2. First derivatives of metric: d_lambda g_{mu nu}
    # Shape: (lambda, mu, nu, T, X, Y, Z)
    d_g = torch.zeros((4, *g_cov.shape), dtype=g_cov.dtype, device=g_cov.device)
    for dim in range(4):
        d_g[dim] = take_finite_difference_1(g_cov, dim + 4, scaled_grid[dim])

    # 3. Christoffel Symbols
    gamma = get_christoffel_symbols(gu, d_g)

    # 4. Ricci Tensor and Scalar
    R_cov = get_ricci_tensor(gamma, scaled_grid)
    R_scalar = get_ricci_scalar(R_cov, gu)

    # 5. Einstein Tensor (Covariant): G_{mu nu} = R_{mu nu} - 1/2 g_{mu nu} R
    G_cov = R_cov - 0.5 * g_cov * R_scalar

    # 6. Stress-Energy Tensor (Covariant): T_{mu nu} = c^4 / (8 * pi * G) * G_{mu nu}
    # Replaces einE.m
    coupling_constant = (C**4) / (8.0 * math.pi * G)
    T_cov = coupling_constant * G_cov

    # 7. Raise indices to Contravariant: T^{mu nu} = g^{mu alpha} g^{nu beta} T_{alpha beta}
    #
    T_contra = torch.einsum('ma..., nb..., ab... -> mn...', gu, gu, T_cov)

    return MetricTensor(
        name=metric.name,
        grid_size=metric.grid_size,
        grid_scaling=metric.grid_scaling,
        tensor=T_contra,
        type="Stress-Energy",
        index="contravariant",
        params=metric.params
    )

if __name__ == "__main__":
    # -------------------------------------
    # SMOKE TEST (End-to-End Pipeline)
    # -------------------------------------
    print("Running End-to-End Solver Smoke Test...")
    from core.metrics.minkowski import get_minkowski_metric
    
    # Minkowski space should have EXACTLY ZERO stress-energy
    grid_size = (10, 10, 10, 10)
    minkowski = get_minkowski_metric(grid_size)
    
    energy_tensor = get_energy_tensor(minkowski)
    
    # Assert dimensions
    assert energy_tensor.tensor.shape == (4, 4, 10, 10, 10, 10), "T^{mu nu} dimension mismatch!"
    
    # Assert zero energy for flat space
    max_energy = torch.max(torch.abs(energy_tensor.tensor)).item()
    assert max_energy < 1e-10, f"Minkowski space must have 0 energy. Max error: {max_energy}"
    
    print("Solver Smoke Test Passed! T^{mu nu} for flat space is zero.")
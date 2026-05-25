"""
Kinematic Scalars Calculator (Expansion, Shear, Vorticity).
Evaluates the physical properties of the spacetime flow.
Replaces: getScalars.m
"""
import torch
from core.metrics.base import MetricTensor
from core.analyzer.three_plus_one import decompose_3_plus_1
from core.solver.finite_difference import take_finite_difference_1
from core.solver.curvature import get_inverse_metric
from core.solver.christoffel import get_christoffel_symbols
from core.constants import C

def get_kinematic_scalars(metric: MetricTensor) -> dict[str, torch.Tensor]:
    """
    Computes the expansion, shear, and vorticity scalars of the metric.
   
    
    Args:
        metric: Covariant MetricTensor.
        
    Returns:
        Dictionary containing:
            'expansion': theta (Scalar)
            'shear': sigma^2 (Scalar)
            'vorticity': omega^2 (Scalar)
    """
    g_cov = metric.tensor
    gu = get_inverse_metric(g_cov)
    
    dt, dx, dy, dz = metric.grid_scaling
    scaled_grid = (dt * C, dx, dy, dz)
    
    # 1. 3+1 Decomposition
    alpha, beta_up = decompose_3_plus_1(metric)
    
    # 2. Eulerian 4-velocity u^mu
    u_up = torch.zeros((4, *metric.grid_size), dtype=g_cov.dtype, device=g_cov.device)
    u_up[0] = 1.0 / alpha
    u_up[1] = -beta_up[0] / alpha
    u_up[2] = -beta_up[1] / alpha
    u_up[3] = -beta_up[2] / alpha
    
    # u_mu = g_{mu nu} u^nu
    u_down = torch.einsum('mn..., n... -> m...', g_cov, u_up)
    
    # 3. Christoffel Symbols
    d_g = torch.zeros((4, *g_cov.shape), dtype=g_cov.dtype, device=g_cov.device)
    for dim in range(4):
        d_g[dim] = take_finite_difference_1(g_cov, dim + 4, scaled_grid[dim])
    gamma = get_christoffel_symbols(gu, d_g)
    
    # 4. Covariant derivative of u_nu: \nabla_mu u_nu = \partial_mu u_nu - \Gamma^lambda_{mu nu} u_lambda
    # Compute partial derivative \partial_mu u_nu
    partial_u = torch.zeros((4, 4, *metric.grid_size), dtype=g_cov.dtype, device=g_cov.device)
    for mu in range(4):
        partial_u[mu] = take_finite_difference_1(u_down, mu + 4, scaled_grid[mu])
        
    # \Gamma^lambda_{mu nu} u_lambda
    gamma_u = torch.einsum('lmn..., l... -> mn...', gamma, u_down)
    nabla_u = partial_u - gamma_u  # Shape: (mu, nu, T, X, Y, Z)
    
    # 5. Projection Tensors
    # P_{mu nu} = g_{mu nu} + u_mu u_nu
    P_down = g_cov + torch.einsum('m..., n... -> mn...', u_down, u_down)
    
    # P^mu_nu = \delta^mu_nu + u^mu u_nu
    delta = torch.eye(4, dtype=g_cov.dtype, device=g_cov.device).view(4, 4, 1, 1, 1, 1)
    P_mixed = delta + torch.einsum('m..., n... -> mn...', u_up, u_down)
    
    # 6. Symmetrized and Antisymmetrized derivatives
    sym_nabla = 0.5 * (nabla_u + nabla_u.transpose(0, 1))   # \nabla_{(a} U_{b)}
    anti_nabla = 0.5 * (nabla_u - nabla_u.transpose(0, 1))  # \nabla_{[a} U_{b]}
    
    # 7. Expansion Tensor (\theta_{mu nu}) and Vorticity Tensor (\omega_{mu nu})
    # \theta_{mu nu} = P^a_mu P^b_nu \nabla_{(a} U_{b)}
    theta_tensor = torch.einsum('am..., bn..., ab... -> mn...', P_mixed, P_mixed, sym_nabla)
    omega_tensor = torch.einsum('am..., bn..., ab... -> mn...', P_mixed, P_mixed, anti_nabla)
    
    # 8. Expansion Scalar (\theta)
    theta = torch.einsum('mn..., mn... -> ...', gu, theta_tensor)
    
    # 9. Shear Tensor (\sigma_{mu nu}) and Scalar (\sigma^2)
    # \sigma_{mu nu} = \theta_{mu nu} - (1/3) \theta P_{mu nu}
    shear_tensor = theta_tensor - (1.0 / 3.0) * theta * P_down
    
    # Raise indices to get \sigma^{mu nu} and \omega^{mu nu}
    shear_up = torch.einsum('ma..., nb..., ab... -> mn...', gu, gu, shear_tensor)
    omega_up = torch.einsum('ma..., nb..., ab... -> mn...', gu, gu, omega_tensor)
    
    # Scalars
    sigma_sq = 0.5 * torch.einsum('mn..., mn... -> ...', shear_tensor, shear_up)
    omega_sq = 0.5 * torch.einsum('mn..., mn... -> ...', omega_tensor, omega_up)
    
    return {
        "expansion": theta,
        "shear": sigma_sq,
        "vorticity": omega_sq
    }

if __name__ == "__main__":
    # Smoke Test
    print("Running Smoke Test: Kinematic Scalars...")
    from core.metrics.minkowski import get_minkowski_metric
    
    metric = get_minkowski_metric((5, 10, 10, 10))
    scalars = get_kinematic_scalars(metric)
    
    # Flat spacetime must have 0 expansion, shear, and vorticity
    assert torch.max(torch.abs(scalars["expansion"])).item() < 1e-10
    assert torch.max(torch.abs(scalars["shear"])).item() < 1e-10
    assert torch.max(torch.abs(scalars["vorticity"])).item() < 1e-10
    
    print("Smoke Test Passed! Flat spacetime scalars are exactly zero.")
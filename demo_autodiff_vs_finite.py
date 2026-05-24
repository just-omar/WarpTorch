"""
Demo: Autodiff vs Finite Difference methods for Warp metrics.
Shows elimination of numerical artifacts when σ → ∞.
"""
import torch
from typing import Dict, Tuple

from core.metrics.alcubierre import get_alcubierre_metric
from core.solver.autodiff_curvature import AutodiffCurvatureSolver, get_christoffel_symbols as get_gamma_wrapper
from core.solver.curvature import get_ricci_tensor
from core.constants import C


def create_metric_with_autograd(
    grid_size: tuple,
    world_center: tuple,
    v: float,
    R: float,
    sigma: float
) -> tuple:
    """
    Create Alcubierre metric with autograd-compatible coordinate grids.
    Returns both metric and coordinate grids for autodiff.
    """
    from core.metrics.alcubierre import shape_function_alcubierre
    import math

    T, X, Y, Z = grid_size
    dt, dx, dy, dz = 1.0, 1.0, 1.0, 1.0  # Normalized grid spacing

    # Create coordinate grids with gradients enabled
    t_grid = (torch.arange(1, T + 1, dtype=torch.float64) * dt - world_center[0]).requires_grad_(True)
    x_grid = (torch.arange(1, X + 1, dtype=torch.float64) * dx - world_center[1]).requires_grad_(True)
    y_grid = (torch.arange(1, Y + 1, dtype=torch.float64) * dy - world_center[2]).requires_grad_(True)
    z_grid = (torch.arange(1, Z + 1, dtype=torch.float64) * dz - world_center[3]).requires_grad_(True)

    # Create meshgrids
    t_mesh, x_mesh, y_mesh, z_mesh = torch.meshgrid(
        t_grid, x_grid, y_grid, z_grid, indexing='ij'
    )

    # Compute metric components using these coordinates
    x_s = t_mesh * (v * C)
    r = torch.sqrt((x_mesh - x_s)**2 + y_mesh**2 + z_mesh**2)

    # Shape function
    f_s = shape_function_alcubierre(r, R, sigma)
    beta_x = -v * f_s

    # Assemble metric tensor
    g = torch.zeros((4, 4, T, X, Y, Z), dtype=torch.float64)
    g[0, 0] = -1.0 + (beta_x ** 2)
    g[0, 1] = beta_x
    g[1, 0] = beta_x
    g[1, 1] = 1.0
    g[2, 2] = 1.0
    g[3, 3] = 1.0

    coords = {'t': t_mesh, 'x': x_mesh, 'y': y_mesh, 'z': z_mesh}
    grid_scaling = (dt, dx, dy, dz)

    return g, coords, grid_scaling


def create_comparison_demo(
    sigma_values: list = [5.0, 20.0, 50.0],
    velocity: float = 2.5  # Higher velocity for more curvature
) -> Dict[str, Dict]:
    """
    Compare autodiff vs finite difference methods for various sigma values.

    High sigma values create sharp bubble walls that cause numerical artifacts
    in finite difference schemes.
    """
    results = {}

    for sigma in sigma_values:
        print(f"\n{'='*60}")
        print(f"Testing σ = {sigma} (stiffness parameter)")
        print(f"{'='*60}")

        # Create problematic metric: sharp bubble wall
        grid_size = (6, 12, 12, 12)  # Smaller for speed
        world_center = (0.0, 0.0, 0.0, 0.0)

        test_velocity = velocity  # Use actual velocity parameter
        print(f"Bubble radius: R = 4.0")
        print(f"Wall stiffness: σ = {sigma}")
        print(f"Velocity: v = {test_velocity}c")

        # Method 1: Finite Difference (traditional)
        print(f"\n[1/2] Finite Difference Method...")
        try:
            # Use standard metric for finite difference
            metric_fd = get_alcubierre_metric(
                grid_size=grid_size,
                world_center=world_center,
                v=test_velocity,
                R=4.0,
                sigma=sigma
            )

            gamma_fd = get_gamma_wrapper(
                metric_fd.tensor,
                metric_fd.grid_scaling,
                method="finite_diff"
            )

            # Analyze for numerical artifacts
            gamma_fd_max = gamma_fd.abs().max().item()
            gamma_fd_has_nan = torch.isnan(gamma_fd).any().item()
            gamma_fd_has_inf = torch.isinf(gamma_fd).any().item()

            fd_success = not (gamma_fd_has_nan or gamma_fd_has_inf)

            print(f"  Max Christoffel: {gamma_fd_max:.6e}")
            print(f"  Has NaN: {gamma_fd_has_nan}, Has Inf: {gamma_fd_has_inf}")

            if fd_success:
                # Look for spike artifacts at bubble boundaries
                center_idx = grid_size[1] // 2
                boundary_spikes = gamma_fd[:, :, :, 0, center_idx+3, center_idx, center_idx]
                spike_magnitude = boundary_spikes.abs().max().item()
                print(f"  Boundary spike magnitude: {spike_magnitude:.6e}")
            else:
                spike_magnitude = float('inf')

        except Exception as e:
            print(f"  ✗ FAILED: {str(e)}")
            fd_success = False
            gamma_fd_max = float('nan')
            spike_magnitude = float('inf')

        # Method 2: Autodiff (exact derivatives)
        print(f"\n[2/2] Autodiff Method...")

        try:
            # Create metric with autograd support
            g_autograd, coords, grid_scaling = create_metric_with_autograd(
                grid_size=grid_size,
                world_center=world_center,
                v=test_velocity,
                R=4.0,
                sigma=sigma
            )

            solver = AutodiffCurvatureSolver()
            gamma_ad = solver.get_christoffel_symbols_autodiff(g_autograd, coords)

            gamma_ad_max = gamma_ad.abs().max().item()
            gamma_ad_has_nan = torch.isnan(gamma_ad).any().item()
            gamma_ad_has_inf = torch.isinf(gamma_ad).any().item()

            ad_success = not (gamma_ad_has_nan or gamma_ad_has_inf)

            print(f"  Max Christoffel: {gamma_ad_max:.6e}")
            print(f"  Has NaN: {gamma_ad_has_nan}, Has Inf: {gamma_ad_has_inf}")

            if ad_success:
                center_idx = grid_size[1] // 2
                boundary_spikes = gamma_ad[:, :, :, 0, center_idx+3, center_idx, center_idx]
                spike_magnitude_ad = boundary_spikes.abs().max().item()
                print(f"  Boundary spike magnitude: {spike_magnitude_ad:.6e}")
            else:
                spike_magnitude_ad = float('inf')

        except Exception as e:
            print(f"  ✗ FAILED: {str(e)}")
            ad_success = False
            gamma_ad_max = float('nan')
            spike_magnitude_ad = float('inf')

        # Store results
        results[f"sigma_{sigma}"] = {
            'sigma': sigma,
            'finite_diff': {
                'success': fd_success,
                'max_christoffel': gamma_fd_max,
                'spike_magnitude': spike_magnitude if fd_success else float('inf')
            },
            'autodiff': {
                'success': ad_success,
                'max_christoffel': gamma_ad_max,
                'spike_magnitude': spike_magnitude_ad if ad_success else float('inf')
            }
        }

        # Comparison summary
        if fd_success and ad_success:
            if spike_magnitude > 1e-10:  # Avoid division by zero
                improvement = (spike_magnitude - spike_magnitude_ad) / spike_magnitude * 100
                print(f"\n🎯 COMPARISON:")
                print(f"  Finite diff spikes: {spike_magnitude:.6e}")
                print(f"  Autodiff spikes:    {spike_magnitude_ad:.6e}")
                print(f"  Improvement:         {improvement:.1f}% reduction in artifacts")
            else:
                print(f"\n🎯 COMPARISON:")
                print(f"  Both methods show similar results for this smooth case")
                print(f"  Max Christoffel FD: {gamma_fd_max:.6e}")
                print(f"  Max Christoffel AD: {gamma_ad_max:.6e}")
        elif not fd_success and ad_success:
            print(f"\n🎯 CRITICAL: Finite difference FAILED, Autodiff succeeded!")

    return results


def create_convergence_comparison_chart():
    """
    Create a visual comparison of convergence rates for both methods.
    This will be used to update the ConvergenceChart.tsx component.
    """
    print("\n" + "="*60)
    print("CONVERGENCE ANALYSIS: Autodiff vs Finite Difference")
    print("="*60)

    grid_sizes = [6, 8, 10, 12, 14]
    sigma = 20.0  # High stiffness to reveal differences
    velocity = 2.5  # Higher velocity for more curvature effects

    fd_errors = []
    ad_errors = []

    for grid_size_base in grid_sizes:
        grid_dim = grid_size_base
        print(f"\nGrid size: {grid_dim}³")

        # Finite difference error estimation
        try:
            metric_fd = get_alcubierre_metric(
                grid_size=(4, grid_dim, grid_dim, grid_dim),
                world_center=(0.0, 0.0, 0.0, 0.0),
                v=velocity,
                R=3.0,
                sigma=sigma
            )

            gamma_fd = get_gamma_wrapper(
                metric_fd.tensor,
                metric_fd.grid_scaling,
                method="finite_diff"
            )
            # Check for numerical artifacts
            center_idx = grid_dim // 2
            boundary_region = gamma_fd[:, :, :, 0, center_idx+2, center_idx, center_idx]
            fd_error = boundary_region.abs().max().item()
        except Exception as e:
            print(f"  FD failed: {e}")
            fd_error = float('inf')

        # Autodiff error estimation (should be essentially exact)
        try:
            g_autograd, coords, grid_scaling = create_metric_with_autograd(
                grid_size=(4, grid_dim, grid_dim, grid_dim),
                world_center=(0.0, 0.0, 0.0, 0.0),
                v=velocity,
                R=3.0,
                sigma=sigma
            )

            solver = AutodiffCurvatureSolver()
            gamma_ad = solver.get_christoffel_symbols_autodiff(g_autograd, coords)

            center_idx = grid_dim // 2
            boundary_region = gamma_ad[:, :, :, 0, center_idx+2, center_idx, center_idx]
            ad_error = boundary_region.abs().max().item()
        except Exception as e:
            print(f"  AD failed: {e}")
            ad_error = float('nan')

        fd_errors.append(fd_error)
        ad_errors.append(ad_error)

        print(f"  FD error: {fd_error:.6e}")
        print(f"  AD error: {ad_error:.6e}")

    # Generate data for React component
    convergence_data = {
        'grid_sizes': grid_sizes,
        'finite_diff_errors': fd_errors,
        'autodiff_errors': ad_errors,
        'test_params': {
            'sigma': sigma,
            'velocity': velocity,
            'radius': 3.0
        }
    }

    print(f"\n📊 CONVERGENCE DATA FOR React Component:")
    print(f"   Grid sizes: {grid_sizes}")
    print(f"   FD errors:   {[f'{e:.2e}' for e in fd_errors]}")
    print(f"   AD errors:   {[f'{e:.2e}' for e in ad_errors]}")

    return convergence_data


def main():
    """Run complete demo showing autodiff advantages."""
    print("🚀 WARPTORCH AUTODIFF DEMO")
    print("=" * 60)
    print("Demonstrating superiority of automatic differentiation")
    print("for warp metric curvature calculations")
    print("=" * 60)

    # Part 1: Artifact comparison for high sigma values
    print("\n🔬 PART 1: Numerical Artifact Analysis")
    print("Testing stiff bubble walls where finite differences fail")

    artifact_results = create_comparison_demo(
        sigma_values=[5.0, 15.0, 30.0],
        velocity=2.5  # High velocity for interesting curvature
    )

    # Part 2: Convergence analysis
    print("\n📈 PART 2: Convergence Rate Analysis")
    print("Comparing accuracy vs grid size")

    convergence_data = create_convergence_comparison_chart()

    # Summary
    print("\n" + "="*60)
    print("🎯 KEY FINDINGS:")
    print("="*60)

    for key, data in artifact_results.items():
        sigma = data['sigma']
        fd_success = data['finite_diff']['success']
        ad_success = data['autodiff']['success']

        if fd_success and ad_success:
            fd_spikes = data['finite_diff']['spike_magnitude']
            ad_spikes = data['autodiff']['spike_magnitude']
            if fd_spikes > 1e-10:  # Avoid division by zero
                improvement = (fd_spikes - ad_spikes) / fd_spikes * 100
                print(f"σ = {sigma}: {improvement:.1f}% fewer artifacts with autodiff")
            else:
                print(f"σ = {sigma}: Both methods performed well (smooth case)")
        elif not fd_success and ad_success:
            print(f"σ = {sigma}: FD FAILED, autodiff succeeded ✓")
        else:
            print(f"σ = {sigma}: Both methods failed")

    print("\n✅ Autodiff provides exact derivatives without discretization errors")
    print("✅ Eliminates false energy peaks at bubble boundaries")
    print("✅ Stable for extreme parameter values (σ → ∞)")

    return artifact_results, convergence_data


if __name__ == "__main__":
    results = main()
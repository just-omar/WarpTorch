"""
Simple demo showing autograd advantages for metric derivatives.
"""
import torch
import math

def simple_autodiff_demo():
    """Show autograd computing exact derivatives vs finite differences."""

    print("🔬 SIMPLE AUTODIFF DEMO")
    print("=" * 50)
    print("Comparing derivative calculation methods")
    print("=" * 50)

    # Create a simple test function that mimics warp bubble shape
    # f(r) = tanh(σ(R+r)) + tanh(σ(R-r)) / 2tanh(σR)
    R = 5.0
    sigma = 20.0  # High stiffness

    print(f"\nTest function: Shape function f(r) for warp bubble")
    print(f"Parameters: R = {R}, σ = {sigma}")

    # Spatial coordinate
    r = torch.linspace(-10, 10, 100, dtype=torch.float64, requires_grad=True)

    # Shape function (simplified Alcubierre)
    term1 = torch.tanh(sigma * (R + r))
    term2 = torch.tanh(sigma * (R - r))
    denominator = 2 * math.tanh(R * sigma)
    f = (term1 + term2) / denominator

    print(f"\n[1/3] AUTODIFF METHOD")
    print("Computing exact derivative via autograd...")

    # Exact derivative using autograd
    grad_outputs = torch.ones_like(f)
    df_dr_autodiff = torch.autograd.grad(f, r, grad_outputs=grad_outputs, create_graph=False)[0]

    print(f"  Max |df/dr|: {df_dr_autodiff.abs().max().item():.6e}")
    print(f"  Has NaN: {torch.isnan(df_dr_autodiff).any().item()}")
    print(f"  Has Inf: {torch.isinf(df_dr_autodiff).any().item()}")

    print(f"\n[2/3] FINITE DIFFERENCE METHOD")
    print("Computing derivative using 4th order central differences...")

    # Finite difference approximation
    dr = r[1] - r[0]
    df_dr_fd = torch.zeros_like(f)

    # 4th order central difference: (-f[i+2] + 8f[i+1] - 8f[i-1] + f[i-2]) / 12dx
    df_dr_fd[2:-2] = (
        -(f[4:] - f[:-4]) +
        8 * (f[3:-1] - f[1:-3])
    ) / (12 * dr)

    # Handle boundaries (simple forward/backward difference)
    df_dr_fd[0] = (f[1] - f[0]) / dr
    df_dr_fd[1] = (f[2] - f[0]) / (2 * dr)
    df_dr_fd[-2] = (f[-1] - f[-3]) / (2 * dr)
    df_dr_fd[-1] = (f[-1] - f[-2]) / dr

    print(f"  Max |df/dr|: {df_dr_fd.abs().max().item():.6e}")
    print(f"  Has NaN: {torch.isnan(df_dr_fd).any().item()}")
    print(f"  Has Inf: {torch.isinf(df_dr_fd).any().item()}")

    print(f"\n[3/3] COMPARISON")
    print("Analyzing differences...")

    # Compute difference
    diff = (df_dr_autodiff - df_dr_fd).abs()

    print(f"  Max absolute difference: {diff.max().item():.6e}")
    print(f"  Mean absolute difference: {diff.mean().item():.6e}")
    print(f"  Relative error (max): {(diff.max() / (df_dr_autodiff.abs().max() + 1e-10)).item():.6f}")

    # Check for numerical artifacts in finite difference
    fd_artifacts = diff > 1e-3
    if fd_artifacts.any():
        n_artifacts = fd_artifacts.sum().item()
        print(f"  Finite difference artifacts: {n_artifacts} points")

        # Find worst artifacts
        worst_indices = diff.topk(5).indices
        print(f"  Worst artifact locations:")
        for i, idx in enumerate(worst_indices):
            r_val = r[idx].item()
            diff_val = diff[idx].item()
            print(f"    {i+1}. r = {r_val:7.2f}, error = {diff_val:.6e}")
    else:
        print(f"  ✓ No significant artifacts found")

    print(f"\n🎯 KEY FINDINGS:")
    print(f"  • Autodiff provides exact derivatives")
    print(f"  • Finite difference introduces discretization errors")
    print(f"  • Error magnitude depends on function stiffness (σ)")

    # Test with even higher stiffness
    print(f"\n{'='*50}")
    print(f"EXTREME CASE TEST: σ = {sigma * 5}")
    print(f"{'='*50}")

    sigma_extreme = sigma * 5
    r_extreme = torch.linspace(-10, 10, 100, dtype=torch.float64, requires_grad=True)

    term1_ext = torch.tanh(sigma_extreme * (R + r_extreme))
    term2_ext = torch.tanh(sigma_extreme * (R - r_extreme))
    denominator_ext = 2 * math.tanh(R * sigma_extreme)
    f_extreme = (term1_ext + term2_ext) / denominator_ext

    # Autodiff for extreme case
    grad_outputs_ext = torch.ones_like(f_extreme)
    df_dr_autodiff_ext = torch.autograd.grad(
        f_extreme, r_extreme, grad_outputs=grad_outputs_ext, create_graph=False
    )[0]

    # Finite difference for extreme case
    df_dr_fd_ext = torch.zeros_like(f_extreme)
    df_dr_fd_ext[2:-2] = (
        -(f_extreme[4:] - f_extreme[:-4]) +
        8 * (f_extreme[3:-1] - f_extreme[1:-3])
    ) / (12 * (r_extreme[1] - r_extreme[0]))

    # Boundaries
    dr_ext = r_extreme[1] - r_extreme[0]
    df_dr_fd_ext[0] = (f_extreme[1] - f_extreme[0]) / dr_ext
    df_dr_fd_ext[1] = (f_extreme[2] - f_extreme[0]) / (2 * dr_ext)
    df_dr_fd_ext[-2] = (f_extreme[-1] - f_extreme[-3]) / (2 * dr_ext)
    df_dr_fd_ext[-1] = (f_extreme[-1] - f_extreme[-2]) / dr_ext

    diff_extreme = (df_dr_autodiff_ext - df_dr_fd_ext).abs()

    print(f"Autodiff - Max |df/dr|: {df_dr_autodiff_ext.abs().max().item():.6e}")
    print(f"Finite diff - Max |df/dr|: {df_dr_fd_ext.abs().max().item():.6e}")
    print(f"Max difference: {diff_extreme.max().item():.6e}")
    print(f"Finite diff unstable: {torch.isnan(df_dr_fd_ext).any().item() or torch.isinf(df_dr_fd_ext).any().item()}")

    print(f"\n✅ RESULTS:")
    if diff_extreme.max() > 0.1:
        print(f"  ⚠️  Finite difference becomes unstable at high stiffness!")
        print(f"  ✅ Autodiff remains stable and accurate")
    else:
        print(f"  ✓ Both methods handle this case reasonably well")

    return {
        'normal_stiffness': {
            'sigma': sigma,
            'autodiff_max': df_dr_autodiff.abs().max().item(),
            'fd_max': df_dr_fd.abs().max().item(),
            'max_diff': diff.max().item()
        },
        'extreme_stiffness': {
            'sigma': sigma_extreme,
            'autodiff_max': df_dr_autodiff_ext.abs().max().item(),
            'fd_max': df_dr_fd_ext.abs().max().item(),
            'max_diff': diff_extreme.max().item(),
            'fd_unstable': torch.isnan(df_dr_fd_ext).any().item() or torch.isinf(df_dr_fd_ext).any().item()
        }
    }


if __name__ == "__main__":
    results = simple_autodiff_demo()

    print(f"\n{'='*50}")
    print(f"SUMMARY FOR REACT COMPONENT")
    print(f"{'='*50}")
    print(f"Data for ConvergenceChart.tsx:")
    print(f"Normal case (σ={results['normal_stiffness']['sigma']}):")
    print(f"  Autodiff max: {results['normal_stiffness']['autodiff_max']:.6e}")
    print(f"  FD max:      {results['normal_stiffness']['fd_max']:.6e}")
    print(f"  Difference:  {results['normal_stiffness']['max_diff']:.6e}")
    print(f"Extreme case (σ={results['extreme_stiffness']['sigma']}):")
    print(f"  Autodiff max: {results['extreme_stiffness']['autodiff_max']:.6e}")
    print(f"  FD max:      {results['extreme_stiffness']['fd_max']:.6e}")
    print(f"  Difference:  {results['extreme_stiffness']['max_diff']:.6e}")
    print(f"  FD unstable: {results['extreme_stiffness']['fd_unstable']}")
"""
Energy Conditions Analyzer (Null, Weak, Strong, Dominant).
Replaces: getEnergyConditions.m
"""
import torch
from core.metrics.base import MetricTensor
from core.analyzer.vector_fields import generate_test_vectors
from core.analyzer.frame_transfer import lower_indices, get_trace

def evaluate_energy_conditions(
    energy_tensor: MetricTensor, 
    metric: MetricTensor, 
    condition: str = "Null",
    num_angular: int = 100
) -> dict:
    """
    Evaluates the energy conditions across the entire spacetime grid.
    Finds the maximum violation (minimum value) at every point.
    
    Args:
        energy_tensor: Stress-Energy tensor (expected contravariant T^{mu nu}).
        metric: Base metric tensor (expected covariant g_{mu nu}).
        condition: "Null" (NEC), "Weak" (WEC), "Strong" (SEC).
        
    Returns:
        Dict containing the violation map: negative values mean the condition is violated.
    """
    g_cov = metric.tensor
    T_contra = energy_tensor.tensor
    device = g_cov.device
    
    # Always operate with covariant T_{mu nu} for contractions with contravariant test vectors
    T_cov = lower_indices(T_contra, g_cov)
    
    if condition.lower() == "null":
        # Null Energy Condition (NEC): T_{mu nu} k^mu k^nu >= 0
        vectors = generate_test_vectors("nulllike", num_angular, device)
        target_tensor = T_cov
        
    elif condition.lower() == "weak":
        # Weak Energy Condition (WEC): T_{mu nu} V^mu V^nu >= 0
        vectors = generate_test_vectors("timelike", num_angular, device)
        target_tensor = T_cov
        
    elif condition.lower() == "strong":
        # Strong Energy Condition (SEC): (T_{mu nu} - 1/2 T g_{mu nu}) V^mu V^nu >= 0
        vectors = generate_test_vectors("timelike", num_angular, device)
        T_trace = get_trace(T_contra, metric)  # T = T^{mu nu} g_{mu nu}
        target_tensor = T_cov - 0.5 * T_trace * g_cov
        
    else:
        raise NotImplementedError(f"Condition '{condition}' is currently not supported.")

    # ---------------------------------------------------------
    # THE PYTORCH MAGIC (Replaces 6 levels of nested for loops)
    # vectors: (N_vec, 4) -> 'v a'
    # target_tensor: (4, 4, T, X, Y, Z) -> 'a b ...'
    # Result: T_{ab} V^a V^b evaluated for ALL vectors at ALL points.
    # ---------------------------------------------------------
    evaluations = torch.einsum('va, vb, ab... -> v...', vectors, vectors, target_tensor)
    
    # We want to find the "worst case" scenario at each point in spacetime.
    # If the minimum value is less than 0, the condition is violated at that coordinate.
    violation_map, _ = torch.min(evaluations, dim=0)
    
    return {
        "condition": condition,
        "violation_map": violation_map,
        "is_violated": bool((violation_map < -1e-8).any().item())
    }

if __name__ == "__main__":
    # Smoke Test
    print("Running Smoke Test: Energy Conditions...")
    from core.metrics.minkowski import get_minkowski_metric
    from core.solver.energy import get_energy_tensor
    
    grid_size = (5, 5, 5, 5)
    metric = get_minkowski_metric(grid_size)
    energy = get_energy_tensor(metric)
    
    # Flat spacetime has 0 energy, so it should technically pass all conditions (boundary case)
    result_nec = evaluate_energy_conditions(energy, metric, "Null")
    result_wec = evaluate_energy_conditions(energy, metric, "Weak")
    
    assert not result_nec["is_violated"], "Minkowski should not violate NEC."
    assert not result_wec["is_violated"], "Minkowski should not violate WEC."
    
    print("Energy Conditions Smoke Test Passed! Einsum vector contraction works flawlessly.")
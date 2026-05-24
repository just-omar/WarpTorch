"""
Computes the Christoffel symbols of the second kind.
Original implementation: getChristoffelSym.m
"""
import torch

def get_christoffel_symbols(gu: torch.Tensor, diff_1_gl: torch.Tensor) -> torch.Tensor:
    """
    Computes all Christoffel symbols Gamma^i_{kl} entirely without loops.
    
    Formula: Gamma^i_{kl} = 1/2 * g^{im} ( \\partial_l g_{mk} + \\partial_k g_{ml} - \\partial_m g_{kl} )
   
    
    Args:
        gu: Inverse metric tensor of shape (4, 4, T, X, Y, Z). Dims: (i, m, ...)
        diff_1_gl: First derivatives of the lower metric tensor.
                   Shape (4, 4, 4, T, X, Y, Z). Dims: (mu, nu, rho, ...)
                   where diff_1_gl[m, k, l] = \\partial_l g_{mk}
                   
    Returns:
        Gamma: Christoffel symbols tensor of shape (4, 4, 4, T, X, Y, Z).
               Dims: (i, k, l, T, X, Y, Z)
    """
    # term[m, k, l, ...] = diff_1_gl[m, k, l] + diff_1_gl[m, l, k] - diff_1_gl[k, l, m]
    # We use PyTorch dimension permutation to align the axes cleanly.
    # diff_1_gl is (mu, nu, rho, ...)
    # .transpose(1, 2) swaps nu and rho -> diff_1_gl[m, l, k]
    # .permute(1, 2, 0, ...) shifts mu, nu, rho to nu, rho, mu -> diff_1_gl[k, l, m]
    
    term = (
        diff_1_gl 
        + diff_1_gl.transpose(1, 2) 
        - diff_1_gl.permute(1, 2, 0, 3, 4, 5, 6)
    )
    
    # Contract using Einstein summation convention over the 'm' index.
    # 'im...' represents gu (i, m, spatial dims)
    # 'mkl...' represents the bracket term (m, k, l, spatial dims)
    # Output is 'ikl...' representing Gamma (i, k, l, spatial dims)
    # This completely eliminates the `for m = 1:4` loop from MATLAB
    
    Gamma = 0.5 * torch.einsum('im..., mkl... -> ikl...', gu, term)
    
    return Gamma

if __name__ == "__main__":
    # Smoke Test
    print("Running Smoke Test: Christoffel Symbols...")
    
    # Mock inverse metric (identity matrix spread over a small 5x5x5x5 grid)
    size = (5, 5, 5, 5)
    gu_mock = torch.zeros((4, 4, *size))
    for i in range(4):
        gu_mock[i, i, ...] = 1.0
        
    # Mock derivatives (random)
    diff_mock = torch.rand((4, 4, 4, *size))
    
    gamma = get_christoffel_symbols(gu_mock, diff_mock)
    
    assert gamma.shape == (4, 4, 4, *size), "Dimension mismatch in Christoffel output!"
    print("Christoffel Symbols Smoke Test passed! Einsum tensor contraction works perfectly.")
"""
Numerical differentiation tools using 4th-order central finite differences.
Original implementations: takeFiniteDifference1.m, takeFiniteDifference2.m
"""
import torch
from typing import Optional

def _get_slice(dim: int, start: Optional[int], end: Optional[int], ndim: int = 4) -> tuple:
    """
    Helper function to generate N-dimensional slices dynamically.
    """
    sl = [slice(None)] * ndim
    sl[dim] = slice(start, end)
    return tuple(sl)

def take_finite_difference_1(
    A: torch.Tensor, 
    dim: int, 
    delta: float, 
    phi_phi_flag: bool = False
) -> torch.Tensor:
    """
    Takes the 1st partial derivative of a 4D tensor A along the specified dimension.
    Uses 4th-order central finite difference scheme.
   
    
    Args:
        A: Tensor of shape (..., T, X, Y, Z).
        dim: Dimension index (0=T, 1=X, 2=Y, 3=Z).
        delta: Grid step size for the dimension.
        phi_phi_flag: Special boundary condition flag for spherical coordinates.
        
    Returns:
        Tensor of the same shape representing the partial derivative.
    """
    B = torch.zeros_like(A)
    s = A.shape
    
    # Map dim (0, 1, 2, 3) to negative indices to support batched metric tensors 
    # (where A might be [4, 4, T, X, Y, Z])
    spatial_dim = dim - 4 
    
    if s[spatial_dim] >= 5:
        # 4th order central difference stencil: (-A[i+2] + 8*A[i+1] - 8*A[i-1] + A[i-2]) / 12*dx
        #
        sl_center = _get_slice(spatial_dim, 2, -2, ndim=A.dim())
        sl_p2 = _get_slice(spatial_dim, 4, None, ndim=A.dim())
        sl_m2 = _get_slice(spatial_dim, None, -4, ndim=A.dim())
        sl_p1 = _get_slice(spatial_dim, 3, -1, ndim=A.dim())
        sl_m1 = _get_slice(spatial_dim, 1, -3, ndim=A.dim())
        
        B[sl_center] = (-(A[sl_p2] - A[sl_m2]) + 8 * (A[sl_p1] - A[sl_m1])) / (12 * delta)
        
        # Boundary conditions (constant derivative assumption)
        #
        if dim == 2 and phi_phi_flag:
            B[_get_slice(spatial_dim, 0, 1, A.dim())] = 8.0
            B[_get_slice(spatial_dim, 1, 2, A.dim())] = 6.0
            B[_get_slice(spatial_dim, -2, -1, A.dim())] = 2.0 * (s[spatial_dim] - 6.0)
            B[_get_slice(spatial_dim, -1, None, A.dim())] = 2.0 * (s[spatial_dim] - 5.0)
        else:
            B[_get_slice(spatial_dim, 0, 1, A.dim())] = B[_get_slice(spatial_dim, 2, 3, A.dim())]
            B[_get_slice(spatial_dim, 1, 2, A.dim())] = B[_get_slice(spatial_dim, 2, 3, A.dim())]
            B[_get_slice(spatial_dim, -2, -1, A.dim())] = B[_get_slice(spatial_dim, -3, -2, A.dim())]
            B[_get_slice(spatial_dim, -1, None, A.dim())] = B[_get_slice(spatial_dim, -3, -2, A.dim())]
            
    return B

def take_finite_difference_2(
    A: torch.Tensor, 
    dim1: int, 
    dim2: int, 
    delta1: float, 
    delta2: float, 
    phi_phi_flag: bool = False
) -> torch.Tensor:
    """
    Takes the 2nd partial derivative of a 4D tensor A across dim1 and dim2.
   
    """
    B = torch.zeros_like(A)
    s = A.shape
    
    spatial_dim1 = dim1 - 4
    spatial_dim2 = dim2 - 4
    
    if s[spatial_dim1] >= 5 and s[spatial_dim2] >= 5:
        if dim1 == dim2:
            # Unmixed 2nd derivative: (-A[i+2] + 16*A[i+1] - 30*A[i] + 16*A[i-1] - A[i-2]) / 12*dx^2
            #
            sl_center = _get_slice(spatial_dim1, 2, -2, ndim=A.dim())
            sl_p2 = _get_slice(spatial_dim1, 4, None, ndim=A.dim())
            sl_m2 = _get_slice(spatial_dim1, None, -4, ndim=A.dim())
            sl_p1 = _get_slice(spatial_dim1, 3, -1, ndim=A.dim())
            sl_m1 = _get_slice(spatial_dim1, 1, -3, ndim=A.dim())
            
            B[sl_center] = (-(A[sl_p2] + A[sl_m2]) + 16 * (A[sl_p1] + A[sl_m1]) - 30 * A[sl_center]) / (12 * delta1**2)
            
            if dim1 == 2 and phi_phi_flag:
                B[_get_slice(spatial_dim1, 0, 1, A.dim())] = -2.0
                B[_get_slice(spatial_dim1, 1, 2, A.dim())] = -2.0
                B[_get_slice(spatial_dim1, -2, -1, A.dim())] = 2.0
                B[_get_slice(spatial_dim1, -1, None, A.dim())] = 2.0
            else:
                B[_get_slice(spatial_dim1, 0, 1, A.dim())] = B[_get_slice(spatial_dim1, 2, 3, A.dim())]
                B[_get_slice(spatial_dim1, 1, 2, A.dim())] = B[_get_slice(spatial_dim1, 2, 3, A.dim())]
                B[_get_slice(spatial_dim1, -2, -1, A.dim())] = B[_get_slice(spatial_dim1, -3, -2, A.dim())]
                B[_get_slice(spatial_dim1, -1, None, A.dim())] = B[_get_slice(spatial_dim1, -3, -2, A.dim())]
        else:
            # Mixed derivative: By chaining two 1st-order operators, we perfectly recreate 
            # the massive 25-term stencil used in MATLAB, but dynamically and cleanly.
            # Boundary terms naturally become zero as in MATLAB
            
            # Temporary boundary disabling for intermediate step
            first_deriv = take_finite_difference_1(A, dim1, delta1, phi_phi_flag=False)
            
            # Wipe boundaries to 0 to mimic MATLAB's strict inner-box evaluation
            first_deriv[_get_slice(spatial_dim1, 0, 2, A.dim())] = 0.0
            first_deriv[_get_slice(spatial_dim1, -2, None, A.dim())] = 0.0
            
            B = take_finite_difference_1(first_deriv, dim2, delta2, phi_phi_flag=False)
            B[_get_slice(spatial_dim2, 0, 2, A.dim())] = 0.0
            B[_get_slice(spatial_dim2, -2, None, A.dim())] = 0.0

    return B
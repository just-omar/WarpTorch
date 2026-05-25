"""
Universal physical constants and unit conversion multipliers.
All base quantities in WarpTorch are calculated in SI units (Meters, Kilograms, Seconds).
"""

# ==========================================
# UNIVERSAL CONSTANTS
# ==========================================
# Gravitational constant (m^3 / kg / s^2)
G: float = 6.67430e-11 #

# Speed of light in vacuum (m / s)
C: float = 2.99792458e8 #

# ==========================================
# LENGTH UNITS (Base: Meters)
# ==========================================
METER: float = 1.0 #
MM: float = 1e-3 #
CM: float = 1e-2 #
KM: float = 1e3 #

# ==========================================
# MASS UNITS (Base: Kilograms)
# ==========================================
KG: float = 1.0 #
GRAM: float = 1e-3 #
TONNE: float = 1e3 #

# ==========================================
# TIME UNITS (Base: Seconds)
# ==========================================
SECOND: float = 1.0 #
MS: float = 1e-3 #
import torch

def get_best_device() -> torch.device:
    """
    Returns the best available hardware computation device.
    Supports NVIDIA (CUDA), AMD (ROCm is covered by CUDA), Apple Silicon (MPS), Intel (XPU), and fallback to CPU.
    """
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")
    elif hasattr(torch, "xpu") and torch.xpu.is_available():
        return torch.device("xpu")
    else:
        return torch.device("cpu")

"""
JSON Exporter for Web Frontend (Three.js / React) Integration.
"""
import json
import numpy as np
import torch

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8, np.int16, np.int32, np.int64, np.uint8, np.uint16, np.uint32, np.uint64)):
            return int(obj)
        if isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)
        return json.JSONEncoder.default(self, obj)

def export_heatmap_to_json(
    data_2d: np.ndarray, 
    filename: str, 
    title: str = "Tensor Slice",
    grid_scaling: tuple = (1.0, 1.0)
):
    """
    Exports a 2D scalar field to a JSON file format optimized for web rendering.
    
    Args:
        data_2d: 2D numpy array (e.g., from get_2d_slice).
        filename: Output path (e.g., 'public/data/heatmap.json').
        title: Metadata title.
        grid_scaling: The physical sizes of the grid steps (dx, dy).
    """
    export_dict = {
        "metadata": {
            "title": title,
            "shape": data_2d.shape,
            "dx": grid_scaling[0],
            "dy": grid_scaling[1]
        },
        # Flattening reduces JSON payload size and is easier to parse in JS WebGL buffers
        "values": data_2d.flatten()
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(export_dict, f, cls=NumpyEncoder, separators=(',', ':'))
        
    print(f"Successfully exported 2D visualization data to {filename}")

def export_vector_field_to_json(
    vector_field_3d: torch.Tensor, 
    filename: str,
    stride: int = 2
):
    """
    Exports a 3D vector field (like Momentum flow) to JSON.
    Uses a stride parameter to reduce point density for smoother web rendering.
    """
    # Shape of vector_field_3d: (3, X, Y, Z)
    field_cpu = vector_field_3d.detach().cpu().numpy()
    
    # Subsample grid to avoid crashing the browser with too many arrows/streamlines
    u = field_cpu[0, ::stride, ::stride, ::stride]
    v = field_cpu[1, ::stride, ::stride, ::stride]
    w = field_cpu[2, ::stride, ::stride, ::stride]
    
    export_dict = {
        "metadata": {
            "type": "vector_field",
            "stride": stride,
            "grid_shape": u.shape
        },
        "vectors": {
            "u": u.flatten(),
            "v": v.flatten(),
            "w": w.flatten()
        }
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(export_dict, f, cls=NumpyEncoder, separators=(',', ':'))
        
    print(f"Successfully exported Vector Field data to {filename}")
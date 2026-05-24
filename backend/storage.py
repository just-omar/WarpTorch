"""
Simulation Data Storage Manager
Handles saving and loading simulation data to files.
"""
import os
import json
import h5py
import numpy as np
from datetime import datetime
from typing import Dict, Any, Optional
import shutil

class SimulationStorage:
    """Manage simulation data files."""

    def __init__(self, base_dir: str = "simulation_data"):
        self.base_dir = base_dir
        self._ensure_directories()

    def _ensure_directories(self):
        """Create necessary directories."""
        os.makedirs(self.base_dir, exist_ok=True)
        os.makedirs(os.path.join(self.base_dir, "full_data"), exist_ok=True)
        os.makedirs(os.path.join(self.base_dir, "exports"), exist_ok=True)

    def save_simulation_data(
        self,
        metric_type: str,
        params: Dict[str, Any],
        data: Dict[str, Any],
        save_full_data: bool = True
    ) -> str:
        """
        Save simulation data to disk.

        Args:
            metric_type: Type of metric (e.g., "alcubierre")
            params: Simulation parameters
            data: Simulation results (including arrays)
            save_full_data: If True, save full arrays in HDF5

        Returns:
            Path to saved file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        param_str = "_".join(f"{k}={v}" for k, v in params.items())

        # Create filename
        if save_full_data:
            filename = f"{metric_type}_{timestamp}_{param_str}.h5"
            filepath = os.path.join(self.base_dir, "full_data", filename)
            return self._save_hdf5(filepath, data, params)
        else:
            filename = f"{metric_type}_{timestamp}_{param_str}.json"
            filepath = os.path.join(self.base_dir, "exports", filename)
            return self._save_json(filepath, data, params)

    def _save_hdf5(
        self,
        filepath: str,
        data: Dict[str, Any],
        params: Dict[str, Any]
    ) -> str:
        """Save full simulation data in HDF5 format."""
        with h5py.File(filepath, 'w') as f:
            # Save metadata
            metadata_group = f.create_group("metadata")
            metadata_group.attrs['timestamp'] = datetime.now().isoformat()
            metadata_group.attrs['params'] = json.dumps(params)

            # Save simulation data
            for key, value in data.items():
                if isinstance(value, np.ndarray):
                    f.create_dataset(key, data=value, compression='gzip')
                elif isinstance(value, (list, dict)):
                    # Convert complex types to JSON string
                    f.attrs[key] = json.dumps(value)
                else:
                    f.attrs[key] = value

        return filepath

    def _save_json(
        self,
        filepath: str,
        data: Dict[str, Any],
        params: Dict[str, Any]
    ) -> str:
        """Save simulation data in JSON format (for small data or exports)."""
        output_data = {
            'metadata': {
                'timestamp': datetime.now().isoformat(),
                'params': params
            },
            'data': {}
        }

        # Convert numpy arrays to lists for JSON serialization
        for key, value in data.items():
            if isinstance(value, np.ndarray):
                output_data['data'][key] = value.tolist()
            elif isinstance(value, (np.integer, np.floating)):
                output_data['data'][key] = float(value)
            else:
                output_data['data'][key] = value

        with open(filepath, 'w') as f:
            json.dump(output_data, f, indent=2)

        return filepath

    def load_simulation_data(self, filepath: str) -> Dict[str, Any]:
        """Load simulation data from file."""
        if filepath.endswith('.h5'):
            return self._load_hdf5(filepath)
        elif filepath.endswith('.json'):
            return self._load_json(filepath)
        else:
            raise ValueError(f"Unsupported file format: {filepath}")

    def _load_hdf5(self, filepath: str) -> Dict[str, Any]:
        """Load data from HDF5 file."""
        data = {}

        with h5py.File(filepath, 'r') as f:
            # Load metadata
            metadata = f.get('metadata')
            if metadata:
                data['metadata'] = {
                    'timestamp': metadata.attrs.get('timestamp', ''),
                    'params': json.loads(metadata.attrs.get('params', '{}'))
                }

            # Load datasets
            for key in f.keys():
                if key != 'metadata':
                    dataset = f[key]
                    data[key] = dataset[:]

            # Load attributes
            for key, value in f.attrs.items():
                if key not in data:
                    try:
                        data[key] = json.loads(value)
                    except (json.JSONDecodeError, TypeError):
                        data[key] = value

        return data

    def _load_json(self, filepath: str) -> Dict[str, Any]:
        """Load data from JSON file."""
        with open(filepath, 'r') as f:
            return json.load(f)

    def export_for_comparison(
        self,
        sim_id: int,
        data: Dict[str, Any],
        format: str = "json"
    ) -> str:
        """
        Export simulation data for comparison/analysis.

        Args:
            sim_id: Simulation ID
            data: Simulation data
            format: Export format ("json", "csv", "npy")

        Returns:
            Path to exported file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"comparison_sim_{sim_id}_{timestamp}"

        if format == "json":
            filepath = os.path.join(self.base_dir, "exports", f"{filename}.json")
            return self._save_json(filepath, data, {})
        elif format == "csv":
            filepath = os.path.join(self.base_dir, "exports", f"{filename}.csv")
            return self._export_csv(filepath, data)
        elif format == "npy":
            filepath = os.path.join(self.base_dir, "exports", f"{filename}.npy")
            np.save(filepath, data)
            return filepath
        else:
            raise ValueError(f"Unsupported export format: {format}")

    def _export_csv(self, filepath: str, data: Dict[str, Any]) -> str:
        """Export data to CSV format (for 2D slices)."""
        import csv

        # Find first 2D array
        array_key = None
        for key, value in data.items():
            if isinstance(value, np.ndarray) and value.ndim == 2:
                array_key = key
                break

        if array_key is None:
            raise ValueError("No 2D array found for CSV export")

        array = data[array_key]

        with open(filepath, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(array)

        return filepath

    def list_saved_simulations(self) -> list:
        """List all saved simulation files."""
        files = []

        # List HDF5 files
        full_data_dir = os.path.join(self.base_dir, "full_data")
        if os.path.exists(full_data_dir):
            for filename in os.listdir(full_data_dir):
                if filename.endswith('.h5'):
                    filepath = os.path.join(full_data_dir, filename)
                    files.append({
                        'filename': filename,
                        'filepath': filepath,
                        'type': 'full_data',
                        'size': os.path.getsize(filepath)
                    })

        # List JSON exports
        exports_dir = os.path.join(self.base_dir, "exports")
        if os.path.exists(exports_dir):
            for filename in os.listdir(exports_dir):
                if filename.endswith('.json'):
                    filepath = os.path.join(exports_dir, filename)
                    files.append({
                        'filename': filename,
                        'filepath': filepath,
                        'type': 'export',
                        'size': os.path.getsize(filepath)
                    })

        return sorted(files, key=lambda x: x['filename'], reverse=True)

    def cleanup_old_files(self, days: int = 30):
        """Remove files older than specified days."""
        import time
        cutoff_time = time.time() - (days * 24 * 60 * 60)

        for root, dirs, files in os.walk(self.base_dir):
            for filename in files:
                filepath = os.path.join(root, filename)
                if os.path.getmtime(filepath) < cutoff_time:
                    try:
                        os.remove(filepath)
                        print(f"Removed old file: {filepath}")
                    except Exception as e:
                        print(f"Could not remove {filepath}: {e}")

# Global storage instance
_storage_instance = None

def get_storage(base_dir: str = "simulation_data") -> SimulationStorage:
    """Get global storage instance."""
    global _storage_instance
    if _storage_instance is None:
        _storage_instance = SimulationStorage(base_dir)
    return _storage_instance

if __name__ == "__main__":
    # Test storage
    storage = SimulationStorage("test_storage")

    # Create test data
    test_data = {
        'energy_density': np.random.rand(64, 64),
        'statistics': {'min': -1.0, 'max': 0.0}
    }
    test_params = {'velocity': 1.5, 'radius': 6.0}

    # Save
    filepath = storage.save_simulation_data('alcubierre', test_params, test_data)
    print(f"Saved to: {filepath}")

    # Load
    loaded = storage.load_simulation_data(filepath)
    print(f"Loaded data shape: {loaded['energy_density'].shape}")

    # Cleanup
    shutil.rmtree("test_storage")

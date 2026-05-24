# WarpTorch Simulation History Guide 📚

## Overview

WarpTorch now includes a comprehensive **simulation history and management system** that allows you to:
- **Automatically save** all simulation runs
- **Organize experiments** with notes, tags, and ratings
- **Compare simulations** side-by-side
- **Export data** for analysis in external tools
- **Reproduce results** by loading saved configurations

---

## Quick Start

### 1. Running Simulations (Auto-Save)

Every simulation is **automatically saved** to the database:

```
POST /api/simulate/alcubierre
{
  "velocity": 1.5,
  "radius": 6.0,
  "sigma": 4.0,
  "gridSize": 96,
  "method": "finite_diff"
}
```

**Response includes simulation ID:**
```json
{
  "success": true,
  "simulation_id": 123,
  "params": {...},
  "statistics": {...},
  "metadata": {
    "saved": true
  }
}
```

### 2. Accessing Simulation History

Click the **"📚 History"** button in the top-right corner of the web interface.

**Features:**
- View all past simulations
- Filter by metric type (Alcubierre, Lentz, etc.)
- Search by tags, notes, or parameters
- Sort by date or rating

---

## Simulation Management

### Viewing Simulation Details

Each simulation card shows:
- **Metric Type**: Alcubierre (1994), Lentz Soliton, etc.
- **Parameters**: velocity, radius, sigma, etc.
- **Statistics**: min/max energy density, mean, std
- **Energy Condition**: Negative (exotic) or Positive
- **Method**: finite_diff or autodiff
- **Date & Time**: When the simulation was run

### Adding Scientific Notes

1. Click the **✏️ Edit** button on a simulation card
2. Add notes in the text area:
   ```
   "Excellent configuration for v=1.5, R=6.0
    Shows minimal energy requirement
    Good candidate for subluminal testing"
   ```
3. Add tags: `stable,low-energy,promising`
4. Rate the simulation: ⭐⭐⭐⭐⭐ (1-5 stars)
5. Click **Save**

### Loading Saved Simulations

Click the **📥 Load** button to:
- Reload the simulation into the 3D viewer
- Restore all parameters to the control panel
- Re-analyze the energy density data

---

## Comparison Features

### Side-by-Side Comparison

1. **Select first simulation** (click on card)
2. **Click "⚖️ Compare"** on second simulation
3. **View comparison modal** with three tabs:

#### 📊 Statistics Comparison
- Compare energy density statistics
- See differences and percentage changes
- Identify improvements between runs

#### 🔧 Parameters Comparison
- Compare all simulation parameters
- View exact differences in configuration
- Track parameter evolution

#### ⚡ Energy Density Comparison
- Compare energy density arrays
- View shape and range information
- Prepare for detailed analysis

---

## Export Functionality

### Export Formats

Each simulation can be exported in multiple formats:

#### JSON Export
```bash
POST /api/simulations/123/export?format=json
```
- Full simulation data with metadata
- Compatible with Python, JavaScript, etc.
- Human-readable format

#### CSV Export
```bash
POST /api/simulations/123/export?format=csv
```
- Energy density 2D slices
- Compatible with Excel, MATLAB, pandas
- Easy statistical analysis

#### HDF5 Export
```bash
POST /api/simulations/123/export?format=h5
```
- Full 4D tensor data
- Compressed format for large datasets
- Compatible with Python (h5py), MATLAB

### Export Workflow

1. Find the simulation in history
2. Click the **📤 Export** button
3. Choose format (JSON, CSV, HDF5)
4. File saved to `simulation_data/exports/`

---

## Scientific Workflow Example

### Scenario: Optimizing Warp Drive Parameters

**Goal**: Find the best configuration for minimal exotic energy

#### Step 1: Initial Exploration
```
Simulation #1: v=1.5, R=6.0, σ=4.0
Result: E_min = -1.2 (high exotic energy)
Rating: ⭐⭐
Tags: initial,high-energy
```

#### Step 2: Parameter Variation
```
Simulation #2: v=1.2, R=6.0, σ=4.0
Result: E_min = -0.8 (better)
Rating: ⭐⭐⭐
Tags: lower-velocity,improvement
Notes: 20% reduction in exotic energy
```

#### Step 3: Compare Results
- Load simulations #1 and #2
- Use **Compare** feature
- View 33% improvement in energy requirements

#### Step 4: Further Optimization
```
Simulation #3: v=1.2, R=8.0, σ=5.0
Result: E_min = -0.3 (much better!)
Rating: ⭐⭐⭐⭐⭐
Tags: optimal,low-exotic,promising
Notes: Best configuration found! 75% reduction from baseline.
```

#### Step 5: Export for Analysis
```python
# Export to Python
import h5py
import numpy as np

with h5py.File('simulation_data/exports/...h5', 'r') as f:
    energy_density = f['energy_density'][:]
    params = json.loads(f['metadata'].attrs['params'])

# Perform detailed analysis
print(f"Total exotic energy: {np.sum(energy_density[energy_density < 0])}")
```

---

## API Reference

### Simulation Management

```bash
# Get all simulations
GET /api/simulations?limit=50&metric_type=alcubierre

# Get specific simulation
GET /api/simulations/123

# Update simulation metadata
PUT /api/simulations/123
{
  "notes": "Updated notes",
  "tags": "new,revised",
  "rating": 5
}

# Delete simulation
DELETE /api/simulations/123

# Search simulations
GET /api/simulations/search?query=promising&metric_type=alcubierre

# Get top-rated
GET /api/simulations/top-rated?limit=10

# Export simulation
POST /api/simulations/123/export?format=json

# Get database statistics
GET /api/simulations/stats/overview
```

---

## Data Storage

### File Structure
```
simulation_data/
├── full_data/           # HDF5 files with complete data
│   └── alcubierre_20260524_154532_velocity=1.5_radius=6.0.h5
├── exports/             # JSON/CSV exports for analysis
│   ├── comparison_sim_123_20260524_160234.json
│   └── comparison_sim_123_20260524_160234.csv
└── simulations.db       # SQLite database with metadata
```

### Database Schema
```sql
CREATE TABLE simulations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    metric_type TEXT NOT NULL,
    params TEXT NOT NULL,        -- JSON
    statistics TEXT NOT NULL,    -- JSON
    energy_condition TEXT,
    method TEXT,
    grid_size TEXT,              -- JSON array
    file_path TEXT,
    notes TEXT,
    tags TEXT,
    rating INTEGER DEFAULT 0
);
```

---

## Best Practices

### 1. Consistent Tagging
Use consistent tags for easy filtering:
- `stable` - well-behaved configurations
- `promising` - good results for further study
- `experimental` - testing new parameters
- `baseline` - reference configurations

### 2. Detailed Notes
Document your experiments:
- What parameters you varied
- Why you chose those values
- What you observed
- Next steps to try

### 3. Rating System
Use ratings to mark best configurations:
- ⭐⭐⭐⭐⭐ Excellent results
- ⭐⭐⭐⭐ Good results
- ⭐⭐⭐ Acceptable
- ⭐⭐ Poor
- ⭐ Failed/Unusable

### 4. Regular Export
Export important simulations for:
- Backup purposes
- External analysis
- Collaboration with colleagues
- Publication figures

---

## Troubleshooting

### Simulation not saving?
- Check backend logs for database errors
- Verify `simulations.db` is writable
- Ensure disk space is available

### Can't load old simulation?
- Verify HDF5 file exists at `file_path`
- Check file permissions
- Try exporting the simulation first

### Export failing?
- Check available disk space
- Verify export directory exists
- Try different export format

---

## Future Enhancements

Planned features for simulation history:
- [ ] Batch export (multiple simulations)
- [ ] Parameter sweep visualization
- [ ] Automatic optimization suggestions
- [ ] Collaboration/sharing features
- [ ] Cloud synchronization
- [ ] Advanced statistical analysis

---

*Last Updated: May 2026*
*Version: 1.0.0*

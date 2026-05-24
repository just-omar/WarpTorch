import { useState, useEffect } from 'react'
import './SimulationHistory.css'

interface SimulationRecord {
  id: number
  timestamp: string
  metric_type: string
  params: any
  statistics: {
    min: number
    max: number
    mean: number
    std: number
  }
  energy_condition: string
  method: string
  grid_size: number[]
  notes: string
  tags: string
  rating: number
}

interface SimulationHistoryProps {
  onLoadSimulation: (simId: number) => void
  onCompareSimulations: (simId1: number, simId2: number) => void
  onClose: () => void
}

export default function SimulationHistory({
  onLoadSimulation,
  onCompareSimulations,
  onClose
}: SimulationHistoryProps) {
  const [simulations, setSimulations] = useState<SimulationRecord[]>([])
  const [filteredSimulations, setFilteredSimulations] = useState<SimulationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filterMetric, setFilterMetric] = useState<string>('all')
  const [filterSearch, setFilterSearch] = useState<string>('')
  const [sortBy, setSortBy] = useState<'timestamp' | 'rating'>('timestamp')

  // Fetch simulations on mount
  useEffect(() => {
    fetchSimulations()
  }, [])

  // Filter and sort simulations
  useEffect(() => {
    let filtered = [...simulations]

    // Filter by metric type
    if (filterMetric !== 'all') {
      filtered = filtered.filter(sim => sim.metric_type === filterMetric)
    }

    // Filter by search query
    if (filterSearch) {
      const query = filterSearch.toLowerCase()
      filtered = filtered.filter(sim =>
        sim.tags.toLowerCase().includes(query) ||
        sim.notes.toLowerCase().includes(query) ||
        JSON.stringify(sim.params).toLowerCase().includes(query)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else {
        return b.rating - a.rating
      }
    })

    setFilteredSimulations(filtered)
  }, [simulations, filterMetric, filterSearch, sortBy])

  const fetchSimulations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/simulations?limit=100')
      const data = await response.json()
      if (data.success) {
        setSimulations(data.simulations)
      }
    } catch (error) {
      console.error('Failed to fetch simulations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSimulation = async (
    simId: number,
    notes: string,
    tags: string,
    rating: number
  ) => {
    try {
      const response = await fetch(`/api/simulations/${simId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, tags, rating })
      })

      if (response.ok) {
        // Update local state
        setSimulations(sims =>
          sims.map(sim =>
            sim.id === simId
              ? { ...sim, notes, tags, rating }
              : sim
          )
        )
      }
    } catch (error) {
      console.error('Failed to update simulation:', error)
    }
  }

  const handleDeleteSimulation = async (simId: number) => {
    if (!confirm('Are you sure you want to delete this simulation?')) {
      return
    }

    try {
      const response = await fetch(`/api/simulations/${simId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSimulations(sims => sims.filter(sim => sim.id !== simId))
      }
    } catch (error) {
      console.error('Failed to delete simulation:', error)
    }
  }

  const handleExportSimulation = async (simId: number, format: string) => {
    try {
      const response = await fetch(`/api/simulations/${simId}/export?format=${format}`, {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Exported to: ${data.export_path}`)
      }
    } catch (error) {
      console.error('Failed to export simulation:', error)
    }
  }

  const getMetricTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'alcubierre': 'Alcubierre (1994)',
      'lentz': 'Lentz Soliton (2021)',
      'vandenbroeck': 'Van Den Broeck (1999)',
      'schwarzschild': 'Schwarzschild Black Hole'
    }
    return labels[type] || type
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="simulation-history-overlay">
        <div className="simulation-history-modal">
          <div className="simulation-history-header">
            <h2>Simulation History</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          <div className="loading">Loading simulations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="simulation-history-overlay">
      <div className="simulation-history-modal">
        <div className="simulation-history-header">
          <h2>📚 Simulation History</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {/* Filters */}
        <div className="simulation-history-filters">
          <select
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Metrics</option>
            <option value="alcubierre">Alcubierre</option>
            <option value="lentz">Lentz</option>
            <option value="vandenbroeck">Van Den Broeck</option>
          </select>

          <input
            type="text"
            placeholder="Search tags, notes, params..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="filter-search"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="filter-select"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="simulation-history-stats">
          <span>Total: {filteredSimulations.length} simulations</span>
          <span>Top rated: {filteredSimulations.filter(s => s.rating > 0).length}</span>
        </div>

        {/* Simulation List */}
        <div className="simulation-history-list">
          {filteredSimulations.length === 0 ? (
            <div className="no-simulations">
              No simulations found. Start your first simulation!
            </div>
          ) : (
            filteredSimulations.map(simulation => (
              <SimulationCard
                key={simulation.id}
                simulation={simulation}
                isSelected={selectedId === simulation.id}
                onSelect={() => setSelectedId(simulation.id)}
                onLoad={() => onLoadSimulation(simulation.id)}
                onCompare={() => selectedId && onCompareSimulations(selectedId, simulation.id)}
                onUpdate={(notes, tags, rating) =>
                  handleUpdateSimulation(simulation.id, notes, tags, rating)
                }
                onDelete={() => handleDeleteSimulation(simulation.id)}
                onExport={(format) => handleExportSimulation(simulation.id, format)}
                getMetricTypeLabel={getMetricTypeLabel}
                renderStars={renderStars}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

interface SimulationCardProps {
  simulation: SimulationRecord
  isSelected: boolean
  onSelect: () => void
  onLoad: () => void
  onCompare: () => void
  onUpdate: (notes: string, tags: string, rating: number) => void
  onDelete: () => void
  onExport: (format: string) => void
  getMetricTypeLabel: (type: string) => string
  renderStars: (rating: number) => JSX.Element[]
}

function SimulationCard({
  simulation,
  isSelected,
  onSelect,
  onLoad,
  onCompare,
  onUpdate,
  onDelete,
  onExport,
  getMetricTypeLabel,
  renderStars
}: SimulationCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editNotes, setEditNotes] = useState(simulation.notes)
  const [editTags, setEditTags] = useState(simulation.tags)
  const [editRating, setEditRating] = useState(simulation.rating)

  const handleSave = () => {
    onUpdate(editNotes, editTags, editRating)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditNotes(simulation.notes)
    setEditTags(simulation.tags)
    setEditRating(simulation.rating)
    setIsEditing(false)
  }

  return (
    <div
      className={`simulation-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="simulation-card-header">
        <div className="simulation-title">
          <h3>{getMetricTypeLabel(simulation.metric_type)}</h3>
          <span className="simulation-id">#{simulation.id}</span>
        </div>
        <div className="simulation-rating">
          {renderStars(editRating)}
        </div>
      </div>

      <div className="simulation-card-body">
        <div className="simulation-info">
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(simulation.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Method:</span>
            <span className="info-value">{simulation.method}</span>
          </div>

          <div className="info-row">
            <span className="info-label">Energy:</span>
            <span className={`info-value ${simulation.energy_condition.includes('Negative') ? 'negative' : 'positive'}`}>
              {simulation.energy_condition}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Statistics:</span>
            <span className="info-value">
              [{simulation.statistics.min:.2f}, {simulation.statistics.max:.2f}]
            </span>
          </div>
        </div>

        {isEditing ? (
          <div className="simulation-edit">
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add notes about this simulation..."
              className="edit-notes"
            />
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="edit-tags"
            />
            <div className="edit-rating">
              <span>Rating:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setEditRating(star)}
                  className={`star-btn ${star <= editRating ? 'active' : ''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="simulation-details">
            {simulation.notes && (
              <div className="simulation-notes">
                <strong>Notes:</strong> {simulation.notes}
              </div>
            )}
            {simulation.tags && (
              <div className="simulation-tags">
                <strong>Tags:</strong>
                {simulation.tags.split(',').map((tag, i) => (
                  <span key={i} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="simulation-card-actions">
        <button onClick={onLoad} className="action-btn load-btn">
          📥 Load
        </button>
        <button
          onClick={onCompare}
          className="action-btn compare-btn"
          disabled={!isSelected}
        >
          ⚖️ Compare
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="action-btn edit-btn"
        >
          {isEditing ? '✖️' : '✏️ Edit'}
        </button>
        <button
          onClick={() => onExport('json')}
          className="action-btn export-btn"
          title="Export as JSON"
        >
          📤
        </button>
        <button
          onClick={onDelete}
          className="action-btn delete-btn"
          title="Delete simulation"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

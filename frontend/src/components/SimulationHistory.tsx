import { useState, useEffect } from 'react'

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
        className={i < rating ? 'text-yellow-400 text-base' : 'text-gray-600 text-base'}
      >
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]">
        <div className="bg-[#1a1a2e] border border-[#333] rounded-lg w-[90%] max-w-[1200px] h-[90vh] flex flex-col shadow-2xl">
          <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#16213e]">
            <h2 className="text-rose-500 text-2xl">Simulation History</h2>
            <button onClick={onClose} className="bg-transparent border-0 text-white text-3xl cursor-pointer p-0 w-10 h-10 flex items-center justify-center rounded transition-colors hover:bg-rose-500">×</button>
          </div>
          <div className="text-center p-10 text-gray-300 text-lg">Loading simulations...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1000]">
      <div className="bg-[#1a1a2e] border border-[#333] rounded-lg w-[90%] max-w-[1200px] h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#16213e]">
          <h2 className="text-rose-500 text-2xl">📚 Simulation History</h2>
          <button onClick={onClose} className="bg-transparent border-0 text-white text-3xl cursor-pointer p-0 w-10 h-10 flex items-center justify-center rounded transition-colors hover:bg-rose-500">×</button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 p-5 border-b border-[#333] bg-[#1a1a2e]">
          <select
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
            className="p-2 px-3 bg-[#0f3460] border border-[#333] rounded text-white text-sm cursor-pointer focus:outline-none focus:border-rose-500"
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
            className="flex-1 p-2 px-3 bg-[#0f3460] border border-[#333] rounded text-white text-sm focus:outline-none focus:border-rose-500"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 px-3 bg-[#0f3460] border border-[#333] rounded text-white text-sm cursor-pointer focus:outline-none focus:border-rose-500"
          >
            <option value="timestamp">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="flex gap-5 px-5 py-3 bg-[#16213e] text-gray-300 text-sm border-b border-[#333]">
          <span>Total: {filteredSimulations.length} simulations</span>
          <span>Top rated: {filteredSimulations.filter(s => s.rating > 0).length}</span>
        </div>

        {/* Simulation List */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4 align-content-start [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1a1a2e] [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-rose-500">
          {filteredSimulations.length === 0 ? (
            <div className="text-center py-16 px-5 text-gray-500 text-base col-[1/-1]">
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
      className={`bg-[#16213e] border border-[#333] rounded-lg p-4 cursor-pointer transition-all hover:border-rose-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/20 ${isSelected ? 'border-rose-500 bg-[#1a1a2e] shadow-lg shadow-rose-500/30' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-white text-base font-semibold m-0">{getMetricTypeLabel(simulation.metric_type)}</h3>
          <span className="inline-block bg-[#0f3460] text-rose-500 px-2 py-0.5 rounded text-xs font-semibold ml-2">#{simulation.id}</span>
        </div>
        <div className="flex gap-0.5">
          {renderStars(editRating)}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex flex-col gap-1.5 mb-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Date:</span>
            <span className="text-gray-300">
              {new Date(simulation.timestamp).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Method:</span>
            <span className="text-gray-300">{simulation.method}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Energy:</span>
            <span className={simulation.energy_condition.includes('Negative') ? 'text-rose-500 font-semibold' : 'text-green-400 font-semibold'}>
              {simulation.energy_condition}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium">Statistics:</span>
            <span className="text-gray-300">
              [{simulation.statistics.min.toFixed(2)}, {simulation.statistics.max.toFixed(2)}]
            </span>
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add notes about this simulation..."
              className="w-full min-h-20 p-2 bg-[#0f3460] border border-[#333] rounded text-white font-normal resize-y focus:outline-none focus:border-rose-500"
            />
            <input
              type="text"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full p-2 bg-[#0f3460] border border-[#333] rounded text-white focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <span>Rating:</span>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setEditRating(star)}
                  className={`bg-transparent border-0 text-lg cursor-pointer p-0 transition-transform hover:scale-110 ${star <= editRating ? 'text-yellow-400' : 'text-gray-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2 border-0 rounded text-xs font-semibold cursor-pointer transition-all bg-green-400 text-black hover:bg-green-500">Save</button>
              <button onClick={handleCancel} className="flex-1 py-2 border-0 rounded text-xs font-semibold cursor-pointer transition-all bg-rose-500 text-white hover:bg-rose-600">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            {simulation.notes && (
              <div className="mb-2 leading-relaxed">
                <strong>Notes:</strong> {simulation.notes}
              </div>
            )}
            {simulation.tags && (
              <div className="flex flex-wrap gap-1 items-center">
                <strong>Tags:</strong>
                {simulation.tags.split(',').map((tag, i) => (
                  <span key={i} className="bg-[#0f3460] text-rose-500 px-2 py-0.5 rounded text-xs font-medium">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-1.5 pt-3 border-t border-[#333]">
        <button onClick={onLoad} className="flex-1 py-1.5 px-2 border border-[#333] rounded bg-green-400 text-black text-xs font-semibold cursor-pointer transition-all hover:bg-green-500 hover:border-green-500">
          📥 Load
        </button>
        <button
          onClick={onCompare}
          className="flex-1 py-1.5 px-2 border border-[#333] rounded bg-[#0f3460] text-white text-xs cursor-pointer transition-all hover:bg-rose-500 hover:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isSelected}
        >
          ⚖️ Compare
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex-1 py-1.5 px-2 border border-[#333] rounded bg-[#0f3460] text-white text-xs cursor-pointer transition-all hover:bg-rose-500 hover:border-rose-500"
        >
          {isEditing ? '✖️' : '✏️ Edit'}
        </button>
        <button
          onClick={() => onExport('json')}
          className="flex-1 py-1.5 px-2 border border-[#333] rounded bg-[#0f3460] text-white text-xs cursor-pointer transition-all hover:bg-rose-500 hover:border-rose-500"
          title="Export as JSON"
        >
          📤
        </button>
        <button
          onClick={onDelete}
          className="flex-1 py-1.5 px-2 border border-[#333] rounded bg-[#0f3460] text-white text-xs cursor-pointer transition-all hover:bg-rose-500 hover:border-rose-500"
          title="Delete simulation"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

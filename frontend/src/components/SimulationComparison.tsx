import { useState } from 'react'
import './SimulationComparison.css'

interface SimulationComparisonProps {
  comparisonData: any
  onClose: () => void
}

export default function SimulationComparison({
  comparisonData,
  onClose
}: SimulationComparisonProps) {
  const [activeView, setActiveView] = useState<'statistics' | 'energy' | 'params'>('statistics')

  if (!comparisonData || comparisonData.mode !== 'simulation_comparison') {
    return null
  }

  const { simulation_1, simulation_2, data_1, data_2 } = comparisonData

  const getEnergyDensityArray = (data: any) => {
    if (!data) return []

    // Try to find energy density in different possible locations
    if (data.energy_density) {
      return data.energy_density
    }
    if (data.data && data.data.energy_density) {
      return data.data.energy_density
    }
    return []
  }

  const getComparisonStats = () => {
    const stats1 = simulation_1.statistics
    const stats2 = simulation_2.statistics

    return {
      min: {
        sim1: stats1.min,
        sim2: stats2.min,
        diff: stats2.min - stats1.min,
        diffPercent: ((stats2.min - stats1.min) / Math.abs(stats1.min) * 100).toFixed(1)
      },
      max: {
        sim1: stats1.max,
        sim2: stats2.max,
        diff: stats2.max - stats1.max,
        diffPercent: ((stats2.max - stats1.max) / Math.abs(stats1.max || 1) * 100).toFixed(1)
      },
      mean: {
        sim1: stats1.mean,
        sim2: stats2.mean,
        diff: stats2.mean - stats1.mean,
        diffPercent: ((stats2.mean - stats1.mean) / Math.abs(stats1.mean || 1) * 100).toFixed(1)
      },
      std: {
        sim1: stats1.std,
        sim2: stats2.std,
        diff: stats2.std - stats1.std,
        diffPercent: ((stats2.std - stats1.std) / Math.abs(stats1.std || 1) * 100).toFixed(1)
      }
    }
  }

  const getParamComparison = () => {
    const params1 = simulation_1.params
    const params2 = simulation_2.params

    const comparisons = []

    // Compare common parameters
    const commonKeys = Object.keys(params1).filter(key => key in params2)

    for (const key of commonKeys) {
      const value1 = params1[key]
      const value2 = params2[key]

      if (typeof value1 === 'number' && typeof value2 === 'number') {
        const diff = value2 - value1
        const diffPercent = ((value2 - value1) / Math.abs(value1 || 1) * 100).toFixed(1)

        comparisons.push({
          parameter: key,
          sim1: value1,
          sim2: value2,
          diff,
          diffPercent
        })
      } else {
        comparisons.push({
          parameter: key,
          sim1: value1,
          sim2: value2,
          diff: 'N/A',
          diffPercent: 'N/A'
        })
      }
    }

    return comparisons
  }

  const renderStatsComparison = () => {
    const stats = getComparisonStats()

    return (
      <div className="stats-comparison">
        <h3>Statistics Comparison</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Simulation #{simulation_1.id}</th>
              <th>Simulation #{simulation_2.id}</th>
              <th>Difference</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([key, values]: [string, any]) => (
              <tr key={key}>
                <td className="metric-name">{key.toUpperCase()}</td>
                <td className="sim1-value">{values.sim1.toFixed(4)}</td>
                <td className="sim2-value">{values.sim2.toFixed(4)}</td>
                <td className={`diff-value ${values.diff >= 0 ? 'positive' : 'negative'}`}>
                  {values.diff >= 0 ? '+' : ''}{values.diff.toFixed(4)}
                </td>
                <td className={`diff-percent ${values.diffPercent >= 0 ? 'positive' : 'negative'}`}>
                  {values.diffPercent >= 0 ? '+' : ''}{values.diffPercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderParamsComparison = () => {
    const params = getParamComparison()

    return (
      <div className="params-comparison">
        <h3>Parameters Comparison</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Simulation #{simulation_1.id}</th>
              <th>Simulation #{simulation_2.id}</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {params.map((param: any) => (
              <tr key={param.parameter}>
                <td className="param-name">{param.parameter}</td>
                <td className="sim1-value">{typeof param.sim1 === 'number' ? param.sim1.toFixed(2) : param.sim1}</td>
                <td className="sim2-value">{typeof param.sim2 === 'number' ? param.sim2.toFixed(2) : param.sim2}</td>
                <td className={`diff-value ${typeof param.diff === 'number' ? (param.diff >= 0 ? 'positive' : 'negative') : ''}`}>
                  {typeof param.diff === 'number' ? (param.diff >= 0 ? '+' : '') + param.diff.toFixed(2) : param.diff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderEnergyComparison = () => {
    const energy1 = getEnergyDensityArray(data_1)
    const energy2 = getEnergyDensityArray(data_2)

    if (!energy1.length || !energy2.length) {
      return <div className="no-data">No energy density data available for comparison</div>
    }

    // This would ideally render a heatmap comparison
    // For now, just show basic statistics
    return (
      <div className="energy-comparison">
        <h3>Energy Density Comparison</h3>
        <div className="energy-stats">
          <div className="energy-stat">
            <h4>Simulation #{simulation_1.id}</h4>
            <p>Shape: {energy1.length ? `[${Array.from(energy1.shape || []).join(', ')}]` : 'N/A'}</p>
            <p>Range: [{Math.min(...energy1.flat()).toFixed(2)}, {Math.max(...energy1.flat()).toFixed(2)}]</p>
          </div>
          <div className="energy-stat">
            <h4>Simulation #{simulation_2.id}</h4>
            <p>Shape: {energy2.length ? `[${Array.from(energy2.shape || []).join(', ')}]` : 'N/A'}</p>
            <p>Range: [{Math.min(...energy2.flat()).toFixed(2)}, {Math.max(...energy2.flat()).toFixed(2)}]</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="comparison-overlay">
      <div className="comparison-modal">
        <div className="comparison-header">
          <h2>⚖️ Simulation Comparison</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="comparison-tabs">
          <button
            className={`tab-btn ${activeView === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveView('statistics')}
          >
            📊 Statistics
          </button>
          <button
            className={`tab-btn ${activeView === 'params' ? 'active' : ''}`}
            onClick={() => setActiveView('params')}
          >
            🔧 Parameters
          </button>
          <button
            className={`tab-btn ${activeView === 'energy' ? 'active' : ''}`}
            onClick={() => setActiveView('energy')}
          >
            ⚡ Energy Density
          </button>
        </div>

        <div className="comparison-content">
          {activeView === 'statistics' && renderStatsComparison()}
          {activeView === 'params' && renderParamsComparison()}
          {activeView === 'energy' && renderEnergyComparison()}
        </div>

        <div className="comparison-footer">
          <button onClick={onClose} className="close-footer-btn">
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}

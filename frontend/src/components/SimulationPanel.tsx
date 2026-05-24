import { useState } from 'react'
import './SimulationPanel.css'

interface SimulationPanelProps {
  onStart: (params: any) => void
  onCompare?: (params: any) => void
  isSimulating: boolean
  isComparing?: boolean
  results?: any
  comparisonResults?: any
}

function SimulationPanel({ onStart, onCompare, isSimulating, isComparing = false, results, comparisonResults }: SimulationPanelProps) {
  const [params, setParams] = useState({
    metric: 'alcubierre',
    velocity: 1.5,
    radius: 6.0,
    sigma: 4.0,
    gridSize: 64,
    method: 'finite_diff' // 'finite_diff' or 'autodiff'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleStart = () => {
    onStart(params)
  }

  const handleCompare = () => {
    if (onCompare) {
      onCompare(params)
    }
  }

  return (
    <div className="simulation-panel">
      <div className="panel-content">
        <h2>WarpTorch Simulator</h2>
        <p className="subtitle">Spacetime Metric Visualization</p>

        <div className="controls">
          <div className="control-group">
            <label>Spacetime Metric:</label>
            <select
              value={params.metric}
              onChange={(e) => setParams({ ...params, metric: e.target.value })}
              disabled={isSimulating}
              className="metric-select"
              style={{ padding: '8px', background: '#1a1a2e', color: '#fff', border: '1px solid #0055aa', borderRadius: '4px', width: '100%' }}
            >
              <option value="alcubierre">Alcubierre (1994) - Classic</option>
              <option value="lentz">Lentz (2021) - Positive Energy</option>
              <option value="vandenbroeck">Van Den Broeck (1999) - Micro</option>
            </select>
          </div>

          {showAdvanced && (
            <div className="control-group">
              <label>Computation Method:</label>
              <select
                value={params.method}
                onChange={(e) => setParams({ ...params, method: e.target.value })}
                disabled={isSimulating}
                className="method-select"
                style={{ padding: '8px', background: '#1a1a2e', color: '#fff', border: '1px solid #0055aa', borderRadius: '4px', width: '100%' }}
              >
                <option value="finite_diff">Finite Difference (Fast)</option>
                <option value="autodiff">Autodiff (Exact)</option>
              </select>
              <small style={{ color: '#888', fontSize: '0.8em', display: 'block', marginTop: '4px' }}>
                {params.method === 'autodiff' ? '🔬 Exact derivatives, recommended for stiff bubbles' : '⚡ Fast approximation, good for exploration'}
              </small>
            </div>
          )}

          <div className="control-group">
            <label>
              Velocity (v):
              <span className="value">{params.velocity.toFixed(1)}c</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={params.velocity}
              onChange={(e) => setParams({ ...params, velocity: parseFloat(e.target.value) })}
              disabled={isSimulating}
            />
          </div>

          <div className="control-group">
            <label>
              Bubble Radius (R):
              <span className="value">{params.radius.toFixed(1)} units</span>
            </label>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={params.radius}
              onChange={(e) => setParams({ ...params, radius: parseFloat(e.target.value) })}
              disabled={isSimulating}
            />
          </div>

          <div className="control-group">
            <label>
              Boundary Thickness (σ):
               <span className="value">{params.sigma.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="0.5"
              value={params.sigma}
              onChange={(e) => setParams({ ...params, sigma: parseFloat(e.target.value) })}
              disabled={isSimulating}
            />
            {params.sigma > 20 && (
              <small style={{ color: params.sigma > 30 ? '#ff6b6b' : '#ffa500', fontSize: '0.8em', display: 'block', marginTop: '4px' }}>
                {params.sigma > 30 ? '⚠️ Stiff walls! Use Autodiff for accuracy' : '🔧 High stiffness - Autodiff recommended'}
              </small>
            )}
          </div>
        </div>

        <button
          className="advanced-button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{ fontSize: '0.8em', padding: '4px 8px', margin: '5px 0', background: '#1a1a2e', color: '#00aaff', border: '1px solid #0055aa', borderRadius: '3px', cursor: 'pointer' }}
        >
          {showAdvanced ? '▼ Hide Advanced' : '▶ Show Advanced Options'}
        </button>

        <div className="info-panel">
          <h3>Simulation Info</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value ${isSimulating ? 'running' : 'ready'}`}>
                {isSimulating ? 'Running...' : 'Ready'}
              </span>
            </div>

            {results && results.statistics && (
              <>
                <div className="info-item">
                  <span className="label">Method:</span>
                  <span className="value">
                    {results.metadata?.method === 'autodiff' ? '🔬 Autodiff' : '⚡ Finite Diff'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Min Energy Density:</span>
                  <span className={`value ${results.statistics.min < 0 ? 'negative' : 'positive'}`}>
                    {results.statistics.min.toExponential(2)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Max Energy Density:</span>
                  <span className="value positive">
                    {results.statistics.max.toExponential(2)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Condition:</span>
                  <span className={`value ${results.metadata?.energy_condition === 'Satisfied' ? 'positive' : 'negative'}`}>
                    {results.metadata?.energy_condition || (params.metric === 'lentz' ? 'Satisfied' : 'Violated')}
                  </span>
                </div>
              </>
            )}

            {comparisonResults && comparisonResults.results && (
              <div className="comparison-results" style={{ marginTop: '10px', padding: '10px', background: '#0a0a1a', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em' }}>🎯 Methods Comparison:</h4>
                {comparisonResults.results.finite_diff.success && (
                  <div style={{ fontSize: '0.8em', marginBottom: '4px' }}>
                    <span style={{ color: '#ff6b6b' }}>Finite Diff:</span> {comparisonResults.results.finite_diff.max_curvature.toExponential(2)} ({comparisonResults.results.finite_diff.timing}s)
                  </div>
                )}
                {comparisonResults.results.autodiff.success && (
                  <div style={{ fontSize: '0.8em', marginBottom: '4px' }}>
                    <span style={{ color: '#51cf66' }}>Autodiff:</span> {comparisonResults.results.autodiff.max_curvature.toExponential(2)} ({comparisonResults.results.autodiff.timing}s)
                  </div>
                )}
                {comparisonResults.results.comparison && comparisonResults.results.comparison.recommendation && (
                  <div style={{ fontSize: '0.8em', padding: '4px', background: '#1a1a2e', borderRadius: '3px', marginTop: '4px' }}>
                    💡 {comparisonResults.results.comparison.recommendation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="button-group">
          <button
            className="start-button"
            onClick={handleStart}
            disabled={isSimulating}
            style={{ marginTop: '15px', marginRight: '5px' }}
          >
            {isSimulating ? 'Simulating...' : 'Start Simulation'}
          </button>

          <button
            className="compare-button"
            onClick={handleCompare}
            disabled={isComparing || isSimulating}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              background: '#1a1a2e',
              color: '#00aaff',
              border: '1px solid #0055aa',
              borderRadius: '4px',
              cursor: isComparing || isSimulating ? 'not-allowed' : 'pointer',
              opacity: isComparing || isSimulating ? 0.5 : 1
            }}
          >
            {isComparing ? 'Comparing...' : '🔬 Compare Methods'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimulationPanel
import { useState } from 'react'

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
    <div className="w-80 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-r border-[#0f3460] p-5 flex flex-col gap-5 overflow-y-auto shadow-lg">
      <div className="flex flex-col gap-5">
        <h2 className="text-rose-500 text-2xl m-0" style={{ textShadow: '0 0 10px rgba(233, 69, 96, 0.5)' }}>WarpTorch Simulator</h2>
        <p className="text-sky-400 text-base opacity-80 m-0">Spacetime Metric Visualization</p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-base flex justify-between items-center">Spacetime Metric:</label>
            <select
              value={params.metric}
              onChange={(e) => setParams({ ...params, metric: e.target.value })}
              disabled={isSimulating}
              className="p-2 bg-[#1a1a2e] text-white border border-sky-400 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="alcubierre">Alcubierre (1994) - Classic</option>
              <option value="lentz">Lentz (2021) - Positive Energy</option>
              <option value="vandenbroeck">Van Den Broeck (1999) - Micro</option>
            </select>
          </div>

          {showAdvanced && (
            <div className="flex flex-col gap-2">
              <label className="text-gray-200 text-base flex justify-between items-center">Computation Method:</label>
              <select
                value={params.method}
                onChange={(e) => setParams({ ...params, method: e.target.value })}
                disabled={isSimulating}
                className="p-2 bg-[#1a1a2e] text-white border border-sky-400 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="finite_diff">Finite Difference (Fast)</option>
                <option value="autodiff">Autodiff (Exact)</option>
              </select>
              <small className="text-gray-500 text-xs mt-1">
                {params.method === 'autodiff' ? '🔬 Exact derivatives, recommended for stiff bubbles' : '⚡ Fast approximation, good for exploration'}
              </small>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-base flex justify-between items-center">
              Velocity (v):
              <span className="text-sky-400 font-bold text-sm">{params.velocity.toFixed(1)}c</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={params.velocity}
              onChange={(e) => setParams({ ...params, velocity: parseFloat(e.target.value) })}
              disabled={isSimulating}
              className="w-full h-1.5 bg-[#0f3460] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-rose-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-base flex justify-between items-center">
              Bubble Radius (R):
              <span className="text-sky-400 font-bold text-sm">{params.radius.toFixed(1)} units</span>
            </label>
            <input
              type="range"
              min="2.0"
              max="15.0"
              step="0.5"
              value={params.radius}
              onChange={(e) => setParams({ ...params, radius: parseFloat(e.target.value) })}
              disabled={isSimulating}
              className="w-full h-1.5 bg-[#0f3460] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-rose-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-base flex justify-between items-center">
              Boundary Thickness (σ):
               <span className="text-sky-400 font-bold text-sm">{params.sigma.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="0.5"
              value={params.sigma}
              onChange={(e) => setParams({ ...params, sigma: parseFloat(e.target.value) })}
              disabled={isSimulating}
              className="w-full h-1.5 bg-[#0f3460] rounded appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-rose-500/80 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {params.sigma > 20 && (
              <small className={params.sigma > 30 ? 'text-red-500 text-xs mt-1' : 'text-orange-500 text-xs mt-1'}>
                {params.sigma > 30 ? '⚠️ Stiff walls! Use Autodiff for accuracy' : '🔧 High stiffness - Autodiff recommended'}
              </small>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs py-1 px-2 my-1 bg-[#1a1a2e] text-sky-400 border border-sky-600 rounded cursor-pointer"
        >
          {showAdvanced ? '▼ Hide Advanced' : '▶ Show Advanced Options'}
        </button>

        <div className="bg-[#0f3460]/30 border border-[#0f3460] rounded-lg p-4">
          <h3 className="text-sky-400 text-base m-0 mb-2.5">Simulation Info</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Status:</span>
              <span className={isSimulating ? 'text-yellow-400 font-bold' : 'text-green-400 font-bold'}>
                {isSimulating ? 'Running...' : 'Ready'}
              </span>
            </div>

            {results && results.statistics && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Method:</span>
                  <span className="text-gray-100 font-bold">
                    {results.metadata?.method === 'autodiff' ? '🔬 Autodiff' : '⚡ Finite Diff'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Min Energy Density:</span>
                  <span className={results.statistics.min < 0 ? 'text-red-500 font-bold' : 'text-green-400 font-bold'}>
                    {results.statistics.min.toExponential(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Max Energy Density:</span>
                  <span className="text-green-400 font-bold">
                    {results.statistics.max.toExponential(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Condition:</span>
                  <span className={results.metadata?.energy_condition === 'Satisfied' ? 'text-green-400 font-bold' : 'text-red-500 font-bold'}>
                    {results.metadata?.energy_condition || (params.metric === 'lentz' ? 'Satisfied' : 'Violated')}
                  </span>
                </div>
              </>
            )}

            {comparisonResults && comparisonResults.results && (
              <div className="mt-2.5 p-2.5 bg-[#0a0a1a] rounded">
                <h4 className="m-0 mb-2 text-xs">🎯 Methods Comparison:</h4>
                {comparisonResults.results.finite_diff.success && (
                  <div className="text-xs mb-1">
                    <span className="text-red-500">Finite Diff:</span> {comparisonResults.results.finite_diff.max_curvature.toExponential(2)} ({comparisonResults.results.finite_diff.timing}s)
                  </div>
                )}
                {comparisonResults.results.autodiff.success && (
                  <div className="text-xs mb-1">
                    <span className="text-green-500">Autodiff:</span> {comparisonResults.results.autodiff.max_curvature.toExponential(2)} ({comparisonResults.results.autodiff.timing}s)
                  </div>
                )}
                {comparisonResults.results.comparison && comparisonResults.results.comparison.recommendation && (
                  <div className="text-xs p-1 bg-[#1a1a2e] rounded mt-1">
                    💡 {comparisonResults.results.comparison.recommendation}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleStart}
            disabled={isSimulating}
            className="flex-1 bg-gradient-to-br from-rose-500 to-red-500 text-white border-0 rounded-lg py-3 text-base font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/60 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wide mt-4 mr-1"
          >
            {isSimulating ? 'Simulating...' : 'Start Simulationываы'}
          </button>

          <button
            onClick={handleCompare}
            disabled={isComparing || isSimulating}
            className="px-4 py-3 bg-[#1a1a2e] text-sky-400 border border-sky-600 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComparing ? 'Comparing...' : '🔬 Compare Methods'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SimulationPanel
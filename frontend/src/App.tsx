import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import WarpBubble from './components/WarpBubble'
import AxesHelper from './components/AxesHelper'
import SimulationPanel from './components/SimulationPanel'
import SimulationHistory from './components/SimulationHistory'
import SimulationComparison from './components/SimulationComparison'
import Navbar from './components/Navbar'
import ColorSettings from './components/ColorSettings'
import CustomGrid from './components/CustomGrid'
import './App.css'

function App() {
  const [simulationData, setSimulationData] = useState<any>(null)
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [comparisonMode, setComparisonMode] = useState(false)

  const [colors, setColors] = useState({
    bubbleCore: '#ff0000',
    bubbleShell: '#cc0000',
    gridColor: '#444444',
    spacetimeColor: '#ff3333'
  })

  const [activeParams, setActiveParams] = useState({
    metric: 'alcubierre',
    velocity: 0.0,
    radius: 0.0,
    sigma: 1.0,
    method: 'finite_diff'
  })

  const handleSimulationStart = async (params: any) => {
    setIsSimulating(true)
    try {
      // Prepare request body based on metric type
      let requestBody: any = {
        gridSize: params.gridSize,
        method: params.method
      }

      // Add metric-specific parameters
      switch (params.metric) {
        case 'alcubierre':
          requestBody.velocity = params.velocity
          requestBody.radius = params.radius
          requestBody.sigma = params.sigma
          break
        case 'lentz':
          requestBody.velocity = params.velocity
          requestBody.scale = params.radius // Use radius as scale for UI simplicity
          break
        case 'vandenbroeck':
          requestBody.velocity = params.velocity
          requestBody.R1 = params.radius * 0.7  // Inner radius
          requestBody.sigma1 = params.sigma * 0.8  // Inner boundary
          requestBody.R2 = params.radius  // Outer radius
          requestBody.sigma2 = params.sigma  // Outer boundary
          requestBody.A = 1.0  // Expansion factor
          break
      }

      // Динамический вызов API на основе выбранной метрики
      const response = await fetch(`/api/simulate/${params.metric}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      const data = await response.json()

      setSimulationData(data)

      setActiveParams({
        metric: params.metric,
        velocity: params.velocity,
        radius: params.radius,
        sigma: params.sigma,
        method: params.method
      })
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleCompareMethods = async (params: any) => {
    setIsComparing(true)
    try {
      const response = await fetch('/api/compare/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          velocity: params.velocity,
          radius: params.radius,
          sigma: params.sigma,
          gridSize: params.gridSize
        })
      })

      const data = await response.json()
      setComparisonData(data)

      console.log('Comparison results:', data)
    } catch (error) {
      console.error('Comparison error:', error)
    } finally {
      setIsComparing(false)
    }
  }

  const handleLoadSimulation = async (simId: number) => {
    try {
      const response = await fetch(`/api/simulations/${simId}`)
      const data = await response.json()

      if (data.success) {
        const sim = data.simulation

        // Set active parameters from saved simulation
        setActiveParams({
          metric: sim.metric_type,
          velocity: sim.params.velocity || 0.0,
          radius: sim.params.radius || sim.params.scale || 0.0,
          sigma: sim.params.sigma || 1.0,
          method: sim.method
        })

        // If we have full data, load it directly
        if (data.full_data) {
          setSimulationData({
            ...data.full_data,
            metadata: {
              simulation_id: sim.id,
              loaded_from_history: true
            }
          })
        } else {
          // Otherwise run new simulation with saved parameters
          await handleSimulationStart({
            metric: sim.metric_type,
            velocity: sim.params.velocity,
            radius: sim.params.radius || sim.params.scale,
            sigma: sim.params.sigma,
            gridSize: sim.grid_size[1] || 96,
            method: sim.method
          })
        }

        setShowHistory(false)
      }
    } catch (error) {
      console.error('Failed to load simulation:', error)
      alert('Failed to load simulation. Please try again.')
    }
  }

  const handleCompareSimulations = async (simId1: number, simId2: number) => {
    try {
      // Load both simulations
      const [response1, response2] = await Promise.all([
        fetch(`/api/simulations/${simId1}`),
        fetch(`/api/simulations/${simId2}`)
      ])

      const data1 = await response1.json()
      const data2 = await response2.json()

      if (data1.success && data2.success) {
        setComparisonData({
          mode: 'simulation_comparison',
          simulation_1: data1.simulation,
          simulation_2: data2.simulation,
          data_1: data1.full_data,
          data_2: data2.full_data
        })

        setComparisonMode(true)
        setShowHistory(false)
      }
    } catch (error) {
      console.error('Failed to compare simulations:', error)
      alert('Failed to compare simulations. Please try again.')
    }
  }

  return (
    <div className="app">
      <ColorSettings
        onColorsChange={setColors}
        currentColors={colors}
      />

      <Navbar
        onHistoryToggle={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
      />

      <SimulationPanel
        onStart={handleSimulationStart}
        onCompare={handleCompareMethods}
        isSimulating={isSimulating}
        isComparing={isComparing}
        results={simulationData}
        comparisonResults={comparisonData}
      />

      <div className="canvas-container">
        <Canvas camera={{ position: [20, 15, 20], fov: 50 }}>
          <color attach="background" args={['#0a0a0f']} />
          <ambientLight intensity={0.5} />

          <CustomGrid
            cellColor={colors.gridColor}
            sectionColor={colors.gridColor}
          />

          <AxesHelper size={5} />

          {/* Передаем метрику и цвета в визуализатор */}
          <WarpBubble
            data={simulationData}
            metric={activeParams.metric}
            velocity={activeParams.velocity}
            radius={activeParams.radius}
            sigma={activeParams.sigma}
            bubbleCoreColor={colors.bubbleCore}
            bubbleShellColor={colors.bubbleShell}
            spacetimeColor={colors.spacetimeColor}
          />

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={80}
          />
        </Canvas>
      </div>

      {/* Simulation History Modal */}
      {showHistory && (
        <SimulationHistory
          onLoadSimulation={handleLoadSimulation}
          onCompareSimulations={handleCompareSimulations}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Simulation Comparison Modal */}
      {comparisonMode && comparisonData && comparisonData.mode === 'simulation_comparison' && (
        <SimulationComparison
          comparisonData={comparisonData}
          onClose={() => {
            setComparisonMode(false)
            setComparisonData(null)
          }}
        />
      )}
    </div>
  )
}

export default App
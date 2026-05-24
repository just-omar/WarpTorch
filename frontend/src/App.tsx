import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import WarpBubble from './components/WarpBubble'
import AxesHelper from './components/AxesHelper'
import SimulationPanel from './components/SimulationPanel'
import './App.css'

function App() {
  const [simulationData, setSimulationData] = useState<any>(null)
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isComparing, setIsComparing] = useState(false)

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
      // Динамический вызов API на основе выбранной метрики
      const response = await fetch(`/api/simulate/${params.metric}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          velocity: params.velocity,
          radius: params.radius,
          sigma: params.sigma,
          gridSize: params.gridSize,
          method: params.method
        })
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

  return (
    <div className="app">
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

          <Grid
            args={[50, 50]}
            cellSize={1}
            cellThickness={0.3}
            cellColor="#333"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#555"
            fadeDistance={60}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />

          <AxesHelper size={5} />

          {/* Передаем метрику в визуализатор */}
          <WarpBubble
            data={simulationData}
            metric={activeParams.metric}
            velocity={activeParams.velocity}
            radius={activeParams.radius}
            sigma={activeParams.sigma}
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
    </div>
  )
}

export default App
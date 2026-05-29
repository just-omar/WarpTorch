import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WarpBubbleProps {
  data: any
  metric: string
  velocity: number
  radius: number
  sigma: number
  bubbleCoreColor?: string
  bubbleShellColor?: string
  spacetimeColor?: string
  showBubbleCore?: boolean
}

function WarpBubble({ data, metric, velocity, radius, sigma, bubbleCoreColor = '#ff0000', bubbleShellColor = '#cc001f', spacetimeColor = '#4b33ff', showBubbleCore = true }: WarpBubbleProps) {
  const planeRef = useRef<THREE.Mesh>(null)
  const bubbleRef = useRef<THREE.Group>(null)
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null)

  const current = useRef({ radius: 0, sigma: 1, velocity: 0 })

  const spacetimeSheet = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(60, 60, 150, 150) // Сделали сетку еще плотнее и больше
    geometry.rotateX(-Math.PI / 2)
    return {
      geometry,
      originalPositions: new Float32Array(geometry.attributes.position.array)
    }
  }, [])

  // Direct colors from props
  const targetCoreColor = useMemo(() => {
    const color = new THREE.Color(bubbleCoreColor)
    return color
  }, [bubbleCoreColor])

  const targetShellColor = useMemo(() => {
    const color = new THREE.Color(bubbleShellColor)
    return color
  }, [bubbleShellColor])

  useFrame((state) => {
    current.current.radius = THREE.MathUtils.lerp(current.current.radius, radius, 0.05)
    current.current.sigma = THREE.MathUtils.lerp(current.current.sigma, sigma, 0.05)
    current.current.velocity = THREE.MathUtils.lerp(current.current.velocity, velocity, 0.05)

    if (coreMaterialRef.current) coreMaterialRef.current.color.set(targetCoreColor)
    if (shellMaterialRef.current) shellMaterialRef.current.color.set(targetShellColor)

    if (!planeRef.current) return

    const time = state.clock.elapsedTime
    const positions = planeRef.current.geometry.attributes.position.array as Float32Array
    const original = spacetimeSheet.originalPositions

    const rT = current.current.radius
    const sT = current.current.sigma
    const vT = current.current.velocity

    for (let i = 0; i < positions.length / 3; i++) {
      const origX = original[i * 3]
      const origY = original[i * 3 + 1] 
      const origZ = original[i * 3 + 2]

      const rs = Math.sqrt(origX * origX + origZ * origZ)
      let waveHeight = 0

      // РАЗНЫЕ МАТЕМАТИЧЕСКИЕ МОДЕЛИ ДЕФОРМАЦИИ:
      
      if (metric === 'alcubierre') {
        // Классическая волна градиента
        const wallProximity = Math.exp(-Math.pow(rs - rT, 2) / (sT * sT))
        waveHeight = -origX * wallProximity * vT * 0.4
      } 
      else if (metric === 'lentz') {
        // Солитон Ленца: ромбовидная структура (аппроксимация для визуализации)
        // Представляет собой несколько "расходящихся" позитивных волн искажения
        const diamondRs = Math.abs(origX) + Math.abs(origZ)
        const wallProximity = Math.exp(-Math.pow(diamondRs - rT, 2) / (sT * sT))
        // Ленц "толкает" пространство, создавая рябь (косинус)
        waveHeight = wallProximity * vT * 0.8 * Math.cos(origX * 1.5)
        // Поднимаем ядро, так как энергия положительная
        const coreProximity = Math.exp(-Math.pow(rs, 2) / ((rT*0.5) * (rT*0.5)))
        waveHeight += coreProximity * vT * 0.5
      } 
      else if (metric === 'vandenbroeck') {
        // Ван Ден Брук: Волна Алькубьерре на границе + Массивное раздутие внутреннего объема
        const wallProximity = Math.exp(-Math.pow(rs - rT, 2) / (sT * sT))
        const edgeWave = -origX * wallProximity * vT * 0.4
        
        // Внутреннее пространство экстремально проваливается (имитация увеличения объема)
        let internalBulge = 0
        if (rs < rT) {
          // Плавная воронка внутри пузыря
          internalBulge = Math.pow(Math.cos((rs / rT) * (Math.PI / 2)), 2) * (rT * 1.5) * vT
        }
        
        waveHeight = edgeWave - internalBulge
      }

      positions[i * 3 + 1] = origY + waveHeight
    }

    planeRef.current.geometry.attributes.position.needsUpdate = true

    // Анимация самого "корабля"
    if (bubbleRef.current && rT > 0.1) {
      // Для Ван Ден Брука корабль визуально крошечный по сравнению с зоной искажения
      const bubbleScale = metric === 'vandenbroeck' ? rT * 0.3 : rT
      
      bubbleRef.current.scale.setScalar(bubbleScale)
      bubbleRef.current.rotation.x = time * 0.5
      bubbleRef.current.rotation.y = time * 0.3
      bubbleRef.current.visible = true
    } else if (bubbleRef.current) {
      bubbleRef.current.visible = false
    }
  })

  return (
    <group>
      <mesh ref={planeRef} geometry={spacetimeSheet.geometry}>
        <meshBasicMaterial
          color={spacetimeColor}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      <group ref={bubbleRef}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            ref={shellMaterialRef}
            color="#ff0000"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
        {showBubbleCore && (
          <mesh>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial
              ref={coreMaterialRef}
              color="#ff3333"
              transparent
              opacity={0.9}
              wireframe
            />
          </mesh>
        )}
      </group>
    </group>
  )
}

export default WarpBubble
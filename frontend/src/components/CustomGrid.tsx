import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CustomGridProps {
  cellColor: string
  sectionColor: string
  cellSize?: number
  sectionSize?: number
  gridSize?: number
  fadeDistance?: number
}

function CustomGrid({
  cellColor,
  sectionColor,
  cellSize = 1,
  sectionSize = 5,
  gridSize = 50,
  fadeDistance = 60
}: CustomGridProps) {
  const cellLinesRef = useRef<THREE.LineSegments>(null)
  const sectionLinesRef = useRef<THREE.LineSegments>(null)

  // Инициализируем useRef с THREE.Color объектами
  const targetCellColor = useRef<THREE.Color>(new THREE.Color(cellColor))
  const targetSectionColor = useRef<THREE.Color>(new THREE.Color(sectionColor))

  const currentCellColor = useRef<THREE.Color>(new THREE.Color(cellColor))
  const currentSectionColor = useRef<THREE.Color>(new THREE.Color(sectionColor))

  // Обновляем целевые цвета при изменении пропсов
  useEffect(() => {
    console.log('Updating colors - cellColor:', cellColor, 'sectionColor:', sectionColor)
    targetCellColor.current.set(cellColor)
    targetSectionColor.current.set(sectionColor)
  }, [cellColor, sectionColor])

  // Создаем геометрию для сетки
  const { cellGeometry, sectionGeometry } = useMemo(() => {
    const cellPositions: number[] = []
    const sectionPositions: number[] = []

    const halfSize = gridSize / 2

    for (let i = -halfSize; i <= halfSize; i++) {
      // Горизонтальные линии
      if (i % sectionSize === 0) {
        // Секционные линии (толще)
        sectionPositions.push(-halfSize, 0, i, halfSize, 0, i)
      } else {
        // Обычные линии (тоньше)
        cellPositions.push(-halfSize, 0, i, halfSize, 0, i)
      }

      // Вертикальные линии
      if (i % sectionSize === 0) {
        sectionPositions.push(i, 0, -halfSize, i, 0, halfSize)
      } else {
        cellPositions.push(i, 0, -halfSize, i, 0, halfSize)
      }
    }

    const cellGeo = new THREE.BufferGeometry()
    cellGeo.setAttribute('position', new THREE.Float32BufferAttribute(cellPositions, 3))

    const sectionGeo = new THREE.BufferGeometry()
    sectionGeo.setAttribute('position', new THREE.Float32BufferAttribute(sectionPositions, 3))

    return { cellGeometry: cellGeo, sectionGeometry: sectionGeo }
  }, [gridSize, sectionSize])

  // Плавное обновление цветов
  useFrame((state) => {
    if (cellLinesRef.current) {
      // Плавно переходим к целевому цвету
      currentCellColor.current.lerp(targetCellColor.current, 0.1)
      cellLinesRef.current.material.color.copy(currentCellColor.current)

      // Добавляем эффект затухания по расстоянию
      const cameraDistance = state.camera.position.length()
      const opacity = Math.max(0, 1 - cameraDistance / fadeDistance)
      ;(cellLinesRef.current.material as THREE.LineBasicMaterial).opacity = opacity * 0.5
    }

    if (sectionLinesRef.current) {
      // Плавно переходим к целевому цвету
      currentSectionColor.current.lerp(targetSectionColor.current, 0.1)
      sectionLinesRef.current.material.color.copy(currentSectionColor.current)

      const cameraDistance = state.camera.position.length()
      const opacity = Math.max(0, 1 - cameraDistance / fadeDistance)
      ;(sectionLinesRef.current.material as THREE.LineBasicMaterial).opacity = opacity * 0.8
    }
  })

  return (
    <group>
      {/* Тонкие линии (ячейки) */}
      <lineSegments ref={cellLinesRef} geometry={cellGeometry}>
        <lineBasicMaterial
          color={cellColor}
          transparent
          opacity={0.5}
          linewidth={1}
        />
      </lineSegments>

      {/* Толстые линии (секции) */}
      <lineSegments ref={sectionLinesRef} geometry={sectionGeometry}>
        <lineBasicMaterial
          color={sectionColor}
          transparent
          opacity={0.8}
          linewidth={2}
        />
      </lineSegments>
    </group>
  )
}

export default CustomGrid
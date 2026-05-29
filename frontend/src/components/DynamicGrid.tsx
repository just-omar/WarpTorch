import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'

interface DynamicGridProps {
  cellColor: string
  sectionColor: string
}

function DynamicGrid({ cellColor, sectionColor }: DynamicGridProps) {
  const gridRef = useRef<THREE.Group>(null)
  const cellMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const sectionMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)

  // Создаём материалы для сетки
  useEffect(() => {
    if (!gridRef.current) return

    // Находим все меши в сетке
    const meshes: THREE.Mesh[] = []
    gridRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child)
      }
    })

    if (meshes.length >= 2) {
      // Первый меши - это ячейки (cell), второй - секции (section)
      cellMaterialRef.current = meshes[0].material as THREE.MeshBasicMaterial
      sectionMaterialRef.current = meshes[1].material as THREE.MeshBasicMaterial

      // Устанавливаем начальные цвета
      cellMaterialRef.current.color.set(cellColor)
      sectionMaterialRef.current.color.set(sectionColor)
    }
  }, []) // Запускаем только один раз при монтировании

  // Примечание: цвета обновляются плавно в useFrame через lerp
  // useEffect здесь не нужен, чтобы избежать мерцания от мгновенного обновления

  // Плавное обновление цветов
  useFrame(() => {
    const targetCellColor = new THREE.Color(cellColor)
    const targetSectionColor = new THREE.Color(sectionColor)

    if (cellMaterialRef.current) {
      cellMaterialRef.current.color.lerp(targetCellColor, 0.1)
    }
    if (sectionMaterialRef.current) {
      sectionMaterialRef.current.color.lerp(targetSectionColor, 0.1)
    }
  })

  return (
    <Grid
      ref={gridRef}
      args={[50, 50]}
      cellSize={1}
      cellThickness={0.3}
      cellColor={cellColor}
      sectionSize={5}
      sectionThickness={1}
      sectionColor={sectionColor}
      fadeDistance={60}
      fadeStrength={1}
      followCamera={false}
      infiniteGrid
    />
  )
}

export default DynamicGrid
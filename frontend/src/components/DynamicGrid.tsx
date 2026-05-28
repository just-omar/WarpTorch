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
    if (!gridRef.current) {
      console.log('Grid ref not available')
      return
    }

    // Находим все меши в сетке
    const meshes: THREE.Mesh[] = []
    gridRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshes.push(child)
        console.log('Found mesh in grid:', child, 'Color:', child.material.color?.getHexString())
      }
    })

    console.log('Total meshes in grid:', meshes.length)

    if (meshes.length >= 2) {
      // Первый меши - это ячейки (cell), второй - секции (section)
      cellMaterialRef.current = meshes[0].material as THREE.MeshBasicMaterial
      sectionMaterialRef.current = meshes[1].material as THREE.MeshBasicMaterial

      console.log('Cell material:', cellMaterialRef.current, 'Current color:', cellMaterialRef.current.color.getHexString())
      console.log('Section material:', sectionMaterialRef.current, 'Current color:', sectionMaterialRef.current.color.getHexString())

      // Устанавливаем начальные цвета
      cellMaterialRef.current.color.set(cellColor)
      sectionMaterialRef.current.color.set(sectionColor)

      console.log('Set cellColor to:', cellColor, 'sectionColor to:', sectionColor)
    }
  }, []) // Запускаем только один раз при монтировании

  // Обновляем целевые цвета при изменении пропсов
  useEffect(() => {
    console.log('Colors updated - cellColor:', cellColor, 'sectionColor:', sectionColor)

    if (cellMaterialRef.current) {
      console.log('Updating cell material from', cellMaterialRef.current.color.getHexString(), 'to', cellColor)
      cellMaterialRef.current.color.set(cellColor)
    }
    if (sectionMaterialRef.current) {
      console.log('Updating section material from', sectionMaterialRef.current.color.getHexString(), 'to', sectionColor)
      sectionMaterialRef.current.color.set(sectionColor)
    }
  }, [cellColor, sectionColor])

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
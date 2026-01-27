import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group } from 'three'

interface Granule3DWithModelProps {
  hoverRotation: number
  modelPath: string
}

// Предзагрузка модели для оптимизации
useGLTF.preload('/models/granule-organic.glb')

export const Granule3DWithModel = ({ hoverRotation, modelPath }: Granule3DWithModelProps) => {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef<Group>(null)
  const baseRotation = useRef(0)
  const currentHoverRotation = useRef(0)
  const isInitialized = useRef(false)

  // Инициализируем базовый поворот при первом рендере
  useEffect(() => {
    if (groupRef.current && !isInitialized.current) {
      baseRotation.current = groupRef.current.rotation.y
      isInitialized.current = true
    }
  }, [])

  useFrame(() => {
    if (groupRef.current) {
      // Если ховер-поворот изменился (начало или конец ховера)
      // обновляем базовый поворот, вычитая текущий ховер-поворот
      if (Math.abs(hoverRotation - currentHoverRotation.current) > 0.001) {
        const currentTotal = groupRef.current.rotation.y
        baseRotation.current = currentTotal - currentHoverRotation.current
      }
      
      // Плавная интерполяция ховер-поворота (коэффициент для более плавной анимации)
      const targetHover = hoverRotation
      const diff = targetHover - currentHoverRotation.current
      // Используем более плавный коэффициент интерполяции
      currentHoverRotation.current += diff * 0.15
      
      // Если разница очень мала, устанавливаем точно
      if (Math.abs(diff) < 0.001) {
        currentHoverRotation.current = targetHover
      }
      
      // Применяем базовый поворот + текущий ховер-поворот
      groupRef.current.rotation.y = baseRotation.current + currentHoverRotation.current
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}
import { useFrame } from '@react-three/fiber'
import {useRef, useEffect} from 'react'
import { Mesh } from 'three'

interface Granule3DProps {
  hoverRotation: number
}

export const Granule3D = ({ hoverRotation }: Granule3DProps) => {
  const meshRef = useRef<Mesh>(null)
  const baseRotation = useRef(0)
  const currentHoverRotation = useRef(0)
  const isInitialized = useRef(false)

  // Инициализируем базовый поворот при первом рендере
  useEffect(() => {
    if (meshRef.current && !isInitialized.current) {
      baseRotation.current = meshRef.current.rotation.y
      isInitialized.current = true
    }
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      // Если ховер-поворот изменился (начало или конец ховера)
      // обновляем базовый поворот, вычитая текущий ховер-поворот
      if (Math.abs(hoverRotation - currentHoverRotation.current) > 0.001) {
        const currentTotal = meshRef.current.rotation.y
        baseRotation.current = currentTotal - currentHoverRotation.current
      }
      
      // Плавная интерполяция ховер-поворота
      const targetHover = hoverRotation
      const diff = targetHover - currentHoverRotation.current
      currentHoverRotation.current += diff * 0.1
      
      // Применяем базовый поворот + текущий ховер-поворот
      meshRef.current.rotation.y = baseRotation.current + currentHoverRotation.current
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Создаем гранулу как сферу с неровной поверхностью */}
      <icosahedronGeometry args={[1.5, 2]} />
      <meshStandardMaterial 
        color="#ffa366" 
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  )
}
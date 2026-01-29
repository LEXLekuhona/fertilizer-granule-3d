import { Granule3DWithModel } from '@/entities/granule-3d/ui/Granule3DWithModel'
import { NutrientSections } from '@/features/nutrient-sections'
import { NutrientDescription } from '@/features/nutrient-sections/ui/nutrients/NutrientDescription'
import { NutrientFormula } from '@/features/nutrient-sections/ui/nutrients/NutrientFormula'
import { NUTRIENT_CONFIGS } from '@/shared/config/nutrient-configs'
import { NUTRIENT_FORMULA_SVGS } from '@/shared/config/nutrient-formulas'
import { HOVER_ROTATION_ANGLE, NUTRIENTS } from '@/shared/config/nutrients'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import 'bootstrap/dist/css/bootstrap.min.css'
import React, { Suspense, useCallback, useMemo, useState } from 'react'

/**
 * Главный виджет приложения - интерактивная 3D модель гранулы удобрения
 * 
 * СТРУКТУРА:
 * 1. Заголовок и подзаголовок
 * 2. Контейнер с 3D моделью и элементами питания:
 *    - Canvas с 3D моделью (Three.js)
 *    - NutrientSections - надписи и линии элементов
 *    - NutrientDescription - описание при наведении
 *    - NutrientFormula - формула на 3D модели при наведении
 * 
 * ИНТЕРАКТИВНОСТЬ:
 * - При наведении на элемент питания:
 *   1. 3D модель поворачивается на HOVER_ROTATION_ANGLE градусов
 *   2. Появляется описание под линией
 *   3. Появляется формула на 3D модели
 * 
 * ОПТИМИЗАЦИЯ:
 * - React.memo предотвращает лишние перерисовки
 * - useMemo для вычисления угла поворота и данных элемента
 * - useCallback для обработчика наведения мыши
 * - Suspense для асинхронной загрузки 3D модели
 */
export const FertilizerGranule = React.memo(() => {
  // Состояние текущего элемента под курсором
  const [hoveredNutrient, setHoveredNutrient] = useState<string | null>(null)

  // Мемоизированный обработчик наведения мыши
  const handleNutrientHover = useCallback((nutrientId: string | null) => {
    setHoveredNutrient(nutrientId)
  }, [])

  /**
   * Вычисляет угол поворота 3D модели в радианах
   *
   * Поворачивается только при наведении на элемент питания.
   * Конвертирует градусы в радианы для Three.js.
   */
  // rotationAngle не используем напрямую — угол поворота передаём прямо в props модели ниже

  /**
   * Данные текущего элемента под курсором
   * Используется для отображения описания
   */
  const hoveredNutrientData = useMemo(() => {
    if (!hoveredNutrient) return null
    return NUTRIENTS.find(n => n.id === hoveredNutrient)
  }, [hoveredNutrient])

  /**
   * Конфигурация текущего элемента под курсором
   * Используется для позиционирования описания и формулы
   */
  const hoveredNutrientConfig = useMemo(() => {
    if (!hoveredNutrient) return null
    return NUTRIENT_CONFIGS[hoveredNutrient]
  }, [hoveredNutrient])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      <div style={{ 
        paddingLeft: '0',
        paddingRight: '0'
      }}>
        <h1 className="main-title" style={{ 
          marginBottom: '12px',
          textAlign: 'left',
          color: '#000',
          marginTop: '0'
        }}>

          Все питание в одной грануле
        </h1>
        <p className="subtitle" style={{ 
          color: 'rgba(26, 31, 35, 1)',
          marginBottom: '0',
          textAlign: 'left',
          width: '632.6437998896976px',
          height: '38.00000006376378px',
          opacity: 1,
          transform: 'rotate(0deg)',
          display: 'flex',
          alignItems: 'center'
        }}>
          Равномерный состав каждой гранулы гарантирует точное и одинаковое питание для всех растений
        </p>
      </div>
      
      <div style={{ 
        position: 'relative',
        width: '1289.5px',
        height: '517px',
        background: 'rgba(255, 255, 255, 1)',
        opacity: 1,
        transform: 'rotate(0deg)',
        padding: '40px 51px 0 51px',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          width: '540px',
          height: '517px',
          position: 'absolute',
          left: '358px', // 409px - 51px (padding слева)
          top: '40px', // padding сверху
          opacity: 1,
          transform: 'rotate(0deg)'
        }}>
          <Canvas
            gl={{
              // Настройки для правильного отображения цветов как в Blender
              outputColorSpace: 'srgb' // Используем sRGB для соответствия Blender
            }}
            onCreated={({ gl }) => {
              /**
               * Blender Color Management:
               * - View Transform: AgX
               * - Exposure: 0.0
               * - Gamma: 1.0
               *
               * В Three.js нет AgX "из коробки", поэтому используем ближайшее (ACESFilmic)
               * и держим экспозицию на нейтрали, чтобы не "пережигать" цвет.
               */
              gl.toneMapping = 1 // ACESFilmic (наиболее близкое стандартное)
              gl.toneMappingExposure = 1.0 // Exposure 0.0 в Blender ≈ 1.0 здесь
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            {/* World Strength в Blender = 1.0 → примерно соответствует ambientLight intensity={1.0} */}
            <ambientLight intensity={1.0} />
            {/* Нейтральный ключевой свет */}
            <directionalLight position={[5, 5, 5]} intensity={1.0} />
            {/* Лёгкий заполняющий свет */}
            <pointLight position={[-3, 2, -3]} intensity={0.25} />
            
            <Suspense fallback={null}>
              <Granule3DWithModel 
                hoverRotation={hoveredNutrient ? (HOVER_ROTATION_ANGLE * Math.PI) / 180 : 0}
                modelPath={`${import.meta.env.BASE_URL}models/granule-organic.glb`}
                initialPosition={[0, 0, 0]}
                initialRotation={[-Math.PI / 2, Math.PI, 0]}
                initialScale={1}
              />
            </Suspense>
            
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              
              minDistance={3.7}
              maxDistance={3.7}
              
            />
          </Canvas>
        </div>
        
        <NutrientSections 
          nutrients={NUTRIENTS}
          onNutrientHover={handleNutrientHover}
          hoveredNutrient={hoveredNutrient}
        />
        
        {/* Описания и формулы при наведении */}
        {hoveredNutrientData && hoveredNutrientConfig && (
          <>
            {/* Описание: появляется под линией элемента при наведении */}
            <NutrientDescription
              description={hoveredNutrientData.description}
              position={hoveredNutrientConfig.description}
            />
            
            {/* Формула на 3D модели: появляется поверх 3D модели при наведении */}
            {hoveredNutrientConfig.formula && hoveredNutrient && NUTRIENT_FORMULA_SVGS[hoveredNutrient] && (
              <NutrientFormula
                position={hoveredNutrientConfig.formula}
                svgContent={NUTRIENT_FORMULA_SVGS[hoveredNutrient]}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
})

FertilizerGranule.displayName = 'FertilizerGranule'
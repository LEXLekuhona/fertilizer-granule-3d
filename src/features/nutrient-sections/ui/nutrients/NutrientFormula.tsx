import React from 'react'
import { STYLES } from '@/shared/config/styles'
import { NutrientFormulaPosition } from '@/shared/config/styles'

/**
 * Пропсы для компонента формулы на 3D модели
 */
interface NutrientFormulaProps {
  position: NutrientFormulaPosition // Позиция и размеры формулы
  svgContent: React.ReactNode // SVG содержимое формулы
}

/**
 * Компонент для отображения SVG формулы на 3D модели
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Отображает SVG формулу элемента питания
 * - Появляется при наведении на элемент питания
 * - Располагается поверх 3D модели
 * 
 * АНИМАЦИЯ:
 * - Использует fadeInScale анимацию для плавного появления с масштабированием
 * - Определена в STYLES.animations.fadeInScale
 * 
 * СТИЛИ:
 * - borderRadius: '100px' для круглой формы
 * - zIndex: 1 для отображения поверх 3D модели
 * 
 * ОПТИМИЗАЦИЯ:
 * - React.memo предотвращает лишние перерисовки
 * - pointerEvents: 'none' позволяет кликам проходить сквозь элемент
 * 
 * ПРИМЕЧАНИЕ: SVG содержимое передается из NUTRIENT_FORMULA_SVGS
 */
export const NutrientFormula = React.memo(({ position, svgContent }: NutrientFormulaProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        opacity: 1,
        transform: 'rotate(0deg)',
        borderRadius: '100px',
        border: '1px solid transparent',
        pointerEvents: 'none',
        zIndex: 1,
        animation: STYLES.animations.fadeInScale
      }}
    >
      {svgContent}
    </div>
  )
})

NutrientFormula.displayName = 'NutrientFormula'

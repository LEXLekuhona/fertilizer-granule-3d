import React from 'react'
import { Nutrient } from '@/shared/config/nutrients'
import { STYLES, NutrientConfig } from '@/shared/config/styles'
import { NutrientBase } from './NutrientBase'

/**
 * Пропсы для компонента элемента питания
 */
interface NutrientComponentProps {
  nutrient: Nutrient // Данные элемента (название, формула, описание)
  config: NutrientConfig // Конфигурация позиций и размеров
  isHovered: boolean // Флаг наведения мыши
  onMouseEnter: () => void // Обработчик начала наведения
  onMouseLeave: () => void // Обработчик окончания наведения
  isLeft: boolean // Флаг расположения слева (влияет на выравнивание текста)
  linePath?: string // SVG путь для линии (опционально)
  lineViewBox?: string // ViewBox для SVG линии (опционально)
}

/**
 * Универсальный компонент для отображения элемента питания
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Рендерит SVG линию (если указана в конфигурации)
 * - Рендерит надпись через NutrientBase
 * - Обрабатывает события наведения мыши
 * 
 * ОПТИМИЗАЦИЯ:
 * - Обернут в React.memo для предотвращения лишних перерисовок
 * - Перерисовывается только при изменении пропсов
 */
export const NutrientComponent = React.memo(({
  nutrient,
  config,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  isLeft,
  linePath,
  lineViewBox,
}: NutrientComponentProps) => {
  const labelPosition = config.label.position.left 
    ? { left: config.label.position.left, top: config.label.position.top, transform: 'translate(0, 0)' }
    : { right: config.label.position.right, top: config.label.position.top, transform: 'translate(0, 0)' }

  return (
    <>
      {/* Линия SVG */}
      {config.line && linePath && (
        <svg
          style={{
            position: 'absolute',
            top: config.line.top,
            left: config.line.left,
            right: config.line.right,
            width: config.line.width,
            height: config.line.height,
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 1,
            transform: config.line.transform || 'rotate(0deg)'
          }}
          viewBox={lineViewBox || "0 0 560 103"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d={linePath}
            fill="#2F2F2F"
            stroke={STYLES.colors.stroke}
            strokeWidth="1"
          />
        </svg>
      )}

      {/* Надпись */}
      <NutrientBase
        nutrient={nutrient}
        isHovered={isHovered}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        labelPosition={labelPosition}
        isLeft={isLeft}
        labelWidth={config.label.width}
        labelHeight={config.label.height}
      />
    </>
  )
})

NutrientComponent.displayName = 'NutrientComponent'

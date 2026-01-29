import React from 'react'
import { Nutrient } from '@/shared/config/nutrients'
import { STYLES } from '@/shared/config/styles'

/**
 * Пропсы для базового компонента надписи элемента питания
 */
interface NutrientBaseProps {
  nutrient: Nutrient // Данные элемента
  isHovered: boolean // Флаг наведения мыши
  onMouseEnter: () => void // Обработчик начала наведения
  onMouseLeave: () => void // Обработчик окончания наведения
  labelPosition: React.CSSProperties // CSS стили для позиционирования
  isLeft: boolean // Флаг расположения слева (влияет на формат текста)
  labelWidth: string // Ширина надписи
  labelHeight: string // Высота надписи
}

/**
 * Базовый компонент для отображения надписи элемента питания
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Отображает название элемента и формулу
 * - Обрабатывает события наведения мыши
 * - Управляет z-index для корректного наложения элементов
 * 
 * ФОРМАТ ТЕКСТА:
 * - Если isLeft === true: "/ Название (Формула)"
 * - Если isLeft === false: "Название (Формула) /"
 * 
 * СТИЛИ:
 * - Формула отображается серым цветом (STYLES.colors.textFormula)
 * - Использует класс .nutrient-label из index.css
 * 
 * ОПТИМИЗАЦИЯ:
 * - React.memo предотвращает лишние перерисовки
 */
export const NutrientBase = React.memo(({
  nutrient,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  labelPosition,
  isLeft,
  labelWidth,
  labelHeight,
}: NutrientBaseProps) => {
  return (
    <div
      className="position-absolute"
      style={{
        ...labelPosition,
        pointerEvents: 'auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: isHovered ? 30 : 25
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          className="nutrient-label"
          style={{
            whiteSpace: 'nowrap',
            width: labelWidth,
            height: labelHeight,
            color: STYLES.colors.text,
            opacity: 1,
            transform: 'rotate(0deg)',
            transition: 'all 0.3s ease',
            textAlign: isLeft ? 'right' : 'left',
            padding: '0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLeft ? (
            <>/ {nutrient.name} <span style={{ color: STYLES.colors.textFormula }}>({nutrient.formula})</span></>
          ) : (
            <>{nutrient.name} <span style={{ color: STYLES.colors.textFormula }}>({nutrient.formula})</span> /</>
          )}
        </div>
      </div>
    </div>
  )
})

NutrientBase.displayName = 'NutrientBase'

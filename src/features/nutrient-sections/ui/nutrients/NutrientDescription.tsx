import React from 'react'
import { STYLES } from '@/shared/config/styles'
import { NutrientDescriptionPosition } from '@/shared/config/styles'

/**
 * Пропсы для компонента описания элемента питания
 */
interface NutrientDescriptionProps {
  description: string // Текст описания действия элемента на растения
  position: NutrientDescriptionPosition // Позиция и размеры описания
}

/**
 * Компонент для отображения текстового описания элемента питания
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Отображает описание действия элемента на растения
 * - Появляется при наведении на элемент питания
 * - Располагается под линией элемента
 * 
 * АНИМАЦИЯ:
 * - Использует fadeInOnly анимацию для плавного появления
 * - Определена в STYLES.animations.fadeInOnly
 * 
 * СТИЛИ:
 * - Использует класс .nutrient-description из index.css
 * - Цвет текста: STYLES.colors.textDescription
 * 
 * ОПТИМИЗАЦИЯ:
 * - React.memo предотвращает лишние перерисовки
 * - pointerEvents: 'none' позволяет кликам проходить сквозь элемент
 */
export const NutrientDescription = React.memo(({ description, position }: NutrientDescriptionProps) => {
  return (
    <div
      className="nutrient-description"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        right: position.right,
        width: position.width,
        height: position.height,
        opacity: 1,
        transform: 'rotate(0deg)',
        pointerEvents: 'none',
        zIndex: 20,
        animation: STYLES.animations.fadeInOnly
      }}
    >
      {description}
    </div>
  )
})

NutrientDescription.displayName = 'NutrientDescription'

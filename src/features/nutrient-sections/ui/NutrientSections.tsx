import { NUTRIENT_CONFIGS } from '@/shared/config/nutrient-configs'
import { NUTRIENT_LINE_PATHS } from '@/shared/config/nutrient-lines'
import { Nutrient } from '@/shared/config/nutrients'
import React, { useCallback, useMemo } from 'react'
import { NutrientComponent } from './nutrients/NutrientComponent'

/**
 * Пропсы для компонента секций элементов питания
 */
interface NutrientSectionsProps {
  nutrients: Nutrient[] // Массив всех элементов питания
  onNutrientHover: (nutrientId: string | null) => void // Колбэк при наведении/уходе мыши
  hoveredNutrient: string | null // ID текущего элемента под курсором
}

/**
 * Компонент для отображения всех элементов питания вокруг 3D модели
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Рендерит все элементы питания с их линиями и надписями
 * - Обрабатывает события наведения мыши
 * - Отображает маркеры на линиях (белые кружки)
 * 
 * СТРУКТУРА:
 * - Маркеры (белые кружки) на линиях - статичные SVG элементы
 * - NutrientComponent для каждого элемента - динамические компоненты
 * 
 * ОПТИМИЗАЦИЯ:
 * - React.memo предотвращает перерисовку при неизменных пропсах
 * - useCallback для обработчиков событий
 * - useMemo для маппинга isLeft (выравнивание текста)
 * 
 * ВАЖНО: При добавлении нового элемента добавьте его в nutrientIsLeft map
 */
export const NutrientSections = React.memo(({ 
  nutrients, 
  onNutrientHover, 
  hoveredNutrient 
}: NutrientSectionsProps) => {
  // Мемоизированный обработчик наведения мыши
  const handleNutrientHover = useCallback((nutrientId: string) => {
    onNutrientHover(nutrientId)
  }, [onNutrientHover])

  // Мемоизированный обработчик ухода мыши
  const handleNutrientLeave = useCallback(() => {
    onNutrientHover(null)
  }, [onNutrientHover])

  /**
   * Маппинг элементов на флаг расположения слева
   * 
   * Используется для определения выравнивания текста:
   * - true: текст выравнивается по правому краю (элементы слева)
   * - false: текст выравнивается по левому краю (элементы справа)
   * 
   * ВАЖНО: При добавлении нового элемента добавьте запись сюда
   */
  const nutrientIsLeft: Record<string, boolean> = useMemo(() => ({
    nitrogen: true,
    phosphorus: true,
    potassium: true,
    magnesium: false,
    calcium: false,
    sulfur: false,
  }), [])

  return (
    <div 
      className="position-absolute"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >

      {/* маркер для линии фосфор */}
      <svg
        style={{
          position: 'absolute',
          top: '324px',
          left: '506px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер Магний */}
      <svg
        style={{
          position: 'absolute',
          top: '114px',
          left: '729px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер Сера */}
      <svg
        style={{
          position: 'absolute',
          top: '263px',
          left: '830px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер кальций */}
      <svg
        style={{
          position: 'absolute',
          top: '352px',
          left: '753px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер калий */}
      <svg
        style={{
          position: 'absolute',
          top: '397px',
          left: '607px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Рендерим все элементы питания */}
      {nutrients.map((nutrient) => {
        // Получаем конфигурацию позиций для текущего элемента
        const config = NUTRIENT_CONFIGS[nutrient.id]
        // Получаем SVG путь для линии (если есть)
        const lineData = NUTRIENT_LINE_PATHS[nutrient.id]
        // Проверяем, наведена ли мышь на текущий элемент
        const isHovered = hoveredNutrient === nutrient.id
        // Определяем выравнивание текста (слева или справа)
        const isLeft = nutrientIsLeft[nutrient.id] ?? false

        // Если конфигурации нет, пропускаем элемент
        if (!config) {
          return null
        }

        return (
          <NutrientComponent
            key={nutrient.id}
            nutrient={nutrient}
            config={config}
            isHovered={isHovered}
            onMouseEnter={() => handleNutrientHover(nutrient.id)}
            onMouseLeave={handleNutrientLeave}
            isLeft={isLeft}
            linePath={lineData?.path}
            lineViewBox={lineData?.viewBox}
          />
        )
      })}
    </div>
  )
})

NutrientSections.displayName = 'NutrientSections'
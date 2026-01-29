/**
 * Глобальные константы стилей для всего приложения
 * 
 * Централизованное хранение цветов, размеров и анимаций.
 * Используется для обеспечения единообразия дизайна и упрощения изменений.
 */
export const STYLES = {
  colors: {
    text: '#000',
    textSecondary: 'rgba(26, 31, 35, 1)',
    textDescription: 'rgba(47, 47, 47, 1)',
    textFormula: 'rgba(138, 138, 138, 1)',
    background: 'rgba(255, 255, 255, 1)',
    stroke: 'rgba(47, 47, 47, 1)',
  },
  dimensions: {
    container: {
      width: '1289.5px',
      height: '517px',
    },
    model: {
      width: '540px',
      height: '517px',
    },
  },
  animations: {
    fadeInOnly: 'fadeInOnly 0.3s ease',
    fadeInScale: 'fadeInScale 0.3s ease',
  },
} as const

/**
 * Базовый интерфейс для позиционирования элементов
 * Использует либо left, либо right для горизонтального позиционирования
 */
export interface NutrientPosition {
  top: string
  left?: string
  right?: string
}

/**
 * Позиция для описания элемента питания
 * Появляется под линией при наведении на элемент
 */
export interface NutrientDescriptionPosition extends NutrientPosition {
  width: string
  height: string
}

/**
 * Позиция для формулы на 3D модели
 * Отображается поверх 3D модели при наведении на элемент
 */
export interface NutrientFormulaPosition extends NutrientPosition {
  width: string
  height: string
}

/**
 * Позиция для SVG линии, соединяющей надпись с 3D моделью
 * Может иметь transform для поворота линии
 */
export interface NutrientLinePosition extends NutrientPosition {
  width: string
  height: string
  transform?: string
}

/**
 * Полная конфигурация элемента питания
 * 
 * Содержит все позиции и размеры для:
 * - label: надпись с названием и формулой
 * - line: SVG линия (опционально, может отсутствовать)
 * - description: текстовое описание (появляется при наведении)
 * - formula: SVG формула на 3D модели (появляется при наведении)
 */
export interface NutrientConfig {
  label: {
    position: NutrientPosition
    width: string
    height: string
  }
  line?: NutrientLinePosition
  description: NutrientDescriptionPosition
  formula?: NutrientFormulaPosition
}

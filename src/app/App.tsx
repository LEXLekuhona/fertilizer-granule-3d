import { FertilizerGranule } from '@/widgets/fertilizer-granule'

/**
 * Главный компонент приложения
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Инициализирует корневой контейнер с фиксированными размерами
 * - Рендерит главный виджет FertilizerGranule
 * 
 * РАЗМЕРЫ:
 * - Ширина: 1392px (соответствует дизайну из Figma)
 * - Высота: 661.03662109375px (соответствует дизайну из Figma)
 * 
 * ПРИМЕЧАНИЕ: Размеры фиксированные для точного соответствия макету
 */
function App() {
  return (
    <div 
      style={{
        width: '1392px',
        height: '661.03662109375px',
        margin: '0 auto',
        position: 'relative',
        backgroundColor: '#fff'
      }}
    >
      <FertilizerGranule />
    </div>
  )
}

export default App
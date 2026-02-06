import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './app/index.css'

/**
 * Функция для инициализации приложения в указанном контейнере
 * Используется для встраивания в существующий HTML сайт
 * 
 * @param containerId - ID элемента, в который будет встроено приложение (по умолчанию 'root')
 */
function initFertilizerGranule(containerId: string = 'root') {
  const container = document.getElementById(containerId)
  
  if (!container) {
    // Элемент не найден - создаём его автоматически
    const newContainer = document.createElement('div')
    newContainer.id = containerId
    document.body.appendChild(newContainer)
    return initFertilizerGranule(containerId)
  }

  const root = ReactDOM.createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )

  return root
}

// Экспортируем функцию глобально для встраивания в другие сайты
declare global {
  interface Window {
    initFertilizerGranule: typeof initFertilizerGranule
  }
}

window.initFertilizerGranule = initFertilizerGranule

// Автоматическая инициализация, если есть элемент с id="root" (для dev режима)
if (document.getElementById('root')) {
  initFertilizerGranule('root')
}
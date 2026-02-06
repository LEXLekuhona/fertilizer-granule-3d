# Интерактивная 3D модель гранулы удобрения

Интерактивное веб-приложение для визуализации состава гранулы удобрения с использованием React, TypeScript и Three.js.

## 📋 Требования

- **Node.js**: v18.0.0 или выше (рекомендуется v20+)
- **npm**: v9.0.0 или выше
- **Операционная система**: macOS, Linux, Windows

> **Текущие версии в проекте**: Node.js v22.12.0, npm v10.9.0

## 📦 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Просмотр production сборки
npm run preview
```

## 📁 Структура проекта (Feature-Sliced Design)

```text
src/
├── app/                    # Инициализация приложения
│   ├── App.tsx            # Главный компонент
│   └── index.css          # Глобальные стили
├── entities/              # Бизнес-сущности
│   └── granule-3d/        # 3D модель гранулы
│       └── ui/
│           └── Granule3DWithModel.tsx  # Компонент 3D модели
├── features/              # Функциональные возможности
│   └── nutrient-sections/ # Секции элементов питания
│       └── ui/
│           ├── NutrientSections.tsx     # Контейнер всех элементов
│           └── nutrients/               # Компоненты элементов
│               ├── NutrientBase.tsx      # Базовый компонент надписи
│               ├── NutrientComponent.tsx # Универсальный компонент элемента
│               ├── NutrientDescription.tsx # Компонент описания
│               └── NutrientFormula.tsx   # Компонент формулы
├── shared/                # Переиспользуемые модули
│   └── config/            # Конфигурации
│       ├── nutrients.ts           # Данные элементов питания
│       ├── nutrient-configs.ts   # Позиции и размеры элементов
│       ├── nutrient-lines.ts     # SVG пути для линий
│       ├── nutrient-formulas.tsx # SVG формулы
│       └── styles.ts             # Константы стилей
└── widgets/               # Составные виджеты
    └── fertilizer-granule/ # Главный виджет
        └── ui/
            └── FertilizerGranule.tsx  # Компонент всего виджета
```

## 🚀 Как добавить новый элемент питания

### Шаг 1: Добавить данные элемента

В файле `src/shared/config/nutrients.ts` добавьте новый элемент в массив `NUTRIENTS`:

```typescript
{
  id: 'new-element',
  name: 'Новый элемент',
  formula: 'X',
  description: 'Описание действия элемента',
  position: { angle: 0, x: 0, y: 0 }
}
```

### Шаг 2: Добавить конфигурацию позиций

В файле `src/shared/config/nutrient-configs.ts` добавьте конфигурацию:

```typescript
newElement: {
  label: {
    position: { top: '100px', left: '50px' },
    width: '150px',
    height: '20px',
  },
  line: {  // Опционально
    top: '120px',
    left: '50px',
    width: '200px',
    height: '50px',
  },
  description: {
    top: '180px',
    left: '50px',
    width: '300px',
    height: '50px',
  },
  formula: {  // Опционально
    top: '250px',
    left: '400px',
    width: '98px',
    height: '100px',
  },
}
```

## 🔧 Технологии

- **Node.js v22.12.0** - Среда выполнения JavaScript
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Three.js** - 3D графика
- **React Three Fiber** - React рендерер для Three.js
- **@react-three/drei** - Полезные утилиты для R3F
- **Vite** - Сборщик и dev-сервер
- **Bootstrap** - CSS фреймворк (используется минимально)

## 🌐 Встраивание в существующий HTML сайт

Проект можно встроить в существующий сайт на чистом HTML/CSS/JS двумя способами:

### Вариант 1: Iframe (рекомендуется для начала)

```html
<iframe 
    src="/fertilizer-granule/index.html" 
    width="1392" 
    height="700"
    frameborder="0">
</iframe>
```

### Вариант 2: Прямое встраивание

После сборки проект предоставляет глобальную функцию `window.initFertilizerGranule()` для встраивания.

**Шаги:**

1. **Соберите проект:**
   ```bash
   npm run build:deploy
   ```
   Эта команда создаст папку `dist/` с готовыми файлами и автоматически скопирует 3D модели.

2. **Найдите имена файлов в `dist/assets/`:**
   - CSS: `index.[hash].css` (например, `index.B6-ayNI-.css`)
   - JS: `index.[hash].js` (например, `index.DAPXrpFb.js`)

3. **Скопируйте файлы на ваш сервер:**
   ```
   ваш-сайт/
   ├── granule/
   │   ├── assets/
   │   │   ├── index.B6-ayNI-.css
   │   │   └── index.DAPXrpFb.js
   │   └── models/
   │       ├── granule-organic.glb
   │       └── textures/
   ```

4. **Используйте в вашем HTML:**

   ```html
   <!DOCTYPE html>
   <html lang="ru">
   <head>
       <meta charset="UTF-8">
       <title>Мой сайт</title>
       
       <!-- Подключаем CSS -->
       <link rel="stylesheet" href="./granule/assets/index.B6-ayNI-.css">
   </head>
   <body>
       <h1>Добро пожаловать</h1>
       
       <!-- Контейнер для 3D приложения -->
       <div id="my-fertilizer-app"></div>
       
       <p>Текст после приложения</p>
       
       <!-- Подключаем JS -->
       <script src="./granule/assets/index.DAPXrpFb.js"></script>
       
       <!-- Инициализируем приложение -->
       <script>
           window.initFertilizerGranule('my-fertilizer-app');
       </script>
   </body>
   </html>
   ```

**Важно:**
- Функция `window.initFertilizerGranule` доступна глобально после загрузки JS файла
- Замените имена файлов (`index.B6-ayNI-.css` и `index.DAPXrpFb.js`) на актуальные из вашей сборки
- Путь к моделям (`./models/`) должен быть относительно JS файла
- Для локального тестирования используйте файл `integration-example.html` в корне проекта

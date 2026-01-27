# 3D Интерактивная Гранула Удобрения

Интерактивный 3D компонент, демонстрирующий состав гранулы удобрения с возможностью наведения на различные питательные вещества.

## Технологии

- React 18
- TypeScript
- React Three Fiber (3D рендеринг)
- Three.js
- Bootstrap 5
- Vite

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

## Функциональность

- 3D модель гранулы удобрения
- Интерактивные секции для каждого питательного вещества:
  - Азот (N)
  - Фосфор (P2O5)
  - Калий (K2O)
  - Магний (MgO)
  - Сера (SO3)
  - Кальций (Ca)
- При наведении на секцию:
  - Гранула плавно поворачивается на 5 градусов в горизонтальной плоскости
  - Отображается описание питательного вещества
- При уходе курсора гранула возвращается в исходное положение
- Настройка угла поворота доступна в `src/shared/config/nutrients.ts` (константа `HOVER_ROTATION_ANGLE`)

## Структура проекта (Feature-Sliced Design)

```
src/
├── app/              # Инициализация приложения
├── entities/         # Бизнес-сущности (Granule3D)
├── features/         # Функциональные возможности (NutrientSections)
├── widgets/          # Композитные блоки (FertilizerGranule)
└── shared/           # Переиспользуемые ресурсы (конфиги, утилиты)
```

## Загрузка 3D модели

Для загрузки собственной 3D модели (GLB/GLTF):

1. Поместите файл модели в папку `public/models/` (например, `public/models/granule.glb`)

2. В файле `src/widgets/fertilizer-granule/ui/FertilizerGranule.tsx` замените:
   ```tsx
   import { Granule3D } from '@/entities/granule-3d'
   ```
   на:
   ```tsx
   import { Granule3DWithModel } from '@/entities/granule-3d/ui/Granule3DWithModel'
   ```

3. Замените компонент:
   ```tsx
   <Granule3D 
     hoverRotation={hoveredNutrient ? (HOVER_ROTATION_ANGLE * Math.PI) / 180 : 0}
   />
   ```
   на:
   ```tsx
   <Granule3DWithModel 
     hoverRotation={hoveredNutrient ? (HOVER_ROTATION_ANGLE * Math.PI) / 180 : 0}
     modelPath="/models/granule.glb"
   />
   ```

## Настройка угла поворота

Угол поворота при ховере настраивается в файле `src/shared/config/nutrients.ts`:
```typescript
export const HOVER_ROTATION_ANGLE = 5 // измените на нужное значение
```
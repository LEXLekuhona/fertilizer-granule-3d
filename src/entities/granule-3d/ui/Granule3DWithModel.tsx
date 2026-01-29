import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group, Mesh, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from 'three'

/**
 * Пропсы для компонента 3D модели гранулы
 */
interface Granule3DWithModelProps {
  hoverRotation: number // Угол поворота в радианах при наведении на элемент питания
  modelPath: string // Путь к GLB файлу модели
  /** 
   * Начальная позиция модели [x, y, z] в единицах Three.js
   * По умолчанию: [0, 0, 0] - центр сцены
   * Примеры:
   * - [0, 0, 0] - центр
   * - [1, 0, 0] - смещение вправо на 1 единицу
   * - [0, 1, 0] - смещение вверх на 1 единицу
   */
  initialPosition?: [number, number, number]
  /** 
   * Начальный поворот модели [x, y, z] в радианах
   * По умолчанию: [0, 0, 0] - без поворота
   * Примеры:
   * - [0, Math.PI / 4, 0] - поворот на 45 градусов вокруг оси Y
   * - [Math.PI / 2, 0, 0] - поворот на 90 градусов вокруг оси X
   */
  initialRotation?: [number, number, number]
  /** 
   * Начальный масштаб модели
   * По умолчанию: 1 - оригинальный размер
   * Может быть числом (равномерное масштабирование) или массивом [x, y, z]
   * Примеры:
   * - 1 - оригинальный размер
   * - 0.5 - уменьшить в 2 раза
   * - 2 - увеличить в 2 раза
   * - [1, 2, 1] - растянуть по оси Y в 2 раза
   */
  initialScale?: number | [number, number, number]
}

/**
 * Предзагрузка модели для оптимизации
 * 
 * Загружает модель заранее, чтобы избежать задержек при первом рендере.
 * Вызывается на уровне модуля, выполняется один раз при загрузке модуля.
 */
// Используем BASE_URL для правильных путей в dev и production
const MODELS_BASE = import.meta.env.BASE_URL + 'models/'
useGLTF.preload(`${MODELS_BASE}granule-organic.glb`)

/**
 * Компонент для отображения 3D модели гранулы удобрения
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Загружает и отображает GLB модель из файла
 * - Применяет SVG текстуру к материалам модели
 * - Реализует плавный поворот модели при наведении на элементы питания
 * 
 * МЕХАНИЗМ ПОВОРОТА:
 * - baseRotation: базовый угол поворота модели
 * - currentHoverRotation: текущий угол поворота при наведении
 * - Использует интерполяцию для плавной анимации (коэффициент 0.15)
 * 
 * ТЕКСТУРА:
 * - Загружает SVG файл (/img.svg) как текстуру
 * - Применяет ко всем Mesh объектам в модели
 * - Three.js автоматически конвертирует SVG в растровое изображение
 * 
 * ОПТИМИЗАЦИЯ:
 * - Предзагрузка модели через useGLTF.preload
 * - Использование ref для избежания лишних перерисовок
 * - Плавная интерполяция поворота через useFrame
 */
export const Granule3DWithModel = ({ 
  hoverRotation, 
  modelPath,
  initialPosition = [0, 0, 0],
  initialRotation = [0, 0, 0],
  initialScale = 1
}: Granule3DWithModelProps) => {
  const { scene } = useGLTF(modelPath) // Загруженная 3D сцена
  const { gl } = useThree() // Референс на WebGL рендерер для принудительного обновления
  const groupRef = useRef<Group>(null) // Референс на группу объектов модели
  const baseRotation = useRef(0) // Базовый угол поворота (без учета hover)
  const currentHoverRotation = useRef(0) // Текущий угол поворота при hover
  const isInitialized = useRef(false) // Флаг инициализации базового поворота

  /**
   * Применение материалов и текстур из GLB модели
   * 
   * ПРОБЛЕМА: Модель может быть серой, если:
   * 1. Материалы не экспортировались из Blender
   * 2. Текстуры не встроены в GLB или пути неправильные
   * 3. Материалы не применяются правильно
   * 
   * РЕШЕНИЕ:
   * - Проверяем и применяем материалы из GLB
   * - Загружаем текстуры из папки textures/ если они не встроены
   * - Настраиваем правильные параметры материалов (colorSpace, etc.)
   */
  useEffect(() => {
    if (scene) {
      const loader = new TextureLoader()
      
      // Детальная проверка всех текстур в материалах из GLB
      // ВАЖНО: Проверяем наличие основной текстуры map (Albedo), а не просто любых текстур
      let hasAlbedoTexture = false
      
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          const material = child.material as MeshStandardMaterial
          
          // Проверяем, есть ли основная текстура Albedo (map) с нормальным размером
          if (material.map && material.map.image && material.map.image.width > 1 && material.map.image.height > 1) {
            hasAlbedoTexture = true
          }
        }
      })
      
      // Если основной текстуры Albedo нет или она слишком маленькая, загружаем текстуры из папки textures/
      if (!hasAlbedoTexture) {
        const loadTextures = async () => {
          try {
            // Загружаем все текстуры
            // ВАЖНО:
            // - BaseColor_BAKED.png — запечённый результат ColorRamp(Albedo) из Blender (sRGB)
            // - Normal/Roughness/Occlusion — карты данных (Linear)
            const texturesBase = MODELS_BASE + 'textures/'
            const baseColorTexture = await loader.loadAsync(`${texturesBase}BaseColor_BAKED.png`)
            baseColorTexture.colorSpace = SRGBColorSpace // sRGB для цветовой текстуры
            baseColorTexture.flipY = false // Blender использует другую ориентацию Y
            
            const normalTexture = await loader.loadAsync(`${texturesBase}Normal.png`)
            // Normal map должна быть в Linear (не sRGB)
            normalTexture.flipY = false
            
            const roughnessTexture = await loader.loadAsync(`${texturesBase}Roughness.png`)
            // Roughness map должна быть в Linear (не sRGB)
            roughnessTexture.flipY = false
            
            const occlusionTexture = await loader.loadAsync(`${texturesBase}Occlusion.png`)
            // Occlusion map должна быть в Linear (не sRGB)
            occlusionTexture.flipY = false
            
            // Применяем текстуры ко всем материалам в сцене
            let materialsCount = 0
            
            const applyTexturesToMaterial = (material: MeshStandardMaterial) => {
              // Применяем текстуры
              material.map = baseColorTexture
              material.normalMap = normalTexture
              material.roughnessMap = roughnessTexture
              material.aoMap = occlusionTexture
              
              // Включаем использование текстур
              material.normalScale.set(1, 1)
              material.aoMapIntensity = 1
              
              // Настраиваем параметры материала для лучшего отображения
              material.needsUpdate = true
              materialsCount++
            }
            
            scene.traverse((child) => {
              if (child instanceof Mesh) {
                if (child.material) {
                  // Обрабатываем как одиночный материал, так и массив материалов
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                      if (mat instanceof MeshStandardMaterial) {
                        applyTexturesToMaterial(mat)
                      }
                    })
                  } else if (child.material instanceof MeshStandardMaterial) {
                    applyTexturesToMaterial(child.material)
                  }
                }
              }
            })
            
            // Принудительно обновляем рендерер
            gl.state.reset()
          } catch (error) {
            // Ошибка загрузки текстур - модель будет использовать материалы из GLB
          }
        }
        
        loadTextures()
      } else {
        // Если текстуры есть в GLB, просто настраиваем colorSpace
        scene.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            const material = child.material as MeshStandardMaterial
            
            // Настраиваем правильный colorSpace для текстур
            if (material.map) {
              material.map.colorSpace = SRGBColorSpace
            }
            if (material.normalMap) {
              material.normalMap.colorSpace = SRGBColorSpace
            }
            if (material.roughnessMap) {
              material.roughnessMap.colorSpace = SRGBColorSpace
            }
            if (material.aoMap) {
              material.aoMap.colorSpace = SRGBColorSpace
            }
            
            material.needsUpdate = true
          }
        })
      }
    }
  }, [scene])

  /**
   * Инициализация базового поворота при первом рендере
   */
  useEffect(() => {
    if (groupRef.current && !isInitialized.current) {
      baseRotation.current = groupRef.current.rotation.y
      isInitialized.current = true
    }
  }, [])

  /**
   * Анимация поворота модели при наведении на элементы питания
   * 
   * Выполняется каждый кадр (60 FPS) через useFrame.
   * 
   * АЛГОРИТМ:
   * 1. При изменении hoverRotation обновляем базовый угол
   * 2. Плавно интерполируем текущий угол к целевому (коэффициент 0.15)
   * 3. Применяем сумму базового и текущего углов поворота
   * 
   * КОЭФФИЦИЕНТ ИНТЕРПОЛЯЦИИ (0.15):
   * - Меньше значение = более плавная, но медленная анимация
   * - Больше значение = более быстрая, но резкая анимация
   * - 0.15 обеспечивает баланс между плавностью и отзывчивостью
   */
  useFrame(() => {
    if (groupRef.current) {
      // Если ховер-поворот изменился (начало или конец ховера)
      // обновляем базовый поворот, вычитая текущий ховер-поворот
      if (Math.abs(hoverRotation - currentHoverRotation.current) > 0.001) {
        const currentTotal = groupRef.current.rotation.y
        baseRotation.current = currentTotal - currentHoverRotation.current
      }

      // Плавная интерполяция ховер-поворота (коэффициент для более плавной анимации)
      const targetHover = hoverRotation
      const diff = targetHover - currentHoverRotation.current
      // Используем более плавный коэффициент интерполяции
      currentHoverRotation.current += diff * 0.15

      // Если разница очень мала, устанавливаем точно (для избежания бесконечной анимации)
      if (Math.abs(diff) < 0.001) {
        currentHoverRotation.current = targetHover
      }

      // Применяем базовый поворот + текущий ховер-поворот
      groupRef.current.rotation.y = baseRotation.current + currentHoverRotation.current
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={initialPosition}
      rotation={initialRotation}
      scale={initialScale}
    >
      <primitive object={scene} />
    </group>
  )
}
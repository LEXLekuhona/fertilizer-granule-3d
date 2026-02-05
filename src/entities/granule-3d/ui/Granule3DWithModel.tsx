import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Group, LinearSRGBColorSpace, Mesh, MeshStandardMaterial, SRGBColorSpace, TextureLoader } from 'three'

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
// Предзагрузка модели для оптимизации
useGLTF.preload(`${import.meta.env.BASE_URL}models/granule-organic.glb`)

/**
 * Компонент для отображения 3D модели гранулы удобрения
 * 
 * ОТВЕТСТВЕННОСТЬ:
 * - Загружает и отображает GLB модель из файла
 * - Использует материалы и текстуры, встроенные в GLB файл
 * - Реализует плавный поворот модели при наведении на элементы питания
 * 
 * МЕХАНИЗМ ПОВОРОТА:
 * - baseRotation: базовый угол поворота модели
 * - currentHoverRotation: текущий угол поворота при наведении
 * - Использует интерполяцию для плавной анимации (коэффициент 0.15)
 * 
 * ТЕКСТУРЫ:
 * - Используются только текстуры, встроенные в GLB файл
 * - Настраивается правильный colorSpace (sRGB) для корректного отображения цветов
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
  const { gl } = useThree() // Референс на WebGL рендерер
  const groupRef = useRef<Group>(null) // Референс на группу объектов модели
  const baseRotation = useRef(0) // Базовый угол поворота (без учета hover)
  const currentHoverRotation = useRef(0) // Текущий угол поворота при hover
  const isInitialized = useRef(false) // Флаг инициализации базового поворота

  /**
   * Настройка материалов и текстур из GLB модели
   * 
   * ПРИОРИТЕТ:
   * 1. Используются текстуры, встроенные в GLB файл
   * 2. Если в GLB нет основной цветовой текстуры (map/Albedo), загружаем из внешних файлов
   * 
   * Настраивается правильный colorSpace для корректного отображения цветов:
   * - map (Albedo/BaseColor) - SRGBColorSpace (цветовая текстура)
   * - normalMap, roughnessMap, aoMap - LinearSRGBColorSpace (данные, не цвета)
   */
  useEffect(() => {
    if (scene) {
      const loader = new TextureLoader()
      let hasAlbedoTexture = false
      let materialsCount = 0
      
      // Сначала проверяем, есть ли основная цветовая текстура в GLB
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          const material = child.material instanceof MeshStandardMaterial 
            ? child.material 
            : Array.isArray(child.material) 
              ? child.material.find(m => m instanceof MeshStandardMaterial) as MeshStandardMaterial
              : null
          
          if (material && material.map && material.map.image && 
              material.map.image.width > 1 && material.map.image.height > 1) {
            hasAlbedoTexture = true
          }
        }
      })
      
      // Если основной цветовой текстуры нет, загружаем из внешних файлов
      if (!hasAlbedoTexture) {
        const loadTextures = async () => {
          try {
            const texturesBase = `${import.meta.env.BASE_URL}models/textures/`
            
            const baseColorTexture = await loader.loadAsync(`${texturesBase}BaseColor_BAKED.png`)
            baseColorTexture.colorSpace = SRGBColorSpace
            baseColorTexture.flipY = false
            
            const normalTexture = await loader.loadAsync(`${texturesBase}Normal.png`)
            normalTexture.colorSpace = LinearSRGBColorSpace
            normalTexture.flipY = false
            
            const roughnessTexture = await loader.loadAsync(`${texturesBase}Roughness.png`)
            roughnessTexture.colorSpace = LinearSRGBColorSpace
            roughnessTexture.flipY = false
            
            const occlusionTexture = await loader.loadAsync(`${texturesBase}Occlusion.png`)
            occlusionTexture.colorSpace = LinearSRGBColorSpace
            occlusionTexture.flipY = false
            
            const applyTexturesToMaterial = (material: MeshStandardMaterial) => {
              material.map = baseColorTexture
              material.normalMap = normalTexture
              material.roughnessMap = roughnessTexture
              material.aoMap = occlusionTexture
              
              material.normalScale.set(1, 1)
              material.aoMapIntensity = 1
              material.needsUpdate = true
              materialsCount++
            }
            
            scene.traverse((child) => {
              if (child instanceof Mesh && child.material) {
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
            })
            
            gl.state.reset()
            console.log(`[GLB Load] Загружены внешние текстуры для ${materialsCount} материалов`)
          } catch (error) {
            console.warn('[GLB Load] Ошибка загрузки внешних текстур:', error)
          }
        }
        
        loadTextures()
      } else {
        // Если текстуры есть в GLB, просто настраиваем colorSpace
        const setupMaterial = (material: MeshStandardMaterial) => {
          if (material.map) {
            material.map.colorSpace = SRGBColorSpace
          }
          if (material.normalMap) {
            material.normalMap.colorSpace = LinearSRGBColorSpace
          }
          if (material.roughnessMap) {
            material.roughnessMap.colorSpace = LinearSRGBColorSpace
          }
          if (material.aoMap) {
            material.aoMap.colorSpace = LinearSRGBColorSpace
          }
          if (material.metalnessMap) {
            material.metalnessMap.colorSpace = LinearSRGBColorSpace
          }
          
          material.needsUpdate = true
          materialsCount++
        }
        
        scene.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat instanceof MeshStandardMaterial) {
                  setupMaterial(mat)
                }
              })
            } else if (child.material instanceof MeshStandardMaterial) {
              setupMaterial(child.material)
            }
          }
        })
        
        console.log(`[GLB Load] Используются текстуры из GLB для ${materialsCount} материалов`)
      }
    }
  }, [scene, gl])

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
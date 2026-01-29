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
useGLTF.preload('/models/granule-organic.glb')

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
      const foundTextures: string[] = []
      
      console.log('🔍 Проверяем GLB файл на наличие текстур...')
      
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          const material = child.material as MeshStandardMaterial
          
          // Проверяем все возможные типы текстур
          const textures: Record<string, any> = {
            'map (Albedo)': material.map,
            'normalMap': material.normalMap,
            'roughnessMap': material.roughnessMap,
            'metalnessMap': material.metalnessMap,
            'aoMap': material.aoMap,
            'emissiveMap': material.emissiveMap,
            'bumpMap': material.bumpMap,
            'displacementMap': material.displacementMap,
            'alphaMap': material.alphaMap,
            'envMap': material.envMap
          }
          
          // Проверяем каждую текстуру
          Object.entries(textures).forEach(([name, texture]) => {
            if (texture) {
              const textureInfo = texture.image 
                ? `${name}: ${texture.image.src || texture.image.data || 'встроенная'} (${texture.image.width}x${texture.image.height})`
                : `${name}: встроенная (${texture.image?.width || '?'}x${texture.image?.height || '?'})`
              foundTextures.push(textureInfo)
              
              // Проверяем, есть ли основная текстура Albedo (map) с нормальным размером
              if (name === 'map (Albedo)' && texture.image && texture.image.width > 1 && texture.image.height > 1) {
                hasAlbedoTexture = true
                console.log(`  ✅ Найдена основная текстура: ${textureInfo}`)
              } else if (name === 'map (Albedo)') {
                console.log(`  ⚠️ Найдена текстура Albedo, но она слишком маленькая или отсутствует: ${textureInfo}`)
              } else {
                console.log(`  ✅ Найдена текстура: ${textureInfo}`)
              }
            }
          })
          
          // Также проверяем цвет материала
          if (material.color) {
            const color = material.color
            const isNotGray = Math.abs(color.r - color.g) > 0.01 || Math.abs(color.g - color.b) > 0.01
            if (isNotGray) {
              console.log(`  🎨 Материал "${material.name || 'unnamed'}" имеет цвет:`, {
                r: color.r.toFixed(3),
                g: color.g.toFixed(3),
                b: color.b.toFixed(3),
                hex: `#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`
              })
            }
          }
        }
      })
      
      if (foundTextures.length > 0) {
        console.log(`📦 В GLB файле найдено ${foundTextures.length} текстур:`, foundTextures)
      } else {
        console.log('⚠️ В GLB файле НЕ найдено текстур')
      }
      
      // Если основной текстуры Albedo нет или она слишком маленькая, загружаем текстуры из папки textures/
      if (!hasAlbedoTexture) {
        console.log('⚠️ Основная текстура Albedo не найдена в GLB или слишком маленькая, загружаем из папки textures/')
        console.log('🔍 Основная текстура Albedo не найдена в GLB, загружаем из папки textures/')
        
        const loadTextures = async () => {
          try {
            console.log('📦 Начинаем загрузку текстур...')
            
            // Загружаем все текстуры
            // ВАЖНО:
            // - BaseColor_BAKED.png — запечённый результат ColorRamp(Albedo) из Blender (sRGB)
            // - Normal/Roughness/Occlusion — карты данных (Linear)
            const baseColorTexture = await loader.loadAsync('/models/textures/BaseColor_BAKED.png')
            baseColorTexture.colorSpace = SRGBColorSpace // sRGB для цветовой текстуры
            baseColorTexture.flipY = false // Blender использует другую ориентацию Y
            console.log('✅ Загружена текстура: BaseColor_BAKED.png (запечённый BaseColor)', {
              размер: `${baseColorTexture.image.width}x${baseColorTexture.image.height}`,
              путь: '/models/textures/BaseColor_BAKED.png',
              colorSpace: 'sRGB'
            })
            
            const normalTexture = await loader.loadAsync('/models/textures/Normal.png')
            // Normal map должна быть в Linear (не sRGB)
            normalTexture.flipY = false
            console.log('✅ Загружена текстура: Normal.png (карта нормалей)', {
              размер: `${normalTexture.image.width}x${normalTexture.image.height}`,
              путь: '/models/textures/Normal.png',
              colorSpace: 'Linear'
            })
            
            const roughnessTexture = await loader.loadAsync('/models/textures/Roughness.png')
            // Roughness map должна быть в Linear (не sRGB)
            roughnessTexture.flipY = false
            console.log('✅ Загружена текстура: Roughness.png (шероховатость)', {
              размер: `${roughnessTexture.image.width}x${roughnessTexture.image.height}`,
              путь: '/models/textures/Roughness.png',
              colorSpace: 'Linear'
            })
            
            const occlusionTexture = await loader.loadAsync('/models/textures/Occlusion.png')
            // Occlusion map должна быть в Linear (не sRGB)
            occlusionTexture.flipY = false
            console.log('✅ Загружена текстура: Occlusion.png (ambient occlusion)', {
              размер: `${occlusionTexture.image.width}x${occlusionTexture.image.height}`,
              путь: '/models/textures/Occlusion.png',
              colorSpace: 'Linear'
            })
            
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
              
              console.log(`🎨 Текстуры применены к материалу "${material.name || 'unnamed'}"`, {
                albedo: 'BaseColor_BAKED.png',
                normal: 'Normal.png',
                roughness: 'Roughness.png',
                occlusion: 'Occlusion.png',
                hasMap: !!material.map,
                hasNormalMap: !!material.normalMap
              })
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
            
            console.log('✨ Все текстуры успешно загружены и применены!', {
              всего_материалов: materialsCount,
              применённые_текстуры: [
                'BaseColor_BAKED.png (запечённый BaseColor)',
                'Normal.png (карта нормалей)',
                'Roughness.png (шероховатость)',
                'Occlusion.png (ambient occlusion)'
              ]
            })
            
            // Принудительно обновляем рендерер
            gl.state.reset()
            
            // Проверяем, что текстуры действительно применены
            scene.traverse((child) => {
              if (child instanceof Mesh) {
                const material = Array.isArray(child.material) 
                  ? child.material[0] 
                  : child.material
                
                if (material instanceof MeshStandardMaterial) {
                  console.log(`✅ Проверка материала "${material.name || 'unnamed'}":`, {
                    hasMap: !!material.map,
                    mapSize: material.map ? `${material.map.image.width}x${material.map.image.height}` : 'нет',
                    hasNormalMap: !!material.normalMap,
                    hasRoughnessMap: !!material.roughnessMap,
                    hasAoMap: !!material.aoMap
                  })
                }
              }
            })
          } catch (error) {
            console.error('❌ Ошибка загрузки текстур:', error)
          }
        }
        
        loadTextures()
      } else {
        // Если текстуры есть в GLB, просто настраиваем colorSpace
        console.log('🔍 Текстуры найдены в GLB, настраиваем colorSpace')
        
        scene.traverse((child) => {
          if (child instanceof Mesh && child.material) {
            const material = child.material as MeshStandardMaterial
            
            const appliedTextures: string[] = []
            
            // Настраиваем правильный colorSpace для текстур
            if (material.map) {
              material.map.colorSpace = SRGBColorSpace
              appliedTextures.push(`map: ${material.map.image?.src || 'встроенная'}`)
            }
            if (material.normalMap) {
              material.normalMap.colorSpace = SRGBColorSpace
              appliedTextures.push(`normalMap: ${material.normalMap.image?.src || 'встроенная'}`)
            }
            if (material.roughnessMap) {
              material.roughnessMap.colorSpace = SRGBColorSpace
              appliedTextures.push(`roughnessMap: ${material.roughnessMap.image?.src || 'встроенная'}`)
            }
            if (material.aoMap) {
              material.aoMap.colorSpace = SRGBColorSpace
              appliedTextures.push(`aoMap: ${material.aoMap.image?.src || 'встроенная'}`)
            }
            
            material.needsUpdate = true
            
            if (appliedTextures.length > 0) {
              console.log(`🎨 Материал "${material.name || 'unnamed'}" имеет текстуры из GLB:`, appliedTextures)
            }
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
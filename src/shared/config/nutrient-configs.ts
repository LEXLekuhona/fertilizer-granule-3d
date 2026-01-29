import { NutrientConfig } from './styles'

/**
 * Конфигурации позиций и размеров для всех элементов питания
 * 
 * КАК ИСПОЛЬЗОВАТЬ:
 * - Для изменения позиции элемента: измените значения top/left/right
 * - Для изменения размера: измените width/height
 * - Для скрытия линии: закомментируйте или удалите свойство line
 * - Для поворота линии: измените transform (например, 'rotate(-180deg)')
 * 
 * ВАЖНО: Все значения позиций должны совпадать с дизайном из Figma.
 * Координаты указаны в пикселях относительно родительского контейнера.
 * 
 * СТРУКТУРА КАЖДОГО ЭЛЕМЕНТА:
 * - label: позиция и размер надписи (название + формула)
 * - line: позиция и размер SVG линии (соединяет надпись с моделью)
 * - description: позиция и размер текстового описания (появляется при hover)
 * - formula: позиция и размер SVG формулы на 3D модели (появляется при hover)
 */
export const NUTRIENT_CONFIGS: Record<string, NutrientConfig> = {
	// Расположение элементов
  nitrogen: {
    label: {
      position: { top: '17px', left: '15px' },
      width: '118.00000019800332px',
      height: '18.000000030203896px',
    },
		// Линия под надписью
    line: {
      top: '47px',
      left: '3px',
      width: '560px',
      height: '103px',
    },
		// Описание под линией
    description: {
      top: '63px',
      left: '15px',
      width: '320px',
      height: '50px',
    },
		// Формула на 3Д молекуле
    formula: {
      top: '117.96px',
      left: '521.75px',
      width: '164px',
      height: '109px',
    },
  },
  magnesium: {
    label: {
      position: { top: '34px', right: '134px' },
      width: '166.00000027854705px',
      height: '15.000000025169912px',
    },
    line: {
      top: '36px',
      right: '110px',
      width: '445px',
      height: '115px',
      transform: 'rotate(0deg)',
    },
    description: {
      top: '69px',
      right: '105px',
      width: '293px',
      height: '50px',
    },
    formula: {
      top: '95px',
      left: '660px',
      width: '98px',
      height: '100px',
    },
  },
  phosphorus: {
    label: {
      position: { top: '302px', left: '150px' },
      width: '168.00000028190303px',
      height: '15.000000025169912px',
    },
    // line: {
    //   top: '329px',
    //   left: '138px',
    //   width: '383.5px',
    //   height: '6px',
    // },
    description: {
      top: '344.96px',
      left: '149.75px',
      width: '297px',
      height: '50px',
    },
    formula: {
      top: '278.96px',
      left: '507.75px',
      width: '98px',
      height: '100px',
    },
  },
  potassium: {
    label: {
      position: { top: '433px', left: '60px' },
      width: '139.0000002332412px',
      height: '15.000000025169912px',
    },
    line: {
      top: '329px',
      left: '38px',
      width: '588.5px',
      height: '131.5px',
    },
    description: {
      top: '476.96px',
      left: '49.75px',
      width: '289px',
      height: '30px',
    },
    formula: {
      top: '328.96px',
      left: '601.75px',
      width: '98px',
      height: '100px',
    },
  },
  calcium: {
    label: {
      position: { top: '400px', left: '990px' },
      width: '153.0000002567331px',
      height: '15.000000025169912px',
    },
    line: {
      top: '358px',
      left: '746px',
      width: '448.5px',
      height: '76.5px',
      transform: 'rotate(0deg)',
    },
    description: {
      top: '451.96px',
      left: '920.75px',
      width: '289px',
      height: '50px',
    },
    formula: {
      top: '298px',
      left: '679px',
      width: '98px',
      height: '100px',
    },
  },
  sulfur: {
    label: {
      position: { top: '242px', left: '1151px' },
      width: '126.00000021142726px',
      height: '15.000000025169912px',
    },
    line: {
      top: '269px',
      left: '836px',
      width: '453.5px',
      height: '6px',
    },
    description: {
      top: '284.96px',
      left: '1000.75px',
      width: '289px',
      height: '50px',
    },
    formula: {
      top: '197.96px',
      left: '755.75px',
      width: '98px',
      height: '100px',
    },
  },
}

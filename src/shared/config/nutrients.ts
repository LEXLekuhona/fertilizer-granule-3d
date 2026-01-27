export interface Nutrient {
  id: string
  name: string
  formula: string
  description: string
  position: {
    angle: number // угол в градусах для позиционирования
    x: number
    y: number
  }
}

export const NUTRIENTS: Nutrient[] = [
  {
    id: 'nitrogen',
    name: 'Азот',
    formula: 'N',
    description: 'Ускоряет рост растений, повышает содержание белка, урожайность, а также уровень хлорофилла и аминокислот',
    position: { angle: -180, x: -1, y: 0 } // слева, сверху
  },
  {
    id: 'phosphorus',
    name: 'Фосфор',
    formula: 'P₂O₅',
    description: 'Необходим для деления клеток, формирования корневой системы, цветения и созревания плодов',
    position: { angle: -135, x: -0.7, y: -0.7 } // слева, посередине
  },
  {
    id: 'potassium',
    name: 'Калий',
    formula: 'K₂O',
    description: 'Повышает устойчивость растений к засухе, болезням и стрессам',
    position: { angle: -180, x: 0, y: -1 } // слева, снизу
  },
  {
    id: 'magnesium',
    name: 'Магний',
    formula: 'MgO',
    description: 'Основа хлорофилла и двигатель фотосинтеза, который повышает урожай, качество плодов и устойчивость растений',
    position: { angle: 90, x: 1, y: 0 } // справа, сверху
  },
  {
    id: 'sulfur',
    name: 'Сера',
    formula: 'SO₃',
    description: 'Усиливает устойчивость растений к болезням и стрессам, а также повышает качество и питательную ценность урожая',
    position: { angle: 135, x: 0.7, y: -0.7 } // справа, посередине
  },
  {
    id: 'calcium',
    name: 'Кальций',
    formula: 'Ca',
    description: 'Обеспечивающий устойчивость растений к болезням, стрессам и улучшающий качество плодов',
    position: { angle: 45, x: 0.7, y: 0.7 } // справа, снизу
  }
]

// Настройка поворота при ховере (в градусах)
export const HOVER_ROTATION_ANGLE = 5
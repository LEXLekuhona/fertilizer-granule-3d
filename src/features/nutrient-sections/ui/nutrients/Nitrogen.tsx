import React from 'react'
import { Nutrient } from '@/shared/config/nutrients'
import { STYLES, NutrientConfig } from '@/shared/config/styles'
import { NutrientBase } from './NutrientBase'

interface NitrogenProps {
  nutrient: Nutrient
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const config: NutrientConfig = {
  label: {
    position: { top: '17px', left: '15px' },
    width: '118.00000019800332px',
    height: '18.000000030203896px',
  },
  line: {
    top: '47px',
    left: '3px',
    width: '560px',
    height: '103px',
  },
  description: {
    top: '63px',
    left: '15px',
    width: '320px',
    height: '50px',
  },
  formula: {
    top: '117.96px',
    left: '521.75px',
    width: '164px',
    height: '109px',
  },
}

export const Nitrogen = React.memo(({ nutrient, isHovered, onMouseEnter, onMouseLeave }: NitrogenProps) => {
  return (
    <>
      {/* Линия SVG */}
      <svg
        style={{
          position: 'absolute',
          ...config.line,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1
        }}
        viewBox="0 0 560 103"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M554 99.667C554 98.1942 555.194 97.0003 556.667 97.0003C558.14 97.0003 559.334 98.1942 559.334 99.667C559.334 101.14 558.14 102.334 556.667 102.334C555.194 102.334 554 101.14 554 99.667ZM423.167 2.66699V2.16699H423.329L423.461 2.2625L423.167 2.66699ZM0.000325441 2.66699C0.000325441 1.19423 1.19423 0.000328064 2.66699 0.000328064C4.13975 0.000328064 5.33366 1.19423 5.33366 2.66699C5.33366 4.13976 4.13975 5.33366 2.66699 5.33366C1.19423 5.33366 0.000325441 4.13976 0.000325441 2.66699ZM556.667 99.667L556.373 100.071L422.873 3.07149L423.167 2.66699L423.461 2.2625L556.961 99.2625L556.667 99.667ZM423.167 2.66699V3.16699H2.66699V2.66699V2.16699H423.167V2.66699Z" 
          fill="#2F2F2F"
          stroke={STYLES.colors.stroke}
          strokeWidth="1"
        />
      </svg>

      {/* Надпись */}
      <NutrientBase
        nutrient={nutrient}
        isHovered={isHovered}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        labelPosition={{ left: config.label.position.left, top: config.label.position.top, transform: 'translate(0, 0)' }}
        isLeft={true}
        labelWidth={config.label.width}
        labelHeight={config.label.height}
      />
    </>
  )
})

Nitrogen.displayName = 'Nitrogen'

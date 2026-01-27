import { Nutrient } from '@/shared/config/nutrients'

interface NutrientSectionsProps {
  nutrients: Nutrient[]
  onNutrientHover: (nutrientId: string | null) => void
  hoveredNutrient: string | null
}

export const NutrientSections = ({ 
  nutrients, 
  onNutrientHover, 
  hoveredNutrient 
}: NutrientSectionsProps) => {
  const centerX = 50
  const centerY = 50
  const radius = 42 // процент от размера контейнера для позиции надписи

  return (
    <div 
      className="position-absolute"
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >


      {/* Линия в SVG для Азота */}
      <svg
        style={{
          position: 'absolute',
          top: '47px',
          left: '3px',
          width: '560px',
          height: '103px',
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
          stroke="rgba(47, 47, 47, 1)"
          strokeWidth="1"
        />
      </svg>

      {/* Линия в SVG для Магния */}
      <svg
        style={{
          position: 'absolute',
          top: '36px',
          right: '110px',
          width: '445px',
          height: '115px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 433 63"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M5.33365 59.667C5.33365 58.1942 4.13974 57.0003 2.66699 57.0003C1.19424 57.0003 0.000335693 58.1942 0.000335693 59.667C0.000335693 61.1398 1.19424 62.3337 2.66699 62.3337C4.13974 62.3337 5.33365 61.1398 5.33365 59.667ZM136.167 2.66699V2.16699H136.065L135.971 2.20715L136.167 2.66699ZM432.334 2.66699C432.334 1.19423 431.14 0.000324249 429.667 0.000324249C428.194 0.000324249 427 1.19423 427 2.66699C427 4.13975 428.194 5.33366 429.667 5.33366C431.14 5.33366 432.334 4.13975 432.334 2.66699ZM2.66699 59.667L2.86334 60.1268L136.363 3.12683L136.167 2.66699L135.971 2.20715L2.47064 59.2072L2.66699 59.667ZM136.167 2.66699V3.16699H429.667V2.66699V2.16699H136.167V2.66699Z" 
          fill="#2F2F2F"
          stroke="rgba(47, 47, 47, 1)"
          strokeWidth="1"
        />
      </svg>



      {/* Линия в SVG для Калия */}
      <svg
        style={{
          position: 'absolute',
          top: '329px',
          left: '38px',
          width: '588.5px',
          height: '131.5px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 594 137"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M588.5 79.667C588.5 78.1942 589.694 77.0003 591.167 77.0003C592.64 77.0003 593.834 78.1942 593.834 79.667C593.834 81.1398 592.64 82.3337 591.167 82.3337C589.694 82.3337 588.5 81.1398 588.5 79.667ZM506.167 134.167L506.437 134.588L506.314 134.667H506.167V134.167ZM0.000325441 134.167C0.000325441 132.694 1.19423 131.5 2.66699 131.5C4.13975 131.5 5.33366 132.694 5.33366 134.167C5.33366 135.64 4.13975 136.834 2.66699 136.834C1.19423 136.834 0.000325441 135.64 0.000325441 134.167ZM483.5 2.66699C483.5 1.19423 484.694 0.000320435 486.167 0.000320435C487.64 0.000320435 488.834 1.19423 488.834 2.66699C488.834 4.13976 487.64 5.33366 486.167 5.33366C484.694 5.33366 483.5 4.13976 483.5 2.66699ZM100 2.66699C100 1.19423 101.194 0.000320435 102.667 0.000320435C104.14 0.000320435 105.334 1.19423 105.334 2.66699C105.334 4.13976 104.14 5.33366 102.667 5.33366C101.194 5.33366 100 4.13976 100 2.66699ZM591.167 79.667L591.437 80.0879L506.437 134.588L506.167 134.167L505.897 133.746L590.897 79.2461L591.167 79.667ZM506.167 134.167V134.667H2.66699V134.167V133.667H506.167V134.167ZM486.167 2.66699V3.16699H102.667V2.66699V2.16699H486.167V2.66699Z" 
          fill="#2F2F2F"
          stroke="rgba(47, 47, 47, 1)"
          strokeWidth="1"
        />
      </svg>

      {/* Линия в SVG для Кальция */}
      <svg
        style={{
          position: 'absolute',
          top: '358px',
          left: '759px',
          width: '410px',
          height: '76.5px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 454 82"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M5.33365 2.66699C5.33365 1.19423 4.13974 0.000328064 2.66699 0.000328064C1.19424 0.000328064 0.000335693 1.19423 0.000335693 2.66699C0.000335693 4.13976 1.19424 5.33366 2.66699 5.33366C4.13974 5.33366 5.33365 4.13976 5.33365 2.66699ZM137.667 79.167L137.42 79.602L137.535 79.667H137.667V79.167ZM453.834 79.167C453.834 77.6942 452.64 76.5003 451.167 76.5003C449.694 76.5003 448.5 77.6942 448.5 79.167C448.5 80.6398 449.694 81.8337 451.167 81.8337C452.64 81.8337 453.834 80.6398 453.834 79.167ZM2.66699 2.66699L2.42047 3.10201L137.42 79.602L137.667 79.167L137.914 78.732L2.91351 2.23198L2.66699 2.66699ZM137.667 79.167V79.667H451.167V79.167V78.667H137.667V79.167Z" 
          fill="#2F2F2F"
          stroke="rgba(47, 47, 47, 1)"
          strokeWidth="1"
        />
      </svg>

      {/* Линия в SVG для Серы */}
      <svg
        style={{
          position: 'absolute',
          top: '269px',
          left: '836px',
          width: '453.5px',
          height: '6px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 459 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M453.5 2.66699C453.5 1.19423 454.694 0.000325441 456.167 0.000325441C457.64 0.000325441 458.834 1.19423 458.834 2.66699C458.834 4.13975 457.64 5.33366 456.167 5.33366C454.694 5.33366 453.5 4.13975 453.5 2.66699ZM0.000325441 2.66699C0.000325441 1.19423 1.19423 0.000325441 2.66699 0.000325441C4.13975 0.000325441 5.33366 1.19423 5.33366 2.66699C5.33366 4.13975 4.13975 5.33366 2.66699 5.33366C1.19423 5.33366 0.000325441 4.13975 0.000325441 2.66699ZM456.167 2.66699V3.16699H2.66699V2.66699V2.16699H456.167V2.66699Z" 
          fill="#2F2F2F"
          stroke="rgba(47, 47, 47, 1)"
          strokeWidth="1"
        />
      </svg>

      {/* маркер для линии фосфор */}
      <svg
        style={{
          position: 'absolute',
          top: '324px',
          left: '506px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер Магний */}
      <svg
        style={{
          position: 'absolute',
          top: '114px',
          left: '729px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер Сера */}
      <svg
        style={{
          position: 'absolute',
          top: '263px',
          left: '830px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер кальций */}
      <svg
        style={{
          position: 'absolute',
          top: '352px',
          left: '753px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {/* Маркер калий */}
      <svg
        style={{
          position: 'absolute',
          top: '397px',
          left: '607px',
          width: '16px',
          height: '16px',
          pointerEvents: 'none',
          zIndex: 2,
          opacity: 1,
          transform: 'rotate(0deg)'
        }}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.3"/>
      </svg>

      {nutrients.map((nutrient) => {
        const isHovered = hoveredNutrient === nutrient.id
        
        // Специальная обработка для Азота - используем абсолютные координаты
        let positionStyle: React.CSSProperties
        let isLeft: boolean
        
        if (nutrient.id === 'nitrogen') {
          // Азот позиционируется по указанным координатам
          positionStyle = {
            left: '15px',
            top: '17px',
            transform: 'translate(0, 0)',
          }
          isLeft = true
        } else if (nutrient.id === 'magnesium') {
          // Магний позиционируется по указанным координатам
          positionStyle = {
            right: '134px',
            top: '34px',
            transform: 'translate(0, 0)',
          }
          isLeft = false
        } else if (nutrient.id === 'phosphorus') {
          // Фосфор позиционируется по указанным координатам
          positionStyle = {
            left: '150px',
            top: '302px',
            transform: 'translate(0, 0)',
          }
          isLeft = true
        } else if (nutrient.id === 'potassium') {
          // Калий позиционируется по указанным координатам
          positionStyle = {
            left: '60px',
            top: '433px',
            transform: 'translate(0, 0)',
          }
          isLeft = true
        } else if (nutrient.id === 'calcium') {
          // Кальций позиционируется по указанным координатам
          positionStyle = {
            left: '990px',
            top: '400px',
            transform: 'translate(0, 0)',
          }
          isLeft = false
        } else if (nutrient.id === 'sulfur') {
          // Сера позиционируется по указанным координатам
          positionStyle = {
            left: '1151px',
            top: '242px',
            transform: 'translate(0, 0)',
          }
          isLeft = false
        } else {
          // Для остальных используем угловое позиционирование
          const angleRad = (nutrient.position.angle * Math.PI) / 180
          const x = centerX + radius * Math.cos(angleRad)
          const y = centerY + radius * Math.sin(angleRad)
          positionStyle = {
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }
          isLeft = x < centerX
        }
        
        return (
          <div
            key={nutrient.id}
            className="position-absolute"
            style={{
              ...positionStyle,
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: isHovered ? 30 : 25
            }}
            onMouseEnter={() => onNutrientHover(nutrient.id)}
            onMouseLeave={() => onNutrientHover(null)}
          >
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Надпись (заголовок) в стиле изображения */}
              <div
                className="nutrient-label"
                style={{
                  whiteSpace: 'nowrap',
                  width: nutrient.id === 'magnesium' ? '166.00000027854705px' : 
                         nutrient.id === 'phosphorus' ? '168.00000028190303px' : 
                         nutrient.id === 'potassium' ? '139.0000002332412px' :
                         nutrient.id === 'calcium' ? '153.0000002567331px' :
                         nutrient.id === 'sulfur' ? '126.00000021142726px' :
                         '118.00000019800332px',
                  height: nutrient.id === 'magnesium' || nutrient.id === 'phosphorus' || nutrient.id === 'potassium' || nutrient.id === 'calcium' || nutrient.id === 'sulfur' ? '15.000000025169912px' : '18.000000030203896px',
                  color: '#000',
                  opacity: 1,
                  transform: 'rotate(0deg)',
                  transition: 'all 0.3s ease',
                  textAlign: isLeft ? 'right' : 'left',
                  padding: '0',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isLeft ? (
                  <>/ {nutrient.name} <span style={{ color: 'rgba(138, 138, 138, 1)' }}>({nutrient.formula})</span></>
                ) : (
                  <>{nutrient.name} <span style={{ color: 'rgba(138, 138, 138, 1)' }}>({nutrient.formula})</span> /</>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
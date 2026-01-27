# Public Assets

Поместите ваши 3D модели (GLB/GLTF файлы) в эту папку.

Например:
- `/public/models/granule.glb`
- `/public/models/granule.gltf`

Затем используйте компонент `Granule3DWithModel` вместо `Granule3D` в `FertilizerGranule.tsx`:

```tsx
import { Granule3DWithModel } from '@/entities/granule-3d/ui/Granule3DWithModel'

// В компоненте:
<Granule3DWithModel 
  hoverRotation={hoveredNutrient ? (HOVER_ROTATION_ANGLE * Math.PI) / 180 : 0}
  modelPath="/models/granule.glb"
/>
```
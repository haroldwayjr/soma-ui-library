import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Canvas below `AppHeader`. Background is a surface role, not a color name,
// so light "white/gray" and dark theme stay the same two variants.
// No `defaultVariants`: both axes are required on the component. A recipe
// default would be a second source of truth that disagrees with the types.
export const appContentRecipe = recipe({
  base: {
    flexGrow: 1,
    inlineSize: '100%',
    minBlockSize: 0,
    minInlineSize: 0,
  },
  variants: {
    background: {
      default: { background: semantics.color.surface.default },
      subtle: { background: semantics.color.surface.subtle },
    },
    padding: {
      md: { padding: semantics.space[24] },
      none: { padding: semantics.space[0] },
      sm: { padding: semantics.space[20] },
    },
  },
})

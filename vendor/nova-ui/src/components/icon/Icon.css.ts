import { globalStyle, style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Both dimensions, every size: an `<svg>` with a `viewBox` and no size falls back to
// the CSS default 300×150, and a sized parent does not constrain it.
const box = (
  size: keyof typeof semantics.size.icon,
): { blockSize: string; inlineSize: string } => ({
  blockSize: semantics.size.icon[size],
  inlineSize: semantics.size.icon[size],
})

// `block` so it does not sit on the text baseline; `flex: none` so a flex parent
// cannot stretch it.
const rootStyle = style({ display: 'block', flex: 'none' })

// Figma hardcodes `#101828`, so CSS recolors wholesale rather than each glyph being
// hand-edited. `[…="none"]` is skipped so an outline glyph stays unfilled.
//
// `vector-effect` pins the stroke at 1.5px: Soma draws every size at that weight, so
// it must not scale with the box. A per-size `stroke-width` cannot do it, because
// under `rem` sizing the rendered px is unknown at author time.
globalStyle(`${rootStyle} [fill]:not([fill="none"])`, { fill: 'currentColor' })

globalStyle(`${rootStyle} [stroke]:not([stroke="none"])`, {
  stroke: 'currentColor',
  vectorEffect: 'non-scaling-stroke',
})

export const iconRecipe = recipe({
  base: rootStyle,
  variants: {
    size: {
      lg: box('lg'),
      md: box('md'),
      sm: box('sm'),
      xs: box('xs'),
    },
  },
})

export type IconSize = NonNullable<
  NonNullable<RecipeVariants<typeof iconRecipe>>['size']
>

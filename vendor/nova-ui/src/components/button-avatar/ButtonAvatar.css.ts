import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// A circle, matching Avatar's own `rootRecipe` shape rather than
// `semantics.radius.control` — there is no radius role for this, only the
// shape it wraps.
const CIRCLE_RADIUS = '50%'

// Explicit per-size dimensions, not `padding` — a native `<button>` still
// carries UA font/line-height even with `appearance: none`, so an
// auto-sized box (padding plus content) is liable to come out taller than
// wide once that strut is included, which turns `border-radius: 50%` into
// an ellipse and drags the focus ring off Avatar's circle with it. Setting
// `blockSize` / `inlineSize` to Avatar's own diameter keeps the trigger
// the same size as a plain Avatar at that `size`.
function dimensions(avatarDiameter: string): {
  blockSize: string
  inlineSize: string
} {
  return { blockSize: avatarDiameter, inlineSize: avatarDiameter }
}

const baseStyle = style({
  ':disabled': {
    cursor: 'not-allowed',
  },
  alignItems: 'center',
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  borderRadius: CIRCLE_RADIUS,
  cursor: 'pointer',
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  margin: 0,
  padding: 0,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${semantics.color.focus.ring.base}`,
      outlineOffset: '2px',
    },
  },
})

export const triggerRecipe = recipe({
  base: baseStyle,
  variants: {
    size: {
      lg: dimensions(semantics.size.avatar.lg),
      md: dimensions(semantics.size.avatar.md),
      sm: dimensions(semantics.size.avatar.sm),
    },
  },
})

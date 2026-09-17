import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

// Sticker-sheet `Tooltip.Arrow`: 10×6 on the top/bottom track, 6×10 on the
// side track. The 6px side is the protrusion toward the trigger.
const ARROW_HEIGHT_PX = 6
const ARROW_WIDTH_PX = 10

// Measured on the arrow-positions frame: 8px from the arrow tip to the trigger
// (popup instance bottom at y=40, trigger top at y=48). Base UI's `sideOffset`
// is the popup box, not the tip, so the 6px protrusion is added here. `space[8]`
// is a `rem` string and cannot bind this number. See the README.
const TRIGGER_GAP_PX = 8

export const SIDE_OFFSET_PX = ARROW_HEIGHT_PX + TRIGGER_GAP_PX

// The arrow's attached edge is flush against the popup at an exact integer
// offset (`-ARROW_HEIGHT_PX`), but the two are independently positioned —
// the popup by the Positioner's own transform, the arrow by floating-ui's
// `top`/`left` — and each can round to the nearest device pixel on its own.
// At 1x device pixel ratio that rounding is coarse enough to leave a hairline
// gap between them on some sides. Overlapping the attached edge by 1px absorbs
// that rounding into same-colored fill instead of a visible seam; the tip
// still protrudes `ARROW_HEIGHT_PX - 1`px, which reads the same at any DPI.
const ARROW_OVERLAP_PX = 1
const ARROW_ATTACHED_OFFSET_PX = -(ARROW_HEIGHT_PX - ARROW_OVERLAP_PX)

export const popupStyle = style({
  background: semantics.color.surface.inverse,
  borderRadius: semantics.radius.tooltip,
  boxShadow: semantics.elevation.sm,
  boxSizing: 'border-box',
  color: semantics.color.text.inverse,
  display: 'flex',
  flexDirection: 'column',
  inlineSize: 'max-content',
  maxInlineSize: `min(20rem, var(--available-width))`,
  overflow: 'visible',
  overflowWrap: 'anywhere',
  // Simple shape: 8px block / 12px inline, matching the 97×34 master.
  paddingBlock: semantics.space[8],
  paddingInline: semantics.space[12],
  // Containing block for the absolutely positioned arrow. Without this the
  // arrow's `top`/`bottom` resolve against the Positioner, which is the same
  // box today but is not the contract.
  position: 'relative',
})

// Rich masters are 12px on every side with 4px between heading and body.
export const richPopupStyle = style({
  gap: semantics.space[4],
  paddingBlock: semantics.space[12],
  paddingInline: semantics.space[12],
})

// The Simple shape's only line — plain body copy in the popup's default
// `text.inverse` color, so this class carries typography only.
export const bodyStyle = style(semantics.text.body2)

// Numerically identical to `semantics.text.h6` (12/16, weight 600) but not
// bound to that role: a tooltip heading and a document heading have no reason
// to move together. Promote to a named role once a second consumer asks.
export const headingStyle = style({
  fontSize: '0.75rem',
  fontWeight: '600',
  // Same ceil-up ratio as `textStyle(12, 16, …)` in `semantic.css.ts` (ADR 0003).
  lineHeight: '1.33334',
})

// The Rich shape's description sits one step dimmer than the heading — this is
// `text.secondary.onInverse`'s first consumer, added to `colors.ts` alongside
// this component. See the README's Semantic tokens section.
export const richBodyStyle = style([
  bodyStyle,
  { color: semantics.color.text.secondary.onInverse },
])

// Base UI's arrow middleware only writes `left` *or* `top` (the axis along the
// edge). The offset onto the trigger-facing edge is ours, keyed off `data-side`.
// `position: absolute` is also ours so the arrow cannot become a flex row if
// those inline styles have not landed yet.
export const arrowStyle = style({
  background: semantics.color.surface.inverse,
  flexShrink: 0,
  position: 'absolute',
  selectors: {
    '&[data-side="bottom"]': {
      blockSize: ARROW_HEIGHT_PX,
      clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
      inlineSize: ARROW_WIDTH_PX,
      top: ARROW_ATTACHED_OFFSET_PX,
    },
    '&[data-side="left"]': {
      blockSize: ARROW_WIDTH_PX,
      clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
      inlineSize: ARROW_HEIGHT_PX,
      right: ARROW_ATTACHED_OFFSET_PX,
    },
    '&[data-side="right"]': {
      blockSize: ARROW_WIDTH_PX,
      clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
      inlineSize: ARROW_HEIGHT_PX,
      left: ARROW_ATTACHED_OFFSET_PX,
    },
    '&[data-side="top"]': {
      blockSize: ARROW_HEIGHT_PX,
      bottom: ARROW_ATTACHED_OFFSET_PX,
      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
      inlineSize: ARROW_WIDTH_PX,
    },
  },
})

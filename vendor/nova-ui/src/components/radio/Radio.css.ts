import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

const CIRCLE_SIZE = '16px'
const DOT_SIZE = '8px'
const TARGET_SIZE = semantics.space[24]
// Promote to a semantic width role when a third control confirms the measure.
const STROKE = '1.5px'
const FOCUS_RING = '2px'

const enabled = '&:not([data-disabled])'
// The master has no focus+hover cell, so a keyboard-focused control under the
// pointer must not paint hover — a combination the design never specifies.
const hovered = `${enabled}:not(:focus-visible):hover`

// The root owns the 24×24 interactive target. A negative margin preserves the
// 16×16 layout footprint, while `::before` paints the visual radio circle.
//
// `color` carries the dot, which is why the dot itself needs no state rules: the
// checked stroke and the dot move together, and `currentColor` follows.
export const rootStyle = style({
  alignItems: 'center',
  blockSize: TARGET_SIZE,
  color: semantics.color.icon.brand,
  cursor: 'pointer',
  display: 'inline-flex',
  // A fixed-size control must not be squashed by a tight flex row, or the target
  // drops below the WCAG 2.5.8 minimum.
  flexShrink: 0,
  inlineSize: TARGET_SIZE,
  justifyContent: 'center',
  margin: `calc(${semantics.space[4]} * -1)`,
  position: 'relative',
  selectors: {
    // The ring belongs to the target boundary, not the visual circle.
    '&::after': {
      borderRadius: semantics.radius.radio,
      content: '""',
      inset: 0,
      position: 'absolute',
    },
    '&::before': {
      background: 'transparent',
      blockSize: CIRCLE_SIZE,
      borderColor: semantics.color.border.strong.base,
      borderRadius: semantics.radius.radio,
      borderStyle: 'solid',
      borderWidth: STROKE,
      content: '""',
      inlineSize: CIRCLE_SIZE,
      position: 'absolute',
    },
    // An inset shadow, not an outline: at `outline-offset: 0` the ring's inner
    // edge sits on the target boundary and grows outward, and at `-2px` it sits
    // flush against the circle. Only an inset shadow leaves a 2px gap.
    '&:focus-visible': {
      // The ring below replaces the user-agent one. Without this the browser
      // paints its own outline on the 16×16 circle as well, so keyboard focus
      // shows two rings.
      outline: 'none',
    },
    '&:focus-visible::after': {
      boxShadow: `inset 0 0 0 ${FOCUS_RING} ${semantics.color.focus.ring.base}`,
    },
    // Disabled is the only state with a fill. Checked deliberately has none — it
    // is a stroked ring plus a dot, unlike Checkbox's filled box.
    '&[data-disabled]': {
      color: semantics.color.icon.disabled,
      cursor: 'default',
    },
    '&[data-disabled]::before': {
      background: semantics.color.surface.disabled,
      borderColor: semantics.color.border.disabled,
    },
    // `enabled` is load-bearing: without it this rule and the disabled one tie on
    // specificity, so a disabled checked control would paint whichever sorts last
    // — and `perfectionist/sort-modules` decides that order, not us. Radio.spec
    // asserts the guard.
    [`${enabled}[data-checked]::before`]: {
      borderColor: semantics.color.icon.brand,
    },
    [`${hovered}::before`]: {
      borderColor: semantics.color.border.strong.hover,
    },
    [`${hovered}[data-checked]::before`]: {
      // Borrowed from the action family: the icon family publishes no hover step.
      // Both stroke and dot move, via `color`. See the README's token gaps.
      borderColor: 'currentColor',
    },
    [`${hovered}[data-checked]`]: {
      // The dot is an in-flow child, so the hover color must live on the root
      // where both it and the visual circle can inherit it.
      color: semantics.color.action.primary.hover,
    },
  },
})

// Base UI mounts the indicator only while checked. Positioning keeps it in the
// same paint-order phase as the pseudo-elements: `::before` paints first, then
// the dot, then the transparent `::after` ring.
export const dotStyle = style({
  background: 'currentColor',
  blockSize: DOT_SIZE,
  borderRadius: semantics.radius.radio,
  inlineSize: DOT_SIZE,
  position: 'relative',
})

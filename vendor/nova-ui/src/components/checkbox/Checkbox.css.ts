import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

const BOX_SIZE = '16px'
const TARGET_SIZE = semantics.space[24]
// Promote to a semantic width role when a second control confirms the measure.
const STROKE = '1.5px'
const FOCUS_RING = '2px'

const enabled = '&:not([data-disabled])'
// The state matrix has no focus+hover cell, and its prose says focus-visible uses
// the *rest* box plus the ring. Without this a keyboard-focused box under the
// pointer paints hover, which is a combination the design never specifies.
const hovered = `${enabled}:not(:focus-visible):hover`

// The root owns the 24×24 interactive target. A negative margin preserves the
// 16×16 layout footprint, while `::before` paints the visual selection box.
export const rootStyle = style({
  alignItems: 'center',
  blockSize: TARGET_SIZE,
  color: semantics.color.icon.onBrand.base,
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
    // The ring belongs to the target boundary, not the visual box.
    '&::after': {
      borderRadius: semantics.radius.checkboxFocusRing,
      content: '""',
      inset: 0,
      position: 'absolute',
    },
    // The interactive root is 24×24. Negative margins preserve the 16×16 layout
    // footprint, while this pseudo-element keeps the visual box at 16×16.
    '&::before': {
      background: 'transparent',
      blockSize: BOX_SIZE,
      borderColor: semantics.color.border.strong.base,
      borderRadius: semantics.radius.checkbox,
      borderStyle: 'solid',
      borderWidth: STROKE,
      content: '""',
      inlineSize: BOX_SIZE,
      position: 'absolute',
    },
    // An inset shadow, not an outline. `outline-offset: 0` puts the ring's inner
    // edge on the target boundary and grows outward; `-2px` puts its inner edge
    // flush against the box, leaving no gap at all. Only an inset shadow gives
    // the 2px gap the design asks for — which is what makes the 6px ring radius
    // (box radius plus that gap) correct rather than decorative.
    '&:focus-visible': {
      // The ring below replaces the user-agent one. Without this the browser
      // paints its own outline on the 16×16 box as well, so keyboard focus shows
      // two rings.
      outline: 'none',
    },
    '&:focus-visible::after': {
      boxShadow: `inset 0 0 0 ${FOCUS_RING} ${semantics.color.focus.ring.base}`,
    },
    '&[data-disabled]': {
      color: semantics.color.icon.disabled,
      cursor: 'default',
    },
    '&[data-disabled]::before': {
      background: semantics.color.surface.disabled,
      borderColor: semantics.color.border.disabled,
    },
    // `enabled` is load-bearing, not decorative: without it this rule and the
    // disabled one tie on specificity, so a disabled checked box would paint
    // whichever sorts last — and `perfectionist/sort-modules` decides that order,
    // not us. Checkbox.spec.tsx asserts the guard.
    [`${enabled}[data-checked]::before, ${enabled}[data-indeterminate]::before`]:
      {
        background: semantics.color.icon.brand,
        borderColor: semantics.color.icon.brand,
      },
    [`${hovered}::before`]: {
      borderColor: semantics.color.border.strong.hover,
    },
    [`${hovered}[data-checked]::before, ${hovered}[data-indeterminate]::before`]:
      {
        // Borrowed from the action family: the icon family publishes no hover
        // step. See the README's token gaps.
        background: semantics.color.action.primary.hover,
        borderColor: semantics.color.action.primary.hover,
      },
  },
})

// Base UI mounts the indicator only while checked or indeterminate. Positioning
// keeps it in the same paint-order phase as the pseudo-elements: `::before`
// paints first, then the indicator, then the transparent `::after` ring.
export const indicatorStyle = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
})

// 8×2 bar centered in the box, matching the Soma master. Fully rounded ends: at
// 2px tall the pill radius resolves to a 1px cap.
export const dashStyle = style({
  background: 'currentColor',
  blockSize: '2px',
  borderRadius: semantics.radius.control,
  inlineSize: '8px',
})

// `xs` selects the shared 16×16 check drawing; Checkbox constrains its visual
// slot to the 10px measure from the master.
export const checkStyle = style({
  blockSize: '10px',
  inlineSize: '10px',
})

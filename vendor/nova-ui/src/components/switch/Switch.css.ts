import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

const TRACK_INLINE = '44px'
const TRACK_BLOCK = '24px'
const THUMB_SIZE = '20px'
// Promote to a semantic width role when a third control confirms the measure.
const STROKE = '1px'
const FOCUS_RING = '2px'
// 2px visual inset minus the 1px stroke, so the thumb sits `space[2]` from the
// outer edge of the 44×24 track while the border stays in-flow.
const THUMB_INSET = `calc(${semantics.space[2]} - ${STROKE})`

// How far the thumb travels, as an explicit length rather than `auto`.
//
// `margin-inline-start: auto` used to do this job, and it positioned correctly in
// both directions — but `auto` is not an interpolable value, so the transition below
// never ran and the reduced-motion guard around it guarded nothing. The switch
// snapped. Declaring the distance makes the same movement animatable without
// reaching for `translateX` and an RTL override: `margin-inline-start` is already
// logical, so this flips on its own.
//
// Derived from the outer geometry, because the thumb sits `space[2]` from each outer
// edge of the track: 44 − 2 − 2 − 20 = 20px.
const THUMB_TRAVEL = `calc(${TRACK_INLINE} - 2 * ${semantics.space[2]} - ${THUMB_SIZE})`

// PROVISIONAL. Both values are literals standing in for roles that do not exist yet
// — the Motion family is unpublished, so there is no duration or easing token to
// bind. Chosen to feel like a direct-manipulation toggle rather than derived from a
// spec: short enough not to lag the click, eased out so the thumb settles instead of
// stopping dead. Replace both with motion roles when Soma publishes them; do not
// treat these numbers as design intent.
const THUMB_MOTION = '120ms ease-out'

const enabled = '&:not([data-disabled])'
// The master has no focus+hover cell, so a keyboard-focused control under the
// pointer must not paint hover — a combination the design never specifies.
const hovered = `${enabled}:not(:focus-visible):hover`

// The root *is* the 44×24 track. Off keeps a 1px stroke; on keeps the same
// width as a transparent border so the footprint never shifts. Off hover is
// Rest in the file — there is no off-hover rule.
export const rootStyle = style({
  alignItems: 'center',
  background: semantics.color.surface.muted,
  blockSize: TRACK_BLOCK,
  borderColor: semantics.color.border.subtle,
  borderRadius: semantics.radius.control,
  borderStyle: 'solid',
  borderWidth: STROKE,
  cursor: 'pointer',
  display: 'inline-flex',
  flexShrink: 0,
  inlineSize: TRACK_INLINE,
  padding: THUMB_INSET,
  position: 'relative',
  selectors: {
    '&:focus-visible': {
      outline: `${FOCUS_RING} solid ${semantics.color.focus.ring.base}`,
      // Same 2px gap as Button. Offset 0 sits on the transparent on-state
      // border and reads as flush against the fill.
      outlineOffset: FOCUS_RING,
    },
    '&[data-disabled]': {
      background: semantics.color.surface.disabled,
      borderColor: semantics.color.border.disabled,
      cursor: 'default',
    },
    // `enabled` is load-bearing: without it this rule and the disabled one tie
    // on specificity, so a disabled on-switch would paint whichever sorts last
    // — and `perfectionist/sort-modules` decides that order, not us.
    [`${enabled}[data-checked]`]: {
      background: semantics.color.action.primary.base,
      borderColor: 'transparent',
    },
    [`${hovered}[data-checked]`]: {
      background: semantics.color.action.primary.hover,
    },
  },
})

export const thumbStyle = style({
  '@media': {
    // Now load-bearing: the travel below is a length, so this transition actually
    // runs and honoring `prefers-reduced-motion` actually suppresses movement.
    '(prefers-reduced-motion: no-preference)': {
      transition: `margin-inline-start ${THUMB_MOTION}`,
    },
  },
  background: semantics.color.surface.default,
  blockSize: THUMB_SIZE,
  borderRadius: semantics.radius.control,
  boxShadow: semantics.elevation.xs,
  flexShrink: 0,
  inlineSize: THUMB_SIZE,
  // The rest end of the travel. Declared rather than left to the initial value so
  // both ends of the transition are explicit at the same property.
  marginInlineStart: 0,
  selectors: {
    // Logical, not `translateX`: `margin-inline-start` resolves to the correct
    // physical side in both LTR and RTL, so the thumb needs no direction override.
    '&[data-checked]': {
      marginInlineStart: THUMB_TRAVEL,
    },
  },
})

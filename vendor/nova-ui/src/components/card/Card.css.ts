import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

// `Card.Root` supplies the only visual chrome — border, radius, surface, and
// padding. The parts below are layout plus the type `Card.HeaderTitle` /
// `Card.Body` own. Presence of a part (not a boolean prop) is what turns a
// gap on, since `Root`'s `gap` only applies between children that are
// actually rendered.
export const rootStyle = style({
  background: semantics.color.surface.raised,
  border: `1px solid ${semantics.color.border.subtle}`,
  borderRadius: semantics.radius.surface,
  display: 'flex',
  flexDirection: 'column',
  gap: semantics.space[16],
  padding: semantics.space[16],
})

// Row for `Card.HeaderTitle` plus an optional trailing control. The title grows
// (`flex-grow` + `min-width: 0` on `titleStyle`) so a long label wraps or
// truncates instead of shoving the action off the row; `space-between` would
// only rhyme with that for exactly two children and would not shrink the
// title. Default `justify-content: flex-start` is the start-packed row.
export const headerStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[8],
  width: '100%',
})

export const titleStyle = style({
  ...semantics.text.cardTitle,
  color: semantics.color.text.primary.base,
  flexGrow: 1,
  margin: 0,
  minWidth: 0,
  overflowWrap: 'break-word',
})

// Default foreground for plain text and `Typography` that inherits. Nested
// components that paint their own color (Button, Badge, …) are unaffected.
// No type scale of its own — a list or widget inside the body keeps the
// type the consumer chose. `min-width: 0` lets that content shrink in the
// column flex instead of overflowing the chrome.
export const bodyStyle = style({
  color: semantics.color.text.secondary.base,
  minWidth: 0,
  width: '100%',
})

export const footerStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[8],
  justifyContent: 'flex-end',
  width: '100%',
})

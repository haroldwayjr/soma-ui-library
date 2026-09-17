import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

// App-shell chrome: Soma's 56px bar, `surface.default` on the subtle Storybook
// canvas, hairline across the full width — not under the tab labels alone.
export const rootStyle = style({
  alignItems: 'stretch',
  background: semantics.color.surface.default,
  borderBottom: `1px solid ${semantics.color.border.subtle}`,
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'space-between',
  minBlockSize: semantics.space[56],
  paddingInline: semantics.space[24],
})

export const startStyle = style({
  alignItems: 'stretch',
  display: 'flex',
  flex: 1,
  gap: semantics.space[32],
  minInlineSize: 0,
})

export const brandStyle = style({
  alignItems: 'center',
  alignSelf: 'center',
  color: semantics.color.logo.brand,
  display: 'flex',
  gap: semantics.space[12],
})

// Home lockup (mark + wordmark). Not `Link`: no underline and no `text.link`.
// Color stays `logo.brand` from the cluster. Gap matches `brandStyle` so the
// lockup does not change when it becomes the `<a>`. `createLink` attaches here.
export const brandLinkStyle = style({
  ':focus-visible': {
    outline: `2px solid ${semantics.color.focus.ring.base}`,
    outlineOffset: '2px',
  },
  alignItems: 'center',
  color: 'inherit',
  cursor: 'pointer',
  display: 'inline-flex',
  flexShrink: 0,
  gap: semantics.space[12],
  textDecorationLine: 'none',
})

export const trailingStyle = style({
  alignItems: 'center',
  alignSelf: 'center',
  display: 'flex',
  gap: semantics.space[4],
})

// Soma's Header actions are three 40×40 cells (`size.input.medium`) at
// `space[4]`. IconButton medium already fills that cell. ButtonAvatar `md`
// is 32px, so it sits in this inset — otherwise the 32px disk looks closer
// to Settings than the two icon buttons do to each other.
export const trailingActionStyle = style({
  alignItems: 'center',
  blockSize: semantics.size.input.medium,
  display: 'inline-flex',
  flexShrink: 0,
  inlineSize: semantics.size.input.medium,
  justifyContent: 'center',
})

export const tabsNavStyle = style({
  alignItems: 'stretch',
  alignSelf: 'stretch',
  display: 'flex',
  gap: semantics.space[4],
})

// Indicator is a local `::after` inset to the tab's horizontal padding
// (`space[12]`), matching Soma. Current page is `aria-current="page"` — the
// router wrap sets it; Storybook sets it by hand.
export const tabStyle = style({
  ...semantics.text.subtitle2,
  '::after': {
    blockSize: semantics.space[2],
    content: '',
    display: 'none',
    insetBlockEnd: 0,
    insetInline: semantics.space[12],
    position: 'absolute',
  },
  alignItems: 'center',
  color: semantics.color.text.tertiary.base,
  cursor: 'pointer',
  display: 'inline-grid',
  // Idle (500) is narrower than the hidden 600 sizer. Center it in that
  // reserved width so the glyphs grow evenly instead of walking right.
  justifyItems: 'center',
  margin: 0,
  paddingBlock: 0,
  paddingInline: semantics.space[12],
  position: 'relative',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${semantics.color.focus.ring.base}`,
      outlineOffset: '2px',
    },
    '&:hover:not([aria-current="page"])': {
      color: semantics.color.text.tertiary.hover,
    },
    '&[aria-current="page"]': {
      color: semantics.color.text.brand.base,
      fontWeight: semantics.text.h5.fontWeight,
    },
    '&[aria-current="page"]::after': {
      background: semantics.color.action.primary.base,
      display: 'block',
    },
  },
  // `<a>` is underlined by the UA. The selected cue is the 2px `::after` bar,
  // not Link's underline — same reset LinkButton uses.
  textDecorationLine: 'none',
  whiteSpace: 'nowrap',
})

// Stacked on the visible label so the trigger's inline size is the selected
// (600) width even while idle is `subtitle2` (500). Neighbors do not shift.
export const tabLabelStyle = style({
  gridArea: '1 / 1',
})

export const tabSizerStyle = style({
  fontWeight: semantics.text.h5.fontWeight,
  gridArea: '1 / 1',
  pointerEvents: 'none',
  userSelect: 'none',
  visibility: 'hidden',
})

import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

// Shared with ButtonLink via a sibling-file import of this module. Do not
// re-export it from `link/index.ts`.
// Type (size, weight, leading, family) is inherited on purpose — a link in
// `h5` stays `h5`. Color is not inherited; the link role owns it. Display is
// the user-agent `inline` of `<a>` and is not set — flex would pull the
// link out of the surrounding sentence. Author `color` already beats the
// UA `a:visited` purple (author origin wins), so there is no `:visited`
// rule. Adding one would tie `:hover` at the same specificity and force
// compound selectors for no visual change.
//
// Focus is a 2px `focus.ring` stroke with `radius.link` (4px). CSS
// `outline` does not follow `border-radius` in Firefox, and ButtonLink's
// host reset zeros `border`, so the ring is an outer `box-shadow` — same
// 2px width Button / Chip / Checkbox record as a literal. No padding: an
// inset would open gaps in the surrounding text.
//
// Underline is hover-only (Soma Link masters): Rest / Focus / Disabled stay
// plain ink; Hover adds a solid underline in `currentcolor` with no fill.
// Decoration sits on `labelStyle` so the external icon is not underlined.
const FOCUS_RING = '2px'

export const linkStyle = style({
  ':focus-visible': {
    boxShadow: `0 0 0 ${FOCUS_RING} ${semantics.color.focus.ring.base}`,
    outline: 'none',
  },
  borderRadius: semantics.radius.link,
  color: semantics.color.text.link.base,
  cursor: 'pointer',
  selectors: {
    '&:active': {
      color: semantics.color.text.link.hover,
    },
    '&:hover': {
      color: semantics.color.text.link.hover,
    },
  },
  textDecorationLine: 'none',
})

// Label span — hover underline only (not the trailing external icon).
export const labelStyle = style({
  textDecorationColor: 'currentcolor',
  textDecorationLine: 'none',
  selectors: {
    [`${linkStyle}:active &`]: {
      textDecorationLine: 'underline',
    },
    [`${linkStyle}:hover &`]: {
      textDecorationLine: 'underline',
    },
  },
})

// On the trailing `IconExternalLink` when `target="_blank"`. `inline-block`
// so the glyph sits in the line; `margin-inline-start` is the master's 2px
// gap. Not a flex gap on the `<a>` — that needs a flex formatting context
// and would stop the link wrapping with the sentence.
export const iconStyle = style({
  display: 'inline-block',
  marginInlineStart: semantics.space[2],
  verticalAlign: 'text-top',
})

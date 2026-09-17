import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'
import { linkStyle } from '../link/Link.css'

// `<button>` carries UA font, padding, border, and a system appearance.
// Link's style assumes an `<a>` that inherits type. Reset the host so the
// shared link class is the only appearance — same job `resetUnderline`
// does for LinkButton, inverted. Compound `${linkStyle}&` beats Link's
// underline at rest without a `!important` or a source-order bet.
export const resetHost = style({
  ':disabled': {
    color: semantics.color.text.disabled,
    cursor: 'not-allowed',
  },
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  font: 'inherit',
  margin: 0,
  padding: 0,
  selectors: {
    // Beats Link.css `&:hover` / `&:active` so a disabled control cannot
    // pick up `text.link.hover` under the pointer.
    '&:disabled:active, &:disabled:hover': {
      color: semantics.color.text.disabled,
    },
    [`${linkStyle}&`]: {
      textDecorationLine: 'none',
    },
  },
})

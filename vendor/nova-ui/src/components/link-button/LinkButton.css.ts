import { style } from '@vanilla-extract/css'

// `<a>` is underlined by the UA. Button's recipe never sets decoration because
// its root is `<button>`. Unset it here so the look matches; do not paint
// Link's underline.
export const resetUnderline = style({
  textDecorationLine: 'none',
})

import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

const REST_STROKE = '1px'
const FOCUS_STROKE = '2px'

// Focus thickens the border by 1px and `paddingInline` hands that pixel straight
// back, so the content box measures identically focused and at rest.
//
// Thickening alone is a reflow: the global reset is `box-sizing: border-box`, so the
// extra pixel is taken *out* of the content box rather than added outside it, and the
// value visibly jumps 1px on every tab stop through a form. Compensating keeps the
// 2px stroke design specified while making the jump impossible — it is not a
// different visual, it is the same visual drawn without moving anything.
//
// Deliberately a real border rather than an inset `box-shadow` or a negative-offset
// `outline`: forced-colors mode drops shadows, and a border is the one of the three
// that survives it intact. Badge and Chip reach for `outline` because they have no
// border to thicken; this control does.
const FOCUS_PADDING_INLINE = `calc(${semantics.space[12]} - ${REST_STROKE})`

const enabledValid = '&:not(:disabled):not([data-invalid])'

export const inputStyle = style({
  ...semantics.text.body1,
  appearance: 'none',
  background: semantics.color.surface.default,
  blockSize: semantics.size.input.medium,
  borderColor: semantics.color.border.strong.base,
  borderRadius: semantics.radius.input,
  borderStyle: 'solid',
  borderWidth: REST_STROKE,
  color: semantics.color.text.primary.base,
  inlineSize: '100%',
  margin: 0,
  minInlineSize: 0,
  outline: 'none',
  paddingBlock: 0,
  paddingInline: semantics.space[12],
  selectors: {
    '&::placeholder': {
      color: semantics.color.text.tertiary.base,
    },
    '&:disabled': {
      background: semantics.color.surface.subtle,
      borderColor: semantics.color.border.subtle,
      color: semantics.color.text.disabled,
    },
    '&:disabled::placeholder': {
      color: semantics.color.text.disabled,
    },
    // Error wins the chrome: hover and the 2px focus stroke stay off while
    // invalid. Review the focused-invalid combination with design — the sticker
    // never shows both.
    '&[data-invalid]:not(:disabled)': {
      borderColor: semantics.color.border.danger.base,
    },
    [`${enabledValid}:focus-visible`]: {
      borderColor: semantics.color.focus.ring.base,
      borderWidth: FOCUS_STROKE,
      paddingInline: FOCUS_PADDING_INLINE,
    },
    [`${enabledValid}:hover:not(:focus-visible)`]: {
      borderColor: semantics.color.border.strong.hover,
    },
  },
})

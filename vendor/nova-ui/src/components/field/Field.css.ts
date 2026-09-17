import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: semantics.space[4],
})

export const labelStyle = style({
  ...semantics.text.subtitle3,
  alignItems: 'center',
  color: semantics.color.text.primary.base,
  display: 'flex',
  gap: semantics.space[4],
  selectors: {
    [`${rootStyle}[data-disabled] &`]: {
      color: semantics.color.text.disabled,
    },
  },
})

export const requiredMarkerStyle = style({
  color: semantics.color.text.danger.base,
  selectors: {
    [`${rootStyle}[data-disabled] &`]: {
      color: semantics.color.text.disabled,
    },
  },
})

export const descriptionStyle = style({
  ...semantics.text.caption,
  color: semantics.color.text.tertiary.base,
  margin: 0,
  selectors: {
    [`${rootStyle}[data-disabled] &`]: {
      color: semantics.color.text.disabled,
    },
  },
})

export const errorStyle = style({
  ...semantics.text.caption,
  color: semantics.color.text.danger.base,
  margin: 0,
})

import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

const CONTROL_SIZE = '1.5rem'
const CHEVRON_SIZE = '0.75rem'
const FOCUS_RING = '2px'

export const navStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[12],
})

export const pagesStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[8],
})

export const chevronStyle = style({
  blockSize: CHEVRON_SIZE,
  inlineSize: CHEVRON_SIZE,
})

export const arrowRecipe = recipe({
  base: {
    alignItems: 'center',
    background: 'none',
    blockSize: CONTROL_SIZE,
    border: 'none',
    borderRadius: semantics.radius.control,
    color: semantics.color.icon.secondary,
    cursor: 'pointer',
    display: 'inline-flex',
    inlineSize: CONTROL_SIZE,
    justifyContent: 'center',
    padding: semantics.space[6],
    selectors: {
      '&:disabled': {
        background: semantics.color.surface.disabled,
        color: semantics.color.icon.disabled,
        cursor: 'default',
      },
      '&:focus-visible': {
        outline: `${FOCUS_RING} solid ${semantics.color.focus.ring.base}`,
        outlineOffset: '2px',
      },
    },
  },
})

export const pageNumberRecipe = recipe({
  base: {
    alignItems: 'center',
    background: 'none',
    blockSize: CONTROL_SIZE,
    border: 'none',
    borderRadius: semantics.radius.surface,
    color: semantics.color.text.secondary.base,
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '0.8125rem',
    fontWeight: 500,
    inlineSize: CONTROL_SIZE,
    justifyContent: 'center',
    lineHeight: '1.125rem',
    padding: semantics.space[4],
    selectors: {
      '&:focus-visible': {
        outline: `${FOCUS_RING} solid ${semantics.color.focus.ring.base}`,
        outlineOffset: '2px',
      },
      '&:hover:not(:disabled)': {
        background: semantics.color.surface.subtle,
        color: semantics.color.text.secondary.hover,
      },
    },
  },
  variants: {
    current: {
      true: {
        background: semantics.color.action.primary.base,
        color: semantics.color.text.inverse,
        selectors: {
          '&:hover:not(:disabled)': {
            background: semantics.color.action.primary.base,
            color: semantics.color.text.inverse,
          },
        },
      },
    },
  },
})

export const ellipsisStyle = style({
  alignItems: 'center',
  blockSize: CONTROL_SIZE,
  color: semantics.color.text.secondary.base,
  display: 'inline-flex',
  fontSize: '0.8125rem',
  fontWeight: 500,
  inlineSize: CONTROL_SIZE,
  justifyContent: 'center',
  lineHeight: '1.125rem',
})

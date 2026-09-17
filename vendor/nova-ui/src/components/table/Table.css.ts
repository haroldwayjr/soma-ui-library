import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Soma header 44px / body 52px are not on the space scale. Bound in rem so
// the row still tracks a font-size override (ADR 0003) until a size.table
// role exists.
const HEADER_ROW = '2.75rem'
const BODY_ROW = '3.25rem'

export const rootStyle = style({
  background: semantics.color.surface.default,
  border: `1px solid ${semantics.color.border.subtle}`,
  borderRadius: semantics.radius.surface,
  columnGap: semantics.space[12],
  display: 'grid',
  overflow: 'auto',
  width: '100%',
})

export const groupStyle = style({
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
})

export const rowStyle = style({
  alignItems: 'center',
  borderBottom: `1px solid ${semantics.color.border.subtle}`,
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
  minBlockSize: BODY_ROW,
  paddingInline: semantics.space[12],
  selectors: {
    [`${groupStyle}[data-table-group="body"] &:hover`]: {
      background: semantics.color.action.secondary.hover,
    },
    [`${groupStyle}[data-table-group="body"] &:last-child`]: {
      borderBottom: 0,
    },
    [`${groupStyle}[data-table-group="body"] &[aria-selected="true"]:hover`]: {
      background: semantics.color.surface.brand.subtle,
    },
    [`${groupStyle}[data-table-group="body"] &[aria-selected="true"]`]: {
      background: semantics.color.surface.brand.subtle,
    },
    [`${groupStyle}[data-table-group="head"] &`]: {
      background: semantics.color.surface.subtle,
      minBlockSize: HEADER_ROW,
    },
  },
})

export const headerCellRecipe = recipe({
  base: {
    ...semantics.text.subtitle3,
    color: semantics.color.text.secondary.base,
    display: 'flex',
    minInlineSize: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  variants: {
    align: {
      center: { justifyContent: 'center' },
      start: { justifyContent: 'flex-start' },
    },
  },
})

export const cellRecipe = recipe({
  base: {
    ...semantics.text.body1,
    color: semantics.color.text.primary.base,
    display: 'flex',
    minInlineSize: 0,
    overflow: 'hidden',
  },
  variants: {
    align: {
      center: { justifyContent: 'center' },
      start: { justifyContent: 'flex-start' },
    },
  },
})

export const cellTruncateRecipe = recipe({
  base: {
    display: 'block',
    inlineSize: '100%',
    minInlineSize: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  variants: {
    align: {
      center: { textAlign: 'center' },
      start: { textAlign: 'start' },
    },
  },
})

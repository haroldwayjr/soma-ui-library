import { style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

export const rootStyle = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: semantics.space[8],
  justifyContent: 'space-between',
  width: '100%',
})

export const pageSizeClusterStyle = style({
  alignItems: 'center',
  display: 'inline-flex',
  flexDirection: 'row',
  flexShrink: 0,
  flexWrap: 'nowrap',
  gap: semantics.space[8],
})

export const pageSizeLabelStyle = style({
  ...semantics.text.caption,
  color: semantics.color.text.secondary.base,
  flex: 'none',
  whiteSpace: 'nowrap',
})

// Select's popup width follows the trigger (`--anchor-width`). The selected row
// adds a 16px check and `space[8]` gap; narrower than this clips the value.
// No `space[*]` step fits — 88px is the measured minimum for two-digit options.
export const pageSizeSelectStyle = style({
  flex: 'none',
  inlineSize: 'auto',
  minInlineSize: '88px',
})

export type TablePaginationSize = 'medium' | 'small'

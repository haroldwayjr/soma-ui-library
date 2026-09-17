import { recipe } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

export const stackRecipe = recipe({
  base: {
    // Cancels the automatic minimum size a flex item gets in the inline axis, so
    // a Stack nested in a row parent can shrink instead of forcing overflow. It
    // does not help this Stack's own children — they are separate flex items
    // that keep their own `auto` minimum, and Stack styles no children.
    minInlineSize: 0,
  },
  // No `defaultVariants`: Stack always passes every variant explicitly, so
  // defaults here would be unreachable configuration that silently disagrees
  // with the component's own parameter defaults.
  variants: {
    align: {
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      start: { alignItems: 'flex-start' },
      stretch: { alignItems: 'stretch' },
    },
    direction: {
      horizontal: { flexDirection: 'row' },
      vertical: { flexDirection: 'column' },
    },
    display: {
      block: { display: 'flex' },
      inline: { display: 'inline-flex' },
    },
    gap: {
      0: { gap: semantics.space[0] },
      2: { gap: semantics.space[2] },
      4: { gap: semantics.space[4] },
      6: { gap: semantics.space[6] },
      8: { gap: semantics.space[8] },
      10: { gap: semantics.space[10] },
      12: { gap: semantics.space[12] },
      14: { gap: semantics.space[14] },
      16: { gap: semantics.space[16] },
      18: { gap: semantics.space[18] },
      20: { gap: semantics.space[20] },
      24: { gap: semantics.space[24] },
      28: { gap: semantics.space[28] },
      32: { gap: semantics.space[32] },
      36: { gap: semantics.space[36] },
      40: { gap: semantics.space[40] },
      48: { gap: semantics.space[48] },
      56: { gap: semantics.space[56] },
      64: { gap: semantics.space[64] },
      80: { gap: semantics.space[80] },
      96: { gap: semantics.space[96] },
    },
    justify: {
      between: { justifyContent: 'space-between' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      start: { justifyContent: 'flex-start' },
    },
    wrap: {
      false: { flexWrap: 'nowrap' },
      true: { flexWrap: 'wrap' },
    },
  },
})

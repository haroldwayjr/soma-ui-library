import { globalStyle, style } from '@vanilla-extract/css'

import { semantics } from '../../tokens/semantic.css'

// Soma's Included Health hug is 22×24. That is not a published Icon Size
// (`size.icon` is 16/20/24/32 squares) and not a token — a logo hug, not a
// product glyph. Pixel literals, same class as a 1px hairline.
export const rootStyle = style({
  blockSize: '24px',
  display: 'block',
  flex: 'none',
  inlineSize: '22px',
})

// Paint the paths, not `currentColor` on the `<svg>`. Inherited color follows
// body text in Storybook (`text.primary`). `logo.brand` is brand blue in light
// and white in dark — not navy `icon.brand`.
globalStyle(`${rootStyle} path`, {
  fill: semantics.color.logo.brand,
})

import { createVar, style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Promote to a semantic width role when a third component confirms the measure;
// Switch carries the same literal.
const STROKE = '1px'

// The stroke is painted as an inset outline rather than a border, because it must
// not enter layout. Figma draws a frame's stroke inside the frame, so the masters'
// 20 / 24 heights already contain it; a CSS border would add its 1px to each edge
// and render 22 / 26 — `box-sizing` cannot help, since it only changes how a
// *specified* height is counted.
//
// `outline` over an inset `box-shadow`: forced-colors mode drops shadows but keeps
// outlines, so the badge retains an edge when its fill is overridden. Badge has no
// focus ring, so nothing else wants this property.
const STROKE_OFFSET = `-${STROKE}`

// The masters' heights, declared rather than derived from padding or leading, and
// in `rem` so the box tracks a reader's font-size override. Deriving it cannot
// center Small's label, and a px height clips it under a font-size override — see
// ADR 0003 for the arithmetic and the two fixes that were wrong.
const BLOCK_SIZE = {
  // 24px and 20px at the default root font size.
  medium: '1.5rem',
  small: '1.25rem',
} as const

const DOT_SIZE = {
  // 8px and 6px at the default root font size. Same unit as the box so the
  // dot tracks a reader's font-size override instead of staying a fixed px.
  medium: '0.5rem',
  small: '0.375rem',
} as const

const ICON_SIZE = {
  // Figma Soft Medium Leading=Icon uses icon.sm (16px); Small uses a tighter lead.
  medium: '1rem',
  small: '0.75rem',
} as const

// The leading glyph's color and diameter are set by the root's `tone` and `size`
// rather than by variants on the glyph itself. Two reasons: the fill is a different
// role from the label's (`icon/success` is a different step than
// `text/success/subtle`, so `currentColor` is wrong), and pushing the value down
// as a variable keeps the disabled override in one place — see `&[data-disabled]` below.
const leadingColor = createVar()
const dotSize = createVar()
const iconSize = createVar()

// Every tone paints through this guard so the tone rules and the disabled rule
// are mutually exclusive rather than merely different specificities. Switch took
// the same measure for the same reason — a tie is resolved by whatever order
// `perfectionist/sort-modules` and Vanilla Extract emit in, which is nobody's
// decision. It also keeps the disabled state verifiable in jsdom, whose cascade
// applies overlapping rules in source order without weighting specificity.
const enabled = '&:not([data-disabled])'

export const badgeRecipe = recipe({
  base: {
    alignItems: 'center',
    borderRadius: semantics.radius.badge,
    display: 'inline-flex',
    // A badge is its content's size. `flex: none` stops a flex parent stretching
    // it to the row's height or squashing it below its label; `max-content`
    // holds the width when the parent is a grid instead.
    flex: 'none',
    inlineSize: 'max-content',
    // Each tone supplies the color; width and offset are shared so the stroke's
    // geometry cannot vary with the tone. It stays out of layout, so the declared
    // `block-size` is the rendered height rather than height plus 2px.
    outlineOffset: STROKE_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: STROKE,
    selectors: {
      // The stroke is deliberately absent here: the masters keep the tone's
      // stroke on a disabled badge and only de-tone the fill, which is why the
      // tone guard below leaves `outlineColor` outside it. See the README.
      '&[data-disabled]': {
        background: semantics.color.surface.subtle,
        color: semantics.color.text.disabled,
        vars: { [leadingColor]: semantics.color.icon.disabled },
      },
    },
    // The label is a single run of text; the masters neither wrap nor truncate.
    whiteSpace: 'nowrap',
  },
  variants: {
    // Height, inline padding, and the label's type style, plus the leading
    // diameter the label sits beside.
    //
    // No vertical padding: Figma expresses the masters as `inset` on all four
    // sides, but the height is declared instead and `align-items: center` does the
    // centering. ADR 0003.
    size: {
      // Medium's spacing is variable-bound in Figma (`inset/sm`, `inline/sm`).
      // Small's inline padding and gap are not, so the 6px is measured off the
      // master. See the README's token gaps before changing these to `space[4]`.
      medium: {
        blockSize: BLOCK_SIZE.medium,
        gap: semantics.space[8],
        paddingInline: semantics.space[8],
        vars: {
          [dotSize]: DOT_SIZE.medium,
          [iconSize]: ICON_SIZE.medium,
        },
        ...semantics.text.badgeMedium,
      },
      small: {
        blockSize: BLOCK_SIZE.small,
        gap: semantics.space[6],
        paddingInline: semantics.space[6],
        vars: {
          [dotSize]: DOT_SIZE.small,
          [iconSize]: ICON_SIZE.small,
        },
        ...semantics.text.badgeSmall,
      },
    },
    // Fill, stroke, label, and leading — one quartet per tone, spelled out because
    // the role names are not uniform: neutral's label is `text.primary.base` and
    // its stroke is `border.neutral.subtle`; the five toned labels bind
    // `text.*.subtle`. Soft fills bind `surface.*.soft` (100-step wash).
    // The stroke sits outside the `enabled` guard because it survives the
    // disabled state; fill, label, and leading sit inside it because they do not.
    tone: {
      accent: {
        outlineColor: semantics.color.border.accent.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.accent.soft,
            color: semantics.color.text.accent.subtle,
            vars: { [leadingColor]: semantics.color.icon.accent },
          },
        },
      },
      brand: {
        outlineColor: semantics.color.border.brand.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.brand.soft,
            color: semantics.color.text.brand.subtle,
            vars: { [leadingColor]: semantics.color.icon.brand },
          },
        },
      },
      danger: {
        outlineColor: semantics.color.border.danger.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.danger.soft,
            color: semantics.color.text.danger.subtle,
            vars: { [leadingColor]: semantics.color.icon.danger },
          },
        },
      },
      neutral: {
        outlineColor: semantics.color.border.neutral.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.subtle,
            color: semantics.color.text.primary.base,
            vars: { [leadingColor]: semantics.color.icon.default },
          },
        },
      },
      success: {
        outlineColor: semantics.color.border.success.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.success.soft,
            color: semantics.color.text.success.subtle,
            vars: { [leadingColor]: semantics.color.icon.success },
          },
        },
      },
      warning: {
        outlineColor: semantics.color.border.warning.subtle,
        selectors: {
          [enabled]: {
            background: semantics.color.surface.warning.soft,
            color: semantics.color.text.warning.subtle,
            vars: { [leadingColor]: semantics.color.icon.warning },
          },
        },
      },
    },
    // Soft is the only variant that exists, and it needs no declarations of its
    // own — every value above is Soft's. The axis is here so that adding Solid
    // and Outlined widens this object instead of restructuring the recipe, and
    // so the required prop has something to select.
    variant: {
      soft: {},
    },
  },
})

// The label needs its own element because the trim applies to the box that formats
// the line — on the flex root it does nothing. Trimming makes a single line's
// height independent of leading, which is what removes the 1px centering bug at the
// source. ADR 0003. Chip carries the same treatment.
export const labelStyle = style({
  textBoxEdge: 'cap alphabetic',
  textBoxTrim: 'trim-both',
})

// A circle, so 50% rather than a radius role: this is a shape, not a corner.
export const dotStyle = style({
  background: leadingColor,
  blockSize: dotSize,
  borderRadius: '50%',
  flexShrink: 0,
  inlineSize: dotSize,
})

// Figma Soft Leading=Icon uses status/star outline; color tracks `icon.*`.
export const iconStyle = style({
  blockSize: iconSize,
  color: leadingColor,
  flexShrink: 0,
  inlineSize: iconSize,
})

export type BadgeSize = NonNullable<BadgeVariants['size']>
export type BadgeTone = NonNullable<BadgeVariants['tone']>
export type BadgeVariant = NonNullable<BadgeVariants['variant']>
type BadgeVariants = NonNullable<RecipeVariants<typeof badgeRecipe>>

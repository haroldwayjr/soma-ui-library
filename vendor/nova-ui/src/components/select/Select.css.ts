import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Trigger heights come from the shared `size.input` role rather than local literals,
// so a Select and a Text Field in the same form row measure identically at every font
// size — including under a reader's font-size override, where a `rem` role and a px
// literal drift apart. ADR 0003 for why the height is declared and why the unit
// matters.
//
// `block-size`, not `min-block-size` as Button uses: the trigger's value and the
// item's label are both single-line-and-truncate, so there is no wrapped state for a
// floor to accommodate.
const TRIGGER_BLOCK_SIZE = {
  medium: semantics.size.input.medium,
  small: semantics.size.input.small,
} as const

// The item stays 36px in both trigger sizes: the popup is a list of text rows, and
// the trigger's density should not retune the list's tap targets.
//
// A local literal even though it is the same number as `size.input.small`. Binding
// the control role here would say a list row is a form control, and would couple the
// two so that retuning the small trigger silently retuned the popup.
const ITEM_BLOCK_SIZE = '2.25rem'

const REST_STROKE = '1px'

// 1px → 2px is drawn *inside* the box under the global `border-box`, so thickening
// alone shrinks the content box and shifts the value 1px while tabbing. The trigger
// gives that pixel back through `paddingInline` below, which keeps the 2px stroke the
// master draws and removes the shift. Text Field carries the same treatment and the
// long-form reasoning.
const FOCUS_STROKE = '2px'

// See `FOCUS_PADDING_INLINE` in `TextInput.css.ts` — same compensation, same reason.
const FOCUS_PADDING_INLINE = `calc(${semantics.space[12]} - ${REST_STROKE})`

// Glyph sizes, not spacing steps. Soma's `Icon Size` collection (16/20/24/32) is
// not published to Nova — `colors.ts` records it as having no consumer — so there
// is no `icon.xs` to reach for. Do not invent one before the icon set ships.
const CHEVRON_SIZE = '12px'
const CHECK_SIZE = '16px'

// Error owns the chrome while invalid, so hover and the focus stroke stay off.
// The masters draw no error+focus combination; that omission is filed.
const enabledValid = '&:not([data-disabled]):not([data-invalid])'

export const triggerRecipe = recipe({
  base: {
    alignItems: 'center',
    background: semantics.color.surface.default,
    borderColor: semantics.color.border.strong.base,
    borderRadius: semantics.radius.input,
    borderStyle: 'solid',
    borderWidth: REST_STROKE,
    color: semantics.color.text.primary.base,
    cursor: 'pointer',
    display: 'flex',
    gap: semantics.space[8],
    // Width comes from the parent — the 280px in every master is the sticker
    // sheet's canvas, not a specified width.
    inlineSize: '100%',
    justifyContent: 'space-between',
    outline: 'none',
    paddingBlock: 0,
    paddingInline: semantics.space[12],
    selectors: {
      // `data-*` rather than `:disabled` / `:invalid`: Base UI drives both from
      // Field context as well as from Select's own props, and the pseudo-classes
      // only see the latter.
      '&[data-disabled]': {
        background: semantics.color.surface.subtle,
        borderColor: semantics.color.border.subtle,
        color: semantics.color.text.disabled,
        cursor: 'not-allowed',
      },
      '&[data-invalid]:not([data-disabled])': {
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
      // Read-only deliberately paints nothing — rest chrome, following Text
      // Field. It is the one state the masters do not draw, and it means a
      // sighted mouse user gets no cue before clicking a trigger that will not
      // open. Recorded as design-owned in the README; do not invent a treatment
      // here.
    },
  },
  variants: {
    size: {
      medium: { blockSize: TRIGGER_BLOCK_SIZE.medium },
      small: { blockSize: TRIGGER_BLOCK_SIZE.small },
    },
  },
})

// Rest and Filled share the border role; the difference between them is this
// color alone, which is why the placeholder's light-theme contrast (2.58:1,
// filed as Text Field's `464:4292`) is load-bearing rather than cosmetic.
// Descender clipping room. `text-box-edge: cap alphabetic` puts the box edge at the
// baseline, so the ink of p, g, y, j and q sits *outside* the box — fine for Badge
// and Chip, which never set `overflow`, but this element must clip for the ellipsis.
//
// `overflow: hidden` clips at the **padding** box, so padding pushes the clip edge
// below the baseline and the descender survives; the matching negative margin takes
// it back out of layout, so the box the trigger centers is unchanged. 0.25em is
// comfortably past Figtree's descender depth at every size this text role uses.
//
// Do not "simplify" this to a wrapper element. Nesting fails twice over: the trim
// only applies to a box that formats the line, so an inline inner span makes it
// silently inert (and the value renders a pixel high — the exact ADR 0003 defect),
// while a block inner span moves the text out of the clipping parent's line box and
// the ellipsis stops engaging.
const DESCENDER_ROOM = '0.25em'

// One element, carrying all three of ADR 0003's steps plus truncation. It is a flex
// item of the trigger, so it is blockified and therefore formats the line — which is
// what makes the trim apply at all, exactly as Badge and Chip get it by being flex
// items themselves.
export const valueStyle = style({
  ...semantics.text.body1,
  marginBlockEnd: `-${DESCENDER_ROOM}`,
  // A flex item will not shrink below its content without this, so the ellipsis
  // never engages.
  minInlineSize: 0,
  overflow: 'hidden',
  paddingBlockEnd: DESCENDER_ROOM,
  selectors: {
    '&[data-placeholder]': {
      color: semantics.color.text.tertiary.base,
    },
  },
  textBoxEdge: 'cap alphabetic',
  textBoxTrim: 'trim-both',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

// The glyph itself, on the `<svg>`. Separate from the two wrapper styles below
// because **the wrapper's size does not constrain the SVG**: an `<svg>` with a
// `viewBox` and no width/height has no intrinsic size, so it falls back to the CSS
// replaced-element default of 300×150 and renders enormous regardless of what its
// parent measures. Both glyphs must carry this.
export const glyphStyle = style({
  blockSize: '100%',
  display: 'block',
  inlineSize: '100%',
})

export const chevronStyle = style({
  alignItems: 'center',
  blockSize: CHEVRON_SIZE,
  color: semantics.color.icon.secondary,
  display: 'flex',
  // Never absorbed by the value's ellipsis.
  flexShrink: 0,
  inlineSize: CHEVRON_SIZE,
  justifyContent: 'center',
  selectors: {
    '[data-disabled] &': {
      color: semantics.color.icon.disabled,
    },
  },
})

export const popupStyle = style({
  background: semantics.color.surface.raised,
  borderColor: semantics.color.border.subtle,
  borderRadius: semantics.radius.surface,
  borderStyle: 'solid',
  borderWidth: REST_STROKE,
  // A near match, not exact: the file draws two layers at 4px and 12px in
  // rgba(16,29,56,0.1); `elevation.lg` is the same structure with different blur
  // and alpha. The role is right and the values want reconciling — see the README.
  boxShadow: semantics.elevation.lg,
  boxSizing: 'border-box',
  // The positioner supplies the trigger's width as a custom property, so the
  // popup tracks the anchor without JS measurement on our side.
  inlineSize: 'var(--anchor-width)',
  padding: semantics.space[8],
  // Deliberately no `max-block-size`: the master shows five options and stops,
  // and a scroll container needs a maximum height plus a decision on Base UI's
  // ScrollUpArrow/ScrollDownArrow versus a plain scrollbar. Unspecified in the
  // file, so it is filed rather than guessed. A fifty-option select overflows
  // the viewport today.
})

export const listStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const itemStyle = style({
  ...semantics.text.body1,
  alignItems: 'center',
  blockSize: ITEM_BLOCK_SIZE,
  // Concentric with the focus stroke below, so highlighting an item never moves
  // its neighbors: the transparent border is in layout at rest.
  borderColor: 'transparent',
  borderRadius: semantics.radius.input,
  borderStyle: 'solid',
  borderWidth: FOCUS_STROKE,
  color: semantics.color.text.primary.base,
  cursor: 'pointer',
  display: 'flex',
  gap: semantics.space[8],
  justifyContent: 'space-between',
  outline: 'none',
  paddingBlock: 0,
  // The 2px border already accounts for 2 of the master's 12px inset.
  paddingInline: `calc(${semantics.space[12]} - ${FOCUS_STROKE})`,
  selectors: {
    '&[data-disabled]': {
      color: semantics.color.text.disabled,
      cursor: 'not-allowed',
    },
    // Base UI drives pointer and keyboard through one `data-highlighted` state,
    // which is the resolution of the masters' separate Hover and Focus visible
    // items: they are the same logical state in a listbox, where the composite
    // holds focus and the highlight moves via `aria-activedescendant`.
    //
    // Both treatments are applied together rather than one being chosen, so a
    // keyboard user and a mouse user see identical paint. This is the open design
    // decision recorded in the README; it also compensates for the hover fill
    // alone measuring 1.18:1 against the popup in light and 1.41:1 in dark.
    '&[data-highlighted]:not([data-disabled])': {
      background: semantics.color.action.secondary.hover,
      borderColor: semantics.color.focus.ring.base,
    },
  },
})

// Same as the trigger's value: a flex item of the row, so the trim applies, with
// the same padding/negative-margin pair keeping descenders out of the clip.
export const itemTextStyle = style({
  marginBlockEnd: `-${DESCENDER_ROOM}`,
  minInlineSize: 0,
  overflow: 'hidden',
  paddingBlockEnd: DESCENDER_ROOM,
  textBoxEdge: 'cap alphabetic',
  textBoxTrim: 'trim-both',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

// Rendered only when selected — an unselected item reserves no gap, so the label
// does not shift between the two states. Selection is therefore carried by the
// glyph alone, which makes the check load-bearing: it cannot be dropped for
// density. `aria-selected` carries the same fact to assistive technology.
export const itemIndicatorStyle = style({
  alignItems: 'center',
  blockSize: CHECK_SIZE,
  color: semantics.color.icon.brand,
  display: 'flex',
  flexShrink: 0,
  inlineSize: CHECK_SIZE,
  justifyContent: 'center',
  selectors: {
    '[data-disabled] &': {
      color: semantics.color.icon.disabled,
    },
  },
})

export type SelectSize = NonNullable<SelectVariants['size']>
type SelectVariants = NonNullable<RecipeVariants<typeof triggerRecipe>>

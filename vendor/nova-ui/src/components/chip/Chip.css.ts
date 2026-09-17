import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Promote to a semantic width role when a third component confirms the measure;
// Badge and Switch carry the same literal.
const STROKE = '1px'

// The stroke is an inset outline rather than a border, for the reason Badge
// records: Figma draws a frame's stroke inside the frame, so the masters' widths
// and heights already contain it. A border would add its 1px to each edge —
// pushing the 54px master to 56 and the label's inset from the specified 10px to
// 11 — and it would put the stroke inside the `space[10]` mapping, which is how a
// spacing token quietly stops meaning what it says.
//
// `outline` over an inset `box-shadow`: forced-colors mode drops shadows but keeps
// outlines, so the chip keeps an edge when its fill is overridden. The root has no
// focus ring of its own — it is inert — so nothing else here wants the property.
// The dismiss button's ring is a separate element and uses the Checkbox pattern.
const STROKE_OFFSET = `-${STROKE}`

// The master's height, declared rather than derived from padding or leading, and
// in `rem` so the box tracks a reader's font-size override. It replaced a
// `min-block-size: 28px` floor that left the label a pixel high — see ADR 0003.
//
// Cost of losing the floor: the box no longer grows to contain an oversized child.
// Nothing does that today; it matters for the deferred 20px avatar.
const BLOCK_SIZE = '1.75rem'

const DISMISS_SIZE = '1rem'
// `xs` selects the shared 16×16 close drawing; Chip constrains its visual slot
// to the 10px measure from the master.
const GLYPH_SIZE = '0.625rem'
// Grows the dismiss hit target to 24×24 for WCAG 2.5.8 without touching layout.
// See `&::after` below. 4px of overhang on a 16px frame at the default root,
// which still leaves 2px of clearance inside a 28px chip, so the footprint
// does not change. The overhang is a spacing token in `px`; the frame is `rem`.
const TARGET_OVERHANG = `calc(${semantics.space[4]} * -1)`
const FOCUS_RING = '2px'

// Every variant paints through this guard so the variant rules and the disabled
// rule are mutually exclusive rather than merely different specificities. Badge,
// Checkbox, and Switch took the same measure for the same reason: a tie is
// resolved by whatever order `perfectionist/sort-modules` and Vanilla Extract
// emit in, which is nobody's decision. It also keeps the disabled state
// verifiable in jsdom, whose cascade applies overlapping rules in source order
// without weighting specificity.
//
// Chip needs it more than Badge did. Badge's disabled state leaves the stroke
// alone, so only two of its four declarations collide; here disabled replaces the
// fill, the stroke, *and* the label for both variants.
const enabled = '&:not([data-disabled])'

export const chipRecipe = recipe({
  base: {
    alignItems: 'center',
    blockSize: BLOCK_SIZE,
    borderRadius: semantics.radius.control,
    display: 'inline-flex',
    // A chip is its content's size. `flex: none` stops a flex parent stretching it
    // to the row's height or squashing it below its label; `max-content` holds the
    // width when the parent is a grid instead.
    flex: 'none',
    // Inert with a single child, so it is declared unconditionally rather than
    // switched on the dismiss button's presence.
    gap: semantics.space[6],
    inlineSize: 'max-content',
    // The variants supply the color; width and offset are shared so the stroke's
    // geometry cannot vary with the variant.
    outlineOffset: STROKE_OFFSET,
    outlineStyle: 'solid',
    outlineWidth: STROKE,
    // Inline only — the vertical inset is absorbed by the declared height, and
    // `align-items: center` does the centering. ADR 0003.
    paddingInline: semantics.space[10],
    selectors: {
      // Both variants converge here — an Outlined disabled chip is pixel-identical
      // to a Filled one. That is what the masters bind; see the README before
      // "fixing" it.
      //
      // In **dark** it converges further than intended: `surface.disabled` and
      // `surface.subtle` are both `grey.800`, and `border.disabled` and
      // `border.subtle` are both `grey.700`, so a disabled Filled chip has the same
      // fill and the same stroke as a resting one and only the label differs
      // (12.43:1 → 1.91:1). A token-layer defect against Soma's dark values, filed,
      // not Chip's to patch — do not add a local color here. The README's state
      // matrix carries the measurements.
      '&[data-disabled]': {
        background: semantics.color.surface.disabled,
        color: semantics.color.text.disabled,
        outlineColor: semantics.color.border.disabled,
      },
    },
    // The label is a single run of text; the masters neither wrap nor truncate.
    whiteSpace: 'nowrap',
    ...semantics.text.chipLabel,
  },
  variants: {
    // Fill, stroke, and label — one triple per variant. The label role is
    // deliberately asymmetric: Filled's surface already separates the chip from
    // the page so its label steps back to `text.secondary.base`, while Outlined
    // has to carry the weight itself. The masters are consistent about it.
    variant: {
      filled: {
        selectors: {
          [enabled]: {
            background: semantics.color.surface.subtle,
            color: semantics.color.text.secondary.base,
            outlineColor: semantics.color.border.subtle,
          },
        },
      },
      outlined: {
        selectors: {
          [enabled]: {
            background: semantics.color.surface.default,
            color: semantics.color.text.primary.base,
            outlineColor: semantics.color.border.strong.base,
          },
        },
      },
    },
  },
})

// The label needs its own element because the trim applies to the box that formats
// the line — on the flex root it does nothing. Trimming makes a single line's
// height independent of leading, which is what removes the 1px centering bug at the
// source. ADR 0003. Badge carries the same treatment.
export const labelStyle = style({
  textBoxEdge: 'cap alphabetic',
  textBoxTrim: 'trim-both',
})

// The only control in the component. A native `<button>`, so its role and its
// keyboard behavior come from the element rather than from ARIA.
export const dismissStyle = style({
  alignItems: 'center',
  // Not `transparent`: the hover and focus rules paint this property, so the rest
  // state has to be the absence of a fill rather than a fill that happens to be
  // see-through.
  background: 'none',
  blockSize: DISMISS_SIZE,
  border: 'none',
  borderRadius: semantics.radius.chipDismiss,
  // The glyph paints with `currentColor`, so this one declaration colors it in
  // every state.
  color: semantics.color.icon.tertiary,
  cursor: 'pointer',
  display: 'inline-flex',
  // A fixed-size control must not be squashed by a tight flex row, or the target
  // drops below the WCAG 2.5.8 minimum.
  flexShrink: 0,
  inlineSize: DISMISS_SIZE,
  justifyContent: 'center',
  padding: 0,
  position: 'relative',
  selectors: {
    // The 24×24 hit target: 4px of overhang on every side, hit-tested as part of
    // the button and invisible until focused. Also hosts the focus ring, so the
    // ring lands on the target boundary rather than on the 16px frame. Following
    // Checkbox rather than the master, which draws a 2px ring *inside* the frame
    // and leaves 2px of surface around a 10px glyph — see the README's open
    // design decisions.
    '&::after': {
      borderRadius: semantics.radius.chipDismissFocusRing,
      content: '""',
      inset: TARGET_OVERHANG,
      position: 'absolute',
    },
    '&:disabled': {
      color: semantics.color.icon.disabled,
      cursor: 'default',
    },
    // Hover and focus share one fill, so a keyboard user gets the same affordance
    // a pointer user does and the two states cannot disagree.
    //
    // This diverges from the master, which paints `surface.default` on focus, and
    // from the `:not(:focus-visible)` scoping Checkbox and Switch use. Both
    // deliberately: on an Outlined chip the master's focus fill *is* the chip's own
    // fill, so focus there changes nothing but the ring, and the two variants end
    // up indicating focus differently. Merging the fills also removes the
    // hover-and-focus cell the masters leave undefined — there is no combination
    // left to specify, rather than a combination we guessed at.
    //
    // The fill is settled. An earlier draft of this file called it provisional,
    // expecting a token fix to move `surface.subtle` (the Filled chip's own fill)
    // onto `action.secondary.hover`'s step and leave hover painting nothing. That
    // was built on a misreading of the variable collection: `surface.subtle` is
    // grey 100, `action.secondary.hover` is grey 200, and neither moved in the sync.
    // Both fills are visible on both variants in both themes.
    '&:enabled:hover': {
      background: semantics.color.action.secondary.hover,
    },
    '&:focus-visible': {
      background: semantics.color.action.secondary.hover,
      // Replaces the user-agent ring. Without this the browser paints its own
      // outline on the 16px frame as well, so keyboard focus shows two rings.
      outline: 'none',
    },
    // An inset shadow, not an outline: `outline-offset: 0` would put the ring's
    // inner edge on the target boundary and grow outward, past the chip's own
    // edge. Inset keeps all 2px inside the 24×24 target.
    '&:focus-visible::after': {
      boxShadow: `inset 0 0 0 ${FOCUS_RING} ${semantics.color.focus.ring.base}`,
    },
  },
})

export const glyphStyle = style({
  blockSize: GLYPH_SIZE,
  inlineSize: GLYPH_SIZE,
})

export type ChipVariant = NonNullable<ChipVariants['variant']>
type ChipVariants = NonNullable<RecipeVariants<typeof chipRecipe>>

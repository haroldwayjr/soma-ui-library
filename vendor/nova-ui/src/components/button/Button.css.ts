import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// Every variant carries a 1px border (transparent where it is not drawn).
// Icon-only squares size the *border box* to `size.input`; padding must give
// that stroke back or a 20px `icon.sm` clips in an 18px content box
// (40 − 10 − 10 − 2). Same compensation TextInput uses when the stroke sits
// inside `box-sizing: border-box`.
const REST_STROKE = '1px'

// The label needs its own element because the trim applies to the box that formats
// the line — on the flex root it does nothing. Trimming makes a single line's
// height independent of leading, which is what removes the 1px centering bug at the
// source. ADR 0003. Badge and Chip carry the same treatment.
const labelStyle = style({
  textBoxEdge: 'cap alphabetic',
  textBoxTrim: 'trim-both',
})

// Type lives on the label, not the root. IconButton shares this recipe's
// fills, rings, and `minBlockSize` without a line-height strut. Square
// geometry is the `iconOnly` compound — labeled padding would stay a pill.
export const labelRecipe = recipe({
  base: labelStyle,
  variants: {
    size: {
      medium: semantics.text.buttonMedium,
      small: semantics.text.buttonSmall,
    },
  },
})

// Icon slots and the loading spinner share this box: fixed square, shrink-proof,
// sized off `size.icon` so a consumer's icon element never has to carry its own
// dimensions. Soma binds both slots to `icon/sm` (medium) / `icon/xs` (small) and
// keeps that size even when a consumer swaps the glyph — see the component
// description on the Button node.
const iconSlotStyle = style({
  alignItems: 'center',
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  // A sized parent does not constrain a sized child — `Icon.css.ts` sets its
  // own `blockSize` / `inlineSize` on the `<svg>` itself, same note as that
  // file's `box()` comment. Forcing the immediate child to fill the slot (and
  // clipping anything that still doesn't fit) is what actually keeps "the slot
  // keeps that size" true for any consumer element, not just `@nova/ui`'s own
  // `Icon`.
  overflow: 'hidden',
})

globalStyle(`${iconSlotStyle} > *`, {
  blockSize: '100%',
  inlineSize: '100%',
})

export const iconRecipe = recipe({
  base: iconSlotStyle,
  variants: {
    size: {
      medium: {
        blockSize: semantics.size.icon.sm,
        inlineSize: semantics.size.icon.sm,
      },
      small: {
        blockSize: semantics.size.icon.xs,
        inlineSize: semantics.size.icon.xs,
      },
    },
  },
})

const spin = keyframes({
  '100%': { transform: 'rotate(360deg)' },
})

// A local CSS spinner rather than a new shared component — no indeterminate
// progress primitive exists in `libs/ui` yet (`Progress` is determinate only),
// and standing one up is a bigger job than Button's loading state needs. `currentColor`
// keeps it in step with the label across every tone/variant without its own
// color binding. Does not honor `prefers-reduced-motion`; that gate lands with
// the shared spinner, not this stand-in. Revisit as a shared primitive if a
// second consumer needs one.
export const spinnerStyle = style({
  animationDuration: '0.6s',
  animationIterationCount: 'infinite',
  animationName: spin,
  animationTimingFunction: 'linear',
  borderColor: 'currentcolor',
  borderRadius: '50%',
  borderStyle: 'solid',
  borderTopColor: 'transparent',
  borderWidth: '2px',
})

// `variant` chooses the shape, `tone` chooses the meaning, and the fill lives in
// the compound of the two — a contained danger button and an outlined danger one
// share a tone but almost no color. Keeping the fills in `compoundVariants` is
// what stops a `tone` rule from having to undo a `variant` rule.
// Pressed selectors use `&&` so they outrank hover when both pseudo-classes
// match; object-key sorting otherwise emits hover after active.
//
// `loading` sets `aria-busy` rather than `disabled` (see `Button.tsx`), so
// hover/pressed need their own guard against it — `:disabled` alone would let
// a busy button still paint the interactive-hover/pressed fill.
const NOT_INTERACTIVE = ':not(:disabled):not([aria-busy="true"])'

// `outlined` and `text` differ only in what they paint at rest — their
// interaction fills are the same two neutral steps — so the pair is declared
// once here instead of being repeated in both variants.
const unfilledInteraction = {
  [`&&:active${NOT_INTERACTIVE}`]: {
    background: semantics.color.action.secondary.pressed,
  },
  [`&:hover${NOT_INTERACTIVE}`]: {
    background: semantics.color.surface.subtle,
  },
}

// The brand label darkens one step on hover and drops back to its resting
// step while pressed. `&&:active` has to restore it explicitly: pressing also
// matches `:hover`, so without this the hover color would hold through the
// press.
const brandLabelInteraction = {
  selectors: {
    [`&&:active${NOT_INTERACTIVE}`]: {
      color: semantics.color.action.primary.base,
    },
    [`&:hover${NOT_INTERACTIVE}`]: {
      color: semantics.color.action.primary.hover,
    },
  },
}

export const buttonRecipe = recipe({
  base: {
    ':disabled': {
      color: semantics.color.text.disabled,
      cursor: 'not-allowed',
    },
    alignItems: 'center',
    // UA chrome differs on `<button>` vs `<a>`. Reset here so LinkButton
    // (and any later host) cannot pick up a different margin or system
    // button look. Underline stays a LinkButton-local reset — `<button>`
    // is not underlined.
    appearance: 'none',
    // Every variant carries the same 1px border, transparent where the variant
    // does not draw one, so swapping variants never shifts layout by a pixel.
    border: '1px solid transparent',
    borderRadius: semantics.radius.control,
    cursor: 'pointer',
    display: 'inline-flex',
    justifyContent: 'center',
    margin: 0,
    selectors: {
      // Loading keeps the tone-colored fill (Soma's own loading state does,
      // too — the spinner is the only new affordance) and does not go
      // `not-allowed`; it is a busy `pointer`, not a blocked one.
      '&[aria-busy="true"]': {
        cursor: 'wait',
      },
    },
  },
  compoundVariants: [
    // Every property here is scoped to `:not(:disabled)` (rest fill/color) or
    // `NOT_INTERACTIVE` (hover/pressed) rather than left bare. `contained`'s
    // own `:disabled` rule (below, in `variants.variant.contained`) and this
    // compound both target the same combined class list at equal specificity,
    // so an unguarded property here would tie with — and by source order,
    // beat — the disabled rule. A fourth contained tone that forgot a guard
    // would keep its live fill when disabled instead of Soma's universal
    // disabled surface.
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            background: semantics.color.action.primary.base,
            color: semantics.color.text.primary.onBrand,
          },
          [`&&:active${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.primary.pressed,
            // The pressed fill inverts in dark — lighter than rest — so the
            // label cannot stay on the resting on-brand role.
            color: semantics.color.text.onBrand.pressed,
          },
          [`&:hover${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.primary.hover,
          },
        },
      },
      variants: { tone: 'brand', variant: 'contained' },
    },
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            background: semantics.color.action.danger.base,
            color: semantics.color.text.onDanger.base,
          },
          [`&&:active${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.danger.pressed,
            color: semantics.color.text.onDanger.pressed,
          },
          [`&:hover${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.danger.hover,
          },
        },
      },
      variants: { tone: 'danger', variant: 'contained' },
    },
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            background: semantics.color.action.success.base,
            color: semantics.color.text.onSuccess.base,
          },
          [`&&:active${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.success.pressed,
            color: semantics.color.text.onSuccess.pressed,
          },
          [`&:hover${NOT_INTERACTIVE}`]: {
            background: semantics.color.action.success.hover,
          },
        },
      },
      variants: { tone: 'success', variant: 'contained' },
    },
    // `:not(:disabled)` here, not a bare `borderColor` — this compound and
    // `outlined`'s own `:disabled` rule (below) both target the combined
    // class list at equal specificity, so without the guard, source order
    // alone decides the winner and a disabled outlined button could keep its
    // tone-colored border instead of the universal disabled one Soma's master
    // shows for every tone.
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            borderColor: semantics.color.border.brand.base,
          },
        },
      },
      variants: { tone: 'brand', variant: 'outlined' },
    },
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            borderColor: semantics.color.border.danger.base,
          },
        },
      },
      variants: { tone: 'danger', variant: 'outlined' },
    },
    {
      style: {
        selectors: {
          '&:not(:disabled)': {
            borderColor: semantics.color.border.success.base,
          },
        },
      },
      variants: { tone: 'success', variant: 'outlined' },
    },
    // The brand label steps on hover; the brand *glyph* does not, so these are
    // keyed `iconOnly: false` and the icon-only compounds below hold their
    // resting color through hover. Keyed on `variant` as well because a
    // contained button's label is on the fill and takes the on-brand pair
    // instead.
    {
      style: brandLabelInteraction,
      variants: { iconOnly: false, tone: 'brand', variant: 'outlined' },
    },
    {
      style: brandLabelInteraction,
      variants: { iconOnly: false, tone: 'brand', variant: 'text' },
    },
    // A glyph takes an `icon.*` role where a label takes `text.*` / `action.*`.
    // Only `success` currently resolves to a different value (its icon role is
    // a step lighter in light), but all three are bound so the rule stays "a
    // glyph is an icon role" rather than a one-tone exception.
    //
    // Deliberately unguarded: `contained` scopes its own on-fill color under
    // `:not(:disabled)`, which outranks these by specificity rather than by
    // source order, so a contained icon button keeps its on-fill glyph.
    {
      style: { color: semantics.color.icon.brand },
      variants: { iconOnly: true, tone: 'brand' },
    },
    {
      style: { color: semantics.color.icon.danger },
      variants: { iconOnly: true, tone: 'danger' },
    },
    {
      style: { color: semantics.color.icon.success },
      variants: { iconOnly: true, tone: 'success' },
    },
    {
      style: {
        blockSize: semantics.size.input.medium,
        inlineSize: semantics.size.input.medium,
        paddingBlock: `calc(${semantics.space[10]} - ${REST_STROKE})`,
        paddingInline: `calc(${semantics.space[10]} - ${REST_STROKE})`,
      },
      variants: { iconOnly: true, size: 'medium' },
    },
    {
      style: {
        blockSize: semantics.size.input.small,
        inlineSize: semantics.size.input.small,
        paddingBlock: `calc(${semantics.space[8]} - ${REST_STROKE})`,
        paddingInline: `calc(${semantics.space[8]} - ${REST_STROKE})`,
      },
      variants: { iconOnly: true, size: 'small' },
    },
  ],
  // Declared so the compounds above can key on `iconOnly: false`. `ButtonBase`
  // omits the prop for a labeled button, and a compound matches on the
  // *resolved* selection — `false !== undefined`, so without a default the
  // labeled-only compounds would never apply. No `false` style exists, so this
  // adds no class.
  defaultVariants: {
    iconOnly: false,
  },
  variants: {
    // Internal: `ButtonBase` sets this when there is no label. Not a public
    // `Button` prop — callers use `IconButton`. Square + `radius.control`
    // (`full`) is a circle; Soma's Icon Buttons page (2015:2052) is 40×40
    // with 10px padding at medium.
    iconOnly: {
      true: {
        aspectRatio: '1',
      },
    },
    size: {
      // Bound to `size.input`, not a Button-local literal: Soma's anatomy note
      // states the reason directly — "Care App medium buttons are 40px tall to
      // align with input and select fields" — which is exactly the role
      // `size.input` already exists to express. Was 32px/28px (`size.input`
      // did not exist yet); Soma's Buttons page re-synced these 2026-08-19.
      medium: {
        gap: semantics.space[8],
        minBlockSize: semantics.size.input.medium,
        padding: `${semantics.space[10]} ${semantics.space[16]}`,
      },
      small: {
        gap: semantics.space[4],
        minBlockSize: semantics.size.input.small,
        padding: `${semantics.space[8]} ${semantics.space[12]}`,
      },
    },
    // Tone drives the focus ring and, on the two unfilled variants, the label.
    // A contained button overrides the label in the compound above, because its
    // label sits on the fill rather than on the page.
    //
    // Brand's label is the **action** role, not `text.brand.*`: an unfilled
    // brand button's label *is* the action color, and it steps to
    // `action.primary.hover` alongside the fill (see `brandLabelInteraction`).
    // Danger and success take text roles instead, and `text.success.base` is a
    // step darker than `icon.success` on purpose — the icon-only compounds are
    // where that split is paid out.
    //
    // `success` shares `focus.ring.base` with `brand`; there is no
    // `focus.ring.success` role to bind. `danger` keeps `focus.ring.danger`,
    // which is Nova-only — the design file rings every tone in blue. Left as
    // shipped because it reads as a deliberate accessibility divergence; check
    // that before folding it into `base`.
    tone: {
      brand: {
        color: semantics.color.action.primary.base,
        selectors: {
          '&:focus-visible': {
            outline: `2px solid ${semantics.color.focus.ring.base}`,
            outlineOffset: '2px',
          },
        },
      },
      danger: {
        color: semantics.color.text.danger.base,
        selectors: {
          '&:focus-visible': {
            outline: `2px solid ${semantics.color.focus.ring.danger}`,
            outlineOffset: '2px',
          },
        },
      },
      success: {
        color: semantics.color.text.success.base,
        selectors: {
          '&:focus-visible': {
            outline: `2px solid ${semantics.color.focus.ring.base}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    // Descending visual weight: a filled surface, a neutral surface with an
    // outline, then no surface at all until the pointer is over it. Named
    // `text` (Soma's name) rather than `ghost` — re-synced 2026-08-19.
    variant: {
      // Disabled lives here, once, rather than repeated in each of the three
      // tone compounds above — those scope their own fill/color entirely
      // under `:not(:disabled)`, so this is the only rule that ever paints a
      // disabled `contained` button, and a fourth tone that forgets a guard
      // still falls back to this one instead of keeping a live fill.
      contained: {
        ':disabled': {
          background: semantics.color.surface.disabled,
          borderColor: semantics.color.border.disabled,
        },
      },
      outlined: {
        ':disabled': {
          background: semantics.color.surface.disabled,
          borderColor: semantics.color.border.disabled,
        },
        // Rest is the page surface, not a grey — the neutral steps are
        // hover/pressed only.
        background: semantics.color.surface.default,
        selectors: unfilledInteraction,
      },
      // No fill at rest and no `action.ghost.*` family: the same neutral steps
      // `outlined` uses are what a text button wants once the pointer is over
      // it. Design confirmed the reuse — "it shares the same states (minus the
      // outline border on rest) — intentional, to keep our semantics minimal"
      // — so read it as deliberate, not as an oversight. `transparent` is the
      // absence of a fill rather than a color choice, which is why it is not a
      // token. Disabled is the one state where `text` still paints a surface.
      text: {
        ':disabled': {
          background: semantics.color.surface.disabled,
          borderColor: semantics.color.border.disabled,
        },
        background: 'transparent',
        selectors: unfilledInteraction,
      },
    },
  },
})

export type ButtonSize = NonNullable<ButtonVariants['size']>

export type ButtonTone = NonNullable<ButtonVariants['tone']>
export type ButtonVariant = NonNullable<ButtonVariants['variant']>
type ButtonVariants = NonNullable<RecipeVariants<typeof buttonRecipe>>

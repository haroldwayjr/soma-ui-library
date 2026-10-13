import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// `Card.Root` supplies the only visual chrome — border, radius, surface, and
// padding. The parts below are layout plus the type `Card.HeaderTitle` /
// `Card.Body` own. Presence of a part (not a boolean prop) is what turns a
// gap on, since `Root`'s `gap` only applies between children that are
// actually rendered.
//
// `variant=ai` is the sparkle-card treatment (Figma Variant A): white base +
// `surface.ai.gradient.*` wash at ~120°, and `gradient/ai/border` stroke
// (`border.ai.start` → `border.ai.end`). Sparkles use `icon.ai` (purple/600).
export const rootRecipe = recipe({
  base: {
    borderRadius: semantics.radius.surface,
    display: 'flex',
    flexDirection: 'column',
    gap: semantics.space[16],
    padding: semantics.space[16],
  },
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      ai: {
        // Figma `radius/lg` (10px) — `surface` is 8px; no dedicated card-lg token yet.
        borderRadius: semantics.radius.chipDismissFocusRing,
        gap: semantics.space[8],
        padding: semantics.space[12],
        // Variant A paint stack (padding-box) + AI border gradient (border-box).
        background: [
          `radial-gradient(120% 80% at 100% 0%, ${semantics.color.surface.ai.gradient[4]} 0%, transparent 55%) padding-box`,
          `radial-gradient(100% 90% at 0% 100%, ${semantics.color.surface.ai.gradient[2]} 0%, transparent 55%) padding-box`,
          `linear-gradient(120deg, ${semantics.color.surface.ai.gradient[4]} 8%, ${semantics.color.surface.default} 50%, ${semantics.color.surface.ai.gradient[2]} 92%) padding-box`,
          `linear-gradient(${semantics.color.surface.default}, ${semantics.color.surface.default}) padding-box`,
          `linear-gradient(120deg, ${semantics.color.border.ai.start} 25%, ${semantics.color.border.ai.end} 100%) border-box`,
        ].join(', '),
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderWidth: '1px',
      },
      default: {
        background: semantics.color.surface.raised,
        border: `1px solid ${semantics.color.border.subtle}`,
      },
    },
  },
})

export type CardRootVariant = NonNullable<
  NonNullable<RecipeVariants<typeof rootRecipe>>['variant']
>

/** @deprecated Prefer `rootRecipe({ variant: 'default' })`. Kept for any external style imports. */
export const rootStyle = rootRecipe({ variant: 'default' })

// Row for `Card.HeaderTitle` plus an optional trailing control. The title grows
// (`flex-grow` + `min-width: 0` on `titleStyle`) so a long label wraps or
// truncates instead of shoving the action off the row; `space-between` would
// only rhyme with that for exactly two children and would not shrink the
// title. Default `justify-content: flex-start` is the start-packed row.
export const headerStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[8],
  width: '100%',
})

export const titleStyle = style({
  ...semantics.text.cardTitle,
  color: semantics.color.text.primary.base,
  flexGrow: 1,
  margin: 0,
  minWidth: 0,
  overflowWrap: 'break-word',
})

// Default foreground for plain text and `Typography` that inherits. Nested
// components that paint their own color (Button, Badge, …) are unaffected.
// No type scale of its own — a list or widget inside the body keeps the
// type the consumer chose. `min-width: 0` lets that content shrink in the
// column flex instead of overflowing the chrome.
export const bodyStyle = style({
  color: semantics.color.text.secondary.base,
  minWidth: 0,
  width: '100%',
})

export const footerStyle = style({
  alignItems: 'center',
  display: 'flex',
  gap: semantics.space[8],
  justifyContent: 'flex-end',
  width: '100%',
})

/** Leading sparkle on `Card.Ai` — semantic `icon/ai` → purple/600. */
export const aiCardIconStyle = style({
  color: semantics.color.icon.ai,
  flexShrink: 0,
})

/** AI header title — subtitle2 metrics at semibold (Figma 14/20/600), not cardTitle. */
export const aiCardTitleStyle = style({
  flexGrow: 0,
  selectors: {
    [`${titleStyle}&`]: {
      ...semantics.text.h5,
      color: semantics.color.text.primary.base,
    },
  },
})

export const aiCardBodyStyle = style({
  ...semantics.text.body2,
  color: semantics.color.text.secondary.base,
  display: 'flex',
  flexDirection: 'column',
  // Body copy → Show more/less (`inset/md` / 12)
  gap: semantics.space[12],
  margin: 0,
})

export const aiCardPlainStyle = style({
  margin: 0,
})

/** Collapsed plain body — line clamp count set inline via `WebkitLineClamp`. */
export const aiCardPlainCollapsedStyle = style({
  display: '-webkit-box',
  margin: 0,
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
})

/**
 * Custom disc bullets (not `list-style`) so the marker centers on the first
 * body2 line (12/18) instead of sitting low on the marker baseline.
 */
export const aiCardListStyle = style({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
})

export const aiCardListItemStyle = style({
  display: 'flex',
  gap: semantics.space[8],
  selectors: {
    '&:not(:last-child)': {
      marginBottom: semantics.space[4],
    },
    '&::before': {
      backgroundColor: 'currentColor',
      borderRadius: '9999px',
      // Optical center on body2 first line (12/18); (18 − 4) / 2 = 7
      content: '""',
      flexShrink: 0,
      height: 4,
      marginBlockStart: 7,
      width: 4,
    },
  },
})

/** Block Show more / Show less under the body. */
export const aiCardLinkBlockStyle = style({
  alignSelf: 'flex-start',
})

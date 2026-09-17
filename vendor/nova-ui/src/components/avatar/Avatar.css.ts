import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// A circle, so `50%` rather than a radius role — the same reasoning Badge
// gives its own status dot: this is a shape, not a corner, and there is no
// scale for it to sit on.
const CIRCLE_RADIUS = '50%'

// The stroke is painted as an inset outline rather than a border, for the
// reason Badge and Chip record: Figma draws a frame's stroke inside the
// frame, so the masters' 20 / 32 / 40 already contain it. A CSS `border`
// would add its 1px to each edge, and `box-sizing` cannot correct that — it
// only changes how a *specified* size is counted, not what the border paints.
const STROKE = '1px'
const STROKE_OFFSET = `-${STROKE}`

const RING_WIDTH = '2px'

// The presence dot's own diameter, and the constraint Avatar.tsx enforces:
// `presence` is a documented no-op at `sm` because a ringed dot this size
// would cover most of a 20px edge, so no `sm` variant exists here at all.
const DOT_SIZE = {
  lg: '14px',
  md: '12px',
}

// Root carries the size and the stroke, but must not be the box that clips to
// the circle — a presence dot anchored to Root's own corner would be clipped
// along with the photo. `clipStyle` (below) owns the clip instead, as an
// inset child, leaving Root free to host the dot as a second, unclipped
// child. See the README's Anatomy note.
const rootStyle = style({
  alignItems: 'center',
  borderRadius: CIRCLE_RADIUS,
  display: 'inline-flex',
  flexShrink: 0,
  justifyContent: 'center',
  outlineColor: semantics.color.border.subtle,
  outlineOffset: STROKE_OFFSET,
  outlineStyle: 'solid',
  outlineWidth: STROKE,
  position: 'relative',
})

export const rootRecipe = recipe({
  base: rootStyle,
  variants: {
    size: {
      lg: {
        blockSize: semantics.size.avatar.lg,
        inlineSize: semantics.size.avatar.lg,
      },
      md: {
        blockSize: semantics.size.avatar.md,
        inlineSize: semantics.size.avatar.md,
      },
      sm: {
        blockSize: semantics.size.avatar.sm,
        inlineSize: semantics.size.avatar.sm,
      },
    },
  },
})

// The clip boundary for the photo and both fallback sub-states. Sized to
// Root exactly (`inset: 0`) rather than repeating a size variant, so Root's
// own size is the only place a diameter is declared.
export const clipStyle = style({
  alignItems: 'center',
  background: semantics.color.surface.muted,
  borderRadius: CIRCLE_RADIUS,
  display: 'flex',
  inset: 0,
  justifyContent: 'center',
  overflow: 'hidden',
  position: 'absolute',
})

export const imageStyle = style({
  blockSize: '100%',
  display: 'block',
  inlineSize: '100%',
  objectFit: 'cover',
})

// Shared by both fallback sub-states; the size variant below only supplies
// the initials type scale, which the silhouette does not use.
const fallbackBase = style({
  alignItems: 'center',
  blockSize: '100%',
  color: semantics.color.text.primary.base,
  display: 'flex',
  inlineSize: '100%',
  justifyContent: 'center',
})

export const initialsRecipe = recipe({
  base: fallbackBase,
  variants: {
    size: {
      lg: semantics.text.avatarLg,
      md: semantics.text.avatarMd,
      sm: semantics.text.avatarSm,
    },
  },
})

// The silhouette is drawn locally from two circles rather than reused from
// `Icon` — `icon/comms/user` draws a person inside a ring, which
// double-circles inside a circular avatar, and Icon's own README excludes
// avatar-shaped artwork from its scope. See the Avatar README's Token gaps.
export const silhouetteStyle = style([
  fallbackBase,
  { color: semantics.color.icon.tertiary },
])

export const silhouetteGlyphStyle = style({
  blockSize: '100%',
  display: 'block',
  inlineSize: '100%',
})

// Anchored to Root's own corner, outside `AvatarClip`, so the circular clip
// above never cuts it off. The 2px ring is `surface.default` regardless of
// tone — see the README's open surface-aware-ring gap for hosts that are not
// `surface.default`.
const presenceBase = style({
  borderColor: semantics.color.surface.default,
  borderRadius: CIRCLE_RADIUS,
  borderStyle: 'solid',
  borderWidth: RING_WIDTH,
  boxSizing: 'border-box',
  insetBlockEnd: 0,
  insetInlineEnd: 0,
  position: 'absolute',
})

export const presenceRecipe = recipe({
  base: presenceBase,
  variants: {
    presence: {
      // Solid fill — the entire dot, inside the ring, reads as one tone.
      busy: {
        background: semantics.color.surface.default,
        boxShadow: `inset 0 0 0 ${RING_WIDTH} ${semantics.color.status.busy}`,
      },
      // Shape carries the meaning too, not just color, per WCAG 1.4.1: online
      // is a solid fill, offline a 1px hollow outline, busy a 2px inner ring —
      // drawn here as an inset box-shadow rather than the file's separate
      // "Status outline" / "Status ring" glyphs, which is a CSS-only redraw of
      // the same two shapes rather than a shipped asset.
      offline: {
        background: semantics.color.surface.default,
        boxShadow: `inset 0 0 0 1px ${semantics.color.status.offline}`,
      },
      online: { background: semantics.color.status.online },
    },
    size: {
      lg: { blockSize: DOT_SIZE.lg, inlineSize: DOT_SIZE.lg },
      md: { blockSize: DOT_SIZE.md, inlineSize: DOT_SIZE.md },
    },
  },
})

export type AvatarPresence = NonNullable<PresenceVariants['presence']>
export type AvatarSize = NonNullable<RootVariants['size']>
type PresenceVariants = NonNullable<RecipeVariants<typeof presenceRecipe>>
type RootVariants = NonNullable<RecipeVariants<typeof rootRecipe>>

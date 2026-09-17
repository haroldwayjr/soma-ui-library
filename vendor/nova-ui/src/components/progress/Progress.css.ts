import { style } from '@vanilla-extract/css'
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes'

import { semantics } from '../../tokens/semantic.css'

// The file's own choice, not a Nova declaration: the component description
// states the sizes as `space4` / `space8` directly, unlike Badge's declared
// height, which exists to work around a stroke this component does not have.
const TRACK_BLOCK_SIZE = {
  medium: semantics.space[8],
  small: semantics.space[4],
} as const

// PROVISIONAL. The Motion family is unpublished, so there is no duration or
// easing role to bind — same gap Switch's `THUMB_MOTION` carries. This figure
// is the file's own interim number for the value-change transition, not
// Nova's invention; promote both the duration and the reduced-motion gate
// below to a shared motion role when one exists.
const VALUE_CHANGE_MOTION = '250ms ease-out'

export const rootStyle = style({
  alignItems: 'center',
  display: 'flex',
  // The Track fills whatever width the consumer gives the Root — Progress
  // owns no fixed geometry the way Badge or Switch do.
  inlineSize: '100%',
  // Positioned so the hidden `Progress.Label` (see `hiddenLabelStyle`) clips
  // against this box rather than whatever ancestor happens to be positioned —
  // an unpositioned Root would let a distant relative-positioned parent decide
  // where that 1px clip box lands.
  position: 'relative',
})

// Only while `layout="labeled"` — Track and Value are the two in-flow
// children a gap can sit between; `layout="bare"` has one in-flow child (the
// hidden Label sits out of flow, absolutely positioned) and must render no
// gap at all, per the README's "no trailing gap" acceptance criterion.
export const labeledGapStyle = style({
  gap: semantics.space[8],
})

// Every disabled-state selector below is scoped to `${rootStyle}[data-disabled]`
// rather than a bare `[data-disabled]`, because the flag lives on Root, not on
// the element being styled. An unscoped `[data-disabled] &` descendant
// selector matches *any* disabled ancestor — a disabled Field wrapping an
// otherwise-enabled Progress would mute it too. Badge, Chip, and Switch don't
// need this because their flag and their styled element are the same node.
const disabledRoot = `${rootStyle}[data-disabled]`

// Base UI's Indicator sets its own `width` / `insetInlineStart: 0` /
// `height: inherit` inline, ahead of anything this class declares — see
// `indicatorStyle` below. Track only needs to be the clipping, positioned
// parent those inline styles resolve against.
export const trackRecipe = recipe({
  base: {
    background: semantics.color.surface.muted,
    // `control` is documented for controls the pointer operates directly, and
    // Progress is read-only — a known imprecision, bound anyway rather than
    // blocking on a new role. See the README's Semantic tokens section.
    borderRadius: semantics.radius.control,
    flex: 1,
    // The pill's rounded corners are what turn Indicator's plain rectangle
    // into a rounded fill — without this, a partial value draws its own
    // capsule floating inside the track, and a full value can overshoot the
    // track's own corner radius.
    overflow: 'hidden',
    position: 'relative',
    selectors: {
      [`${disabledRoot} &`]: {
        background: semantics.color.surface.disabled,
      },
    },
  },
  variants: {
    size: {
      medium: { blockSize: TRACK_BLOCK_SIZE.medium },
      small: { blockSize: TRACK_BLOCK_SIZE.small },
    },
  },
})

// No size variant: height comes from Base UI's own `height: inherit` inline
// style, which resolves against whichever `size` the Track recipe applied.
export const indicatorStyle = style({
  '@media': {
    // Load-bearing, not decorative: without the guard, reduced motion would
    // still see the width jump animate, only slower than 250ms would not fix.
    '(prefers-reduced-motion: no-preference)': {
      transition: `width ${VALUE_CHANGE_MOTION}`,
    },
  },
  background: semantics.color.action.primary.base,
  // Base UI positions Indicator with an inline `inset-inline-start: 0`, which
  // only takes effect once this class makes the element positioned.
  position: 'absolute',
  selectors: {
    [`${disabledRoot} &`]: {
      background: semantics.color.action.primary.disabled,
    },
  },
})

export const valueStyle = style({
  ...semantics.text.subtitle3,
  color: semantics.color.text.secondary.base,
  // The value is the one piece of Progress that changes on its own, and
  // "4%" is narrower than "100%" — without a reserved width, the Track
  // (`flex: 1`) reflows by that difference on every update, so the bar
  // visibly jitters as it fills. Tabular figures make every digit the same
  // width, and the reserved space plus end alignment keep the Track's edge
  // still regardless of which digits are showing.
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
  minInlineSize: '4ch',
  selectors: {
    [`${disabledRoot} &`]: {
      color: semantics.color.text.disabled,
    },
  },
  textAlign: 'end',
  whiteSpace: 'nowrap',
})

// Standard visually-hidden treatment: present to assistive technology, removed
// from layout and paint. `Progress.Label` mounts only while `children` is
// supplied (see Progress.tsx) — this class is what keeps it invisible even
// though it renders, rather than an argument for skipping it.
export const hiddenLabelStyle = style({
  border: 0,
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
})

export type ProgressSize = NonNullable<TrackVariants['size']>
type TrackVariants = NonNullable<RecipeVariants<typeof trackRecipe>>

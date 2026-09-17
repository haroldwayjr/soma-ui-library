import { createGlobalTheme } from '@vanilla-extract/css'

import { lightColors } from './colors'
import { primitives } from './primitives'

type FontSizePx = keyof typeof primitives.font.size
type FontWeight = keyof typeof primitives.font.weight

// Design authors text styles as a px size over a px line height. Leading is
// stored as the unitless ratio so a variant keeps its proportions when the
// reader scales text up; the px arguments stay verbatim from the design file so
// the call sites below diff against it by eye.
//
// The ratio rounds *up*, never to nearest: rounded down it multiplies back to just
// under the whole pixel, and Blink's 1/64px floor then costs a further 0.016px,
// which showed up as labels sitting a pixel high on 1x displays. ADR 0003.
const textStyle = (
  sizePx: FontSizePx,
  lineHeightPx: number,
  weight: FontWeight,
): {
  fontSize: string
  fontWeight: string
  lineHeight: string
} => ({
  fontSize: primitives.font.size[sizePx],
  fontWeight: primitives.font.weight[weight],
  lineHeight: String(Math.ceil((lineHeightPx / sizePx) * 1e5) / 1e5),
})

// Stacking order is declared once, as an order. Every number below is derived
// from this array's index, so adding a layer or moving one is an edit to the
// sequence rather than a choice of integer — there is no gap to leave room in
// and no literal to pick. ADR 0004.
//
// These are roles, not components: `dropdown` is every anchored non-modal popup,
// not Select's in particular. A component that wants its own step has to argue
// for a new role here, which is the point.
const LAYER_ORDER = [
  'raised',
  'sticky',
  'dropdown',
  'tooltip',
  'dialog',
  'toast',
] as const

const layer = (role: (typeof LAYER_ORDER)[number]): string =>
  String(LAYER_ORDER.indexOf(role) + 1)

export const semantics = createGlobalTheme(':root', {
  // Roles and their light values; `colors.ts` holds both themes and
  // `themes.css.ts` applies dark over the top. Everything below this key is
  // theme-independent and declared once.
  color: lightColors,
  // Mirrored 1:1 while the first floating components establish role names.
  // Components still consume these variables rather than primitive recipes.
  //
  // Depth only. Stacking order is `layer` below, and the two are not the same
  // question — two surfaces can share a shadow and still need a defined order
  // between them. Do not reach for an elevation step to push something in front
  // of something else.
  elevation: {
    '2xl': primitives.elevation['2xl'],
    '3xl': primitives.elevation['3xl'],
    inner: primitives.elevation.inner,
    lg: primitives.elevation.lg,
    md: primitives.elevation.md,
    sm: primitives.elevation.sm,
    soft: primitives.elevation.soft,
    xl: primitives.elevation.xl,
    xs: primitives.elevation.xs,
  },
  font: {
    family: {
      body: primitives.font.family.body,
    },
  },
  // Stacking order. The **only** source of a `z-index` in the workspace — a
  // literal anywhere in `apps/**` or `libs/**` is a lint error, which covers an
  // inline `style={{ zIndex: 3 }}` in feature code as well as a recipe in here.
  // Base UI ships none of its own (verified: the one occurrence in the package is
  // Slider's overlapping thumbs), so every layer decision is ours.
  //
  // Deliberately separate from `elevation`, which it was previously conflated
  // with. Elevation is how deep a surface *looks*; layer is what it paints
  // *over*. Select's popup and Tooltip need a different stacking order despite
  // sitting at different elevation steps (`lg` and `sm` respectively) — the two
  // questions are independent, and one scale cannot express both. See
  // Tooltip's README for why they do not, in fact, share a shadow.
  //
  // There is no nesting step, on purpose. A popup opened inside another popup
  // does not need a higher number: Base UI resolves a portal's container as
  // `container ?? parentPortalNode ?? document.body`, so it nests in the DOM and
  // inherits its parent's place in the order. This scale orders independent
  // top-level surfaces only — ADR 0004.
  layer: {
    dialog: layer('dialog'),
    dropdown: layer('dropdown'),
    raised: layer('raised'),
    sticky: layer('sticky'),
    toast: layer('toast'),
    tooltip: layer('tooltip'),
  },
  radius: {
    // Badge binds Soma `radius/sm` (6px) in both sizes. Named for the component
    // rather than the step, following `checkbox` below: `input` is already 6px,
    // but a badge is not an input, and the day the input corner is confirmed
    // separately these must be free to move apart.
    badge: primitives.radius[6],
    // A selection box is a fixed small corner, not the pill `control` uses.
    // Figma calls it `radius/xs`. Named for the component rather than a general
    // job, so a later control claims its own role instead of silently inheriting
    // a corner chosen for a checkbox.
    checkbox: primitives.radius[4],
    // The focus ring sits outside the box on the larger hit target. Concentric
    // rounded rects need the outer radius to be the inner one plus the gap, so
    // this is `checkbox` + the 2px ring gap rather than an independent choice.
    // Figma publishes it as `radius/sm`.
    checkboxFocusRing: primitives.radius[6],
    // Chip's dismiss button — the 16×16 visual frame, Soma `radius/sm`. A fourth
    // 6px role rather than a reach for `badge` or `input`, on the same reasoning
    // those two carry: a dismiss button is neither, and a confirmed input corner
    // must not drag it along.
    chipDismiss: primitives.radius[6],
    // Concentric with `chipDismiss`, following `checkboxFocusRing`: the ring sits
    // on the 24×24 hit target, so its radius is the frame's 6px plus the 4px of
    // overhang. Not an independent corner — changing either of those changes this.
    chipDismissFocusRing: primitives.radius[10],
    // The design file's stated defaults: pill for controls the pointer acts on
    // directly (buttons, tags), and the md step for containers. It asks for both
    // to be confirmed per component during migration, so expect these to split
    // — an input almost certainly wants a fixed corner rather than a pill, which
    // is a third role rather than an override at the call site.
    control: primitives.radius.full,
    // Text Input sticker uses `radius/sm` (6px); the Field composition uses
    // `radius/md` (8px). 6px is the pick until design confirms. See TextField.
    input: primitives.radius[6],
    // Text links focus frame (`radius/xs`). Named for Link / ButtonLink rather
    // than reused from `checkbox` or `tooltip`: those corners have no reason to
    // move with a text-link ring just because they start at the same step.
    link: primitives.radius[4],
    // A radio is a circle, so one role covers both the 16×16 control and the
    // 24×24 focus ring — a circle's concentric ring is also a circle, unlike the
    // checkbox where the ring needs `checkbox` + the gap. Distinct from `control`
    // (also a pill) because this is a selection control, not a pointer target,
    // and the two would diverge if `control` is ever confirmed to a fixed corner.
    radio: primitives.radius.full,
    surface: primitives.radius[8],
    // Figma's `radius/xs` — the same primitive Checkbox binds. Named for the
    // component rather than reused from `checkbox`, following that role's own
    // reasoning: a floating popup's corner and a selection control's corner
    // have no reason to move together just because they start at the same step.
    tooltip: primitives.radius[4],
  },
  // Declared control heights, in `rem` so the box tracks a reader's font-size
  // override — ADR 0003 for why the unit is load-bearing rather than stylistic, and
  // why these are declared at all instead of derived from padding or leading.
  //
  // Named `input` to match `radius.input`, which both consumers already bind. It
  // covers the whole family of boxed form controls, not the `<input>` element: Text
  // Field renders one, Select renders a `<button>`, and the point of the role is
  // that a Text Field and a Select in the same row measure identically **at every
  // font size**. They previously did not — Text Field hardcoded `40px` against
  // Select's `2.5rem`, which agree only at a 16px root and drift apart under a
  // font-size override, misaligning any form that mixes them. That comment asked
  // for this role "when a second field control confirms the measure"; Select is it.
  //
  // Deliberately *not* bound by Select's popup items, which are 2.25rem as well.
  // Same number, different job: a list row is not a control, and the day one moves
  // the other must be free to stay.
  size: {
    // Soma's `avatar.sm` / `avatar.md` / `avatar.lg`: 20 / 32 / 40. In `rem`,
    // following `size.icon` and `size.input`: the initials fallback sizes its
    // type from `text.avatar*` below, and if the circle scaled in `px` while
    // that text tracked the root font size, a reader's font-size override
    // would reopen the two-letter clip at `sm` the Avatar README warns about.
    // The two have to move together, so both are `rem`. See the Avatar
    // README's Token gaps before changing either unit on its own.
    avatar: {
      lg: '2.5rem',
      md: '2rem',
      sm: '1.25rem',
    },
    // Soma's `Icon Size` collection, transcribed: 16 / 20 / 24 / 32. `TOKENS.md`
    // asked for this family "when the first slot ships", and Icon is it.
    //
    // In `rem`, following `size.input` and ADR 0003: a glyph beside text should
    // track a reader's font-size override rather than shrinking against it. That
    // is the reason a committed glyph is one `0 0 24 24` vector with the stroke
    // pinned by `vector-effect` — at an unknown rendered px, a stroke width
    // computed from the box is not computable at author time.
    //
    // **The unit is NOT signed off** — confirmed outstanding on 2026-08-18, and
    // tracked in `COMPONENT-STATUS.md`'s blocking-decisions list as well as the Icon
    // README. Declared here rather than left out because the numbers are settled and
    // only the unit is open; a `px` ruling changes four values in one place. Do not
    // read the current unit as decided just because it is committed.
    //
    // Only the four published steps exist. The 10px and 12px chrome in Checkbox,
    // Chip, and Select is deliberately absent — Soma does not publish those, and a
    // fifth step here is how a control's decoration becomes a product glyph size.
    icon: {
      lg: '2rem',
      md: '1.5rem',
      sm: '1.25rem',
      xs: '1rem',
    },
    input: {
      // 40px and 36px at the default root font size.
      medium: '2.5rem',
      small: '2.25rem',
    },
  },
  // Keyed by px, matching the design file's pixel column: `space[24]` is a 24px
  // gap regardless of what Figma calls that step.
  space: {
    0: primitives.space[0],
    2: primitives.space[2],
    4: primitives.space[4],
    6: primitives.space[6],
    8: primitives.space[8],
    10: primitives.space[10],
    12: primitives.space[12],
    14: primitives.space[14],
    16: primitives.space[16],
    18: primitives.space[18],
    20: primitives.space[20],
    24: primitives.space[24],
    28: primitives.space[28],
    32: primitives.space[32],
    36: primitives.space[36],
    40: primitives.space[40],
    48: primitives.space[48],
    56: primitives.space[56],
    64: primitives.space[64],
    80: primitives.space[80],
    96: primitives.space[96],
  },
  // Callers spread a complete text style to keep sizing, weight, and leading
  // consistent. Named for the Figma text style; arguments mirror that file's
  // columns: size px, line-height px, weight.
  text: {
    // The initials fallback binds these rather than `h6` / `h5` / `h4` directly,
    // for the same reason Badge and Chip mint their own label roles: a heading
    // retune must not resize every avatar's initials. Sizes and weights mirror
    // the bound headings (`h6` / `h5` / `h4`) since that geometry is what the
    // `sm` two-letter clip in the Avatar README is measured against — only the
    // independence is new, not the numbers.
    avatarLg: textStyle(16, 24, 600),
    avatarMd: textStyle(14, 20, 600),
    avatarSm: textStyle(12, 16, 600),
    // Soma publishes no text style for either badge label, so both are named for
    // the component. That independence is the point: a status label must not move
    // when a heading or a display style is retuned.
    //
    // Soma's stated leading, restored. It does not place the label — Badge trims
    // the label's text box, which makes a single line's height independent of
    // leading — so this is inert today and only takes effect if a badge ever wraps.
    // See the `label` note in `Badge.css.ts`.
    badgeMedium: textStyle(12, 16, 500),
    badgeSmall: textStyle(11, 16, 500),
    body1: textStyle(14, 20, 400),
    body2: textStyle(12, 18, 400),
    buttonMedium: textStyle(14, 20, 500),
    buttonSmall: textStyle(13, 18, 500),
    caption: textStyle(12, 16, 400),
    // Card titles are 16/24/600 — numerically `h4`, but a panel title is not a
    // heading. `Typography`'s `h4` renders `<h4>` and `subtitle1` is the right
    // size at the wrong weight (500). Named for the component so retuning page
    // headings cannot restyle every card, and so a later `level` prop on
    // Typography does not become the card-title API by accident.
    cardTitle: textStyle(16, 24, 600),
    // Soma publishes no text style for the chip label either. Its size and weight
    // are `subtitle2`'s, and the role exists for the same insulation the two badge
    // roles above buy: `subtitle2` is a general text style consumers reach for
    // through `Typography`, and retuning it must not resize a chip.
    //
    // Soma's stated leading, restored for the reason the badge roles above carry:
    // Chip trims the label's text box, so leading no longer places the label and
    // this only takes effect if a chip ever wraps. See the `label` note in
    // `Chip.css.ts`.
    chipLabel: textStyle(14, 20, 500),
    displayLarge: textStyle(48, 56, 600),
    displayMedium: textStyle(36, 44, 600),
    displaySmall: textStyle(28, 36, 600),
    h1: textStyle(24, 32, 600),
    h2: textStyle(20, 28, 600),
    h3: textStyle(18, 24, 600),
    h4: textStyle(16, 24, 600),
    h5: textStyle(14, 20, 600),
    h6: textStyle(12, 16, 600),
    // rendered uppercase by the consuming component
    overline: textStyle(11, 16, 500),
    subtitle1: textStyle(16, 24, 500),
    subtitle2: textStyle(14, 20, 500),
    subtitle3: textStyle(12, 16, 500),
  },
})

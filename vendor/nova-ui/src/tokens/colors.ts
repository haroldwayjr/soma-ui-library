import { primitives } from './primitives'

// Each role names one job and carries the value it takes in each theme, so
// light and dark sit on the same line and a role cannot be added to one theme
// and forgotten in the other.
//
// This replaces the previous palette layer. Ramp steps are no longer published
// as CSS variables — they exist only in primitives.ts, as the raw input a role
// selects from. The indirection meant reading two files to answer "what color
// is a disabled button in dark mode", and product code could never name a step
// anyway.
//
// Where a role is both a value and a group — `text.primary` is a color, and
// `text.primary.onBrand` also exists — the value takes the key `base`.
export interface ThemedColor {
  dark: string
  light: string
}

interface ColorRoles {
  [key: string]: ColorRoles | ThemedColor
}

const {
  black,
  blue,
  brand,
  coolDarkTransparent: coolDark,
  coolLightTransparent: coolLight,
  green,
  grey,
  purple,
  red,
  teal,
  white,
  yellow,
} = primitives.color

const roles = {
  // Fills for interactive controls. `pressed` and `hover` are the same step in
  // light mode for several families; that is what the design file specifies.
  action: {
    danger: {
      base: { dark: red[600], light: red[700] },
      hover: { dark: red[500], light: red[800] },
      pressed: { dark: red[700], light: red[900] },
    },
    info: {
      base: { dark: blue[600], light: blue[700] },
      disabled: { dark: grey[700], light: grey[200] },
      hover: { dark: blue[500], light: blue[800] },
      pressed: { dark: blue[800], light: blue[900] },
    },
    // A scrim over the pressed fill, not a replacement for it. Light is
    // `coolDarkTransparent.10`; dark is `coolLightTransparent.10`.
    pressed: {
      overlay: { dark: coolLight[10], light: coolDark[10] },
    },
    primary: {
      base: { dark: blue[600], light: blue[800] },
      disabled: { dark: grey[700], light: grey[200] },
      hover: { dark: blue[500], light: blue[900] },
      pressed: { dark: blue[400], light: black },
    },
    secondary: {
      base: { dark: grey[800], light: grey[100] },
      disabled: { dark: grey[800], light: grey[100] },
      hover: { dark: grey[700], light: grey[200] },
      pressed: { dark: grey[600], light: grey[300] },
    },
    secondBrand: {
      base: { dark: purple[600], light: purple[700] },
      hover: { dark: purple[500], light: purple[800] },
      pressed: { dark: purple[700], light: purple[900] },
    },
    success: {
      base: { dark: green[600], light: green[700] },
      hover: { dark: green[500], light: green[800] },
      pressed: { dark: green[800], light: green[900] },
    },
    warning: {
      base: { dark: yellow[600], light: yellow[700] },
      disabled: { dark: grey[700], light: grey[200] },
      hover: { dark: yellow[500], light: yellow[800] },
      pressed: { dark: yellow[700], light: yellow[900] },
    },
  },
  // Toned `subtle` borders are tuned per family for non-text contrast on soft
  // fills — not one shared ramp step. Reconciled against Soma 2026-08-21 when
  // Badge's bindings moved off the old 400-light / 600-dark rule. The untoned
  // `subtle` and `strong` below follow their own steps, not this rule.
  //
  // Two consequences of Soma's dark values, neither of them a transcription error
  // and both worth knowing before binding these roles:
  //
  // - After the 2026-08-21 retune, dark `subtle` is two ramp steps lighter than
  //   dark `base` on accent, brand, danger, success, and warning (400 vs 600).
  //   `info` still matches the old rule: dark `subtle` equals dark `base`
  //   (`blue.600`). Do not fold info into the other five without a Soma diff.
  // - In dark, untoned `disabled` and `subtle` are both `grey.700`. Chip's
  //   disabled state is where that already shows — see its README.
  border: {
    accent: {
      base: { dark: purple[600], light: purple[700] },
      // Soft Badge stroke — Figma Soft masters bind border/*/subtle to the 300 step.
      subtle: { dark: purple[400], light: purple[300] },
    },
    // Card / AI stroke recipe `gradient/ai/border` — stop colors (not a CSS gradient var).
    ai: {
      end: { dark: blue[400], light: blue[500] },
      start: { dark: purple[400], light: purple[600] },
    },
    brand: {
      base: { dark: blue[600], light: blue[800] },
      subtle: { dark: blue[400], light: blue[300] },
    },
    danger: {
      base: { dark: red[600], light: red[700] },
      subtle: { dark: red[400], light: red[300] },
    },
    disabled: { dark: grey[700], light: grey[200] },
    focused: { dark: blue[400], light: blue[800] },
    hairline: { dark: grey[800], light: grey[200] },
    info: {
      base: { dark: blue[600], light: blue[700] },
      subtle: { dark: blue[600], light: blue[400] },
    },
    neutral: {
      subtle: { dark: grey[400], light: grey[300] },
    },
    strong: {
      base: { dark: grey[400], light: grey[500] },
      hover: { dark: grey[300], light: grey[600] },
    },
    subtle: { dark: grey[700], light: grey[300] },
    success: {
      base: { dark: green[600], light: green[700] },
      subtle: { dark: green[400], light: green[300] },
    },
    warning: {
      base: { dark: yellow[600], light: yellow[700] },
      subtle: { dark: yellow[400], light: yellow[300] },
    },
  },
  focus: {
    ring: {
      base: { dark: blue[400], light: blue[800] },
      danger: { dark: red[400], light: red[700] },
    },
  },
  icon: {
    // Card / AI sparkles — vivid purple/600 (not icon/accent purple/700).
    ai: { dark: purple[400], light: purple[600] },
    accent: { dark: purple[300], light: purple[700] },
    brand: { dark: blue[400], light: blue[800] },
    danger: { dark: red[400], light: red[700] },
    default: { dark: white, light: grey[900] },
    disabled: { dark: grey[600], light: grey[400] },
    inverse: { dark: grey[900], light: white },
    onAccent: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onBrand: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onDanger: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onInfo: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onSuccess: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onWarning: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    primary: { dark: grey[100], light: grey[900] },
    secondary: { dark: grey[300], light: grey[700] },
    success: { dark: green[400], light: green[700] },
    tertiary: { dark: grey[400], light: grey[500] },
    warning: { dark: yellow[400], light: yellow[700] },
  },
  // Product lockup (logomark + wordmark). Light is the named brand blue;
  // dark inverts to white so the cluster reads on `surface.default`. Distinct
  // from `icon.brand` / `text.brand.base` (`blue.800` navy chrome). First consumers:
  // Logomark and AppHeader's brand cluster.
  logo: {
    brand: { dark: white, light: brand.blue },
  },
  // Presence, not task outcome. `online` and `busy` resolve to the same ramp
  // steps as `icon.success` / `icon.danger` today — the Avatar file calls that
  // deliberate role separation, the same precedent `action.secondary.hover`
  // vs. `surface.muted` already set, so presence tone can move independently
  // of success/danger tone later. Do not collapse this back into `icon.*`
  // just because the values currently match.
  status: {
    busy: { dark: red[400], light: red[700] },
    offline: { dark: grey[400], light: grey[500] },
    online: { dark: green[400], light: green[700] },
    verified: { dark: blue[400], light: blue[800] },
  },
  // Every toned `subtle` surface is the 200 step in light and the 700 in dark. Like
  // the borders above, all five were one step lighter before the Soma diff.
  surface: {
    accent: {
      base: { dark: purple[500], light: purple[700] },
      hover: { dark: purple[400], light: purple[800] },
      pressed: { dark: purple[300], light: purple[900] },
      // Soft Badge / Alert Soft wash — Figma `surface/*/soft` (100 step light).
      soft: { dark: purple[900], light: purple[100] },
      subtle: { dark: purple[700], light: purple[200] },
    },
    // Card / AI wash stops for paint style `gradient/ai/surface`.
    // Parent Figma semantic `surface/ai` aliases `surface/default` (not overlay).
    ai: {
      blueSoft: { dark: blue[900], light: blue[200] },
      purple: { dark: purple[900], light: purple[100] },
      teal: { dark: teal[800], light: teal[200] },
      tealSoft: { dark: teal[900], light: teal[100] },
    },
    brand: {
      base: { dark: blue[600], light: blue[800] },
      hover: { dark: blue[500], light: blue[900] },
      // Tracks `action.primary.pressed`; see the note there.
      pressed: { dark: blue[400], light: black },
      soft: { dark: blue[900], light: blue[100] },
      subtle: { dark: blue[700], light: blue[200] },
    },
    control: {
      base: { dark: grey[600], light: grey[400] },
      hover: { dark: grey[500], light: grey[500] },
    },
    danger: {
      base: { dark: red[500], light: red[700] },
      hover: { dark: red[400], light: red[800] },
      pressed: { dark: red[300], light: red[900] },
      soft: { dark: red[900], light: red[100] },
      subtle: { dark: red[700], light: red[200] },
    },
    default: { dark: grey[900], light: white },
    // A step darker than `subtle` in light, and **the same step in dark**. The two
    // being equal in light is what made a disabled control indistinguishable from a
    // resting one — the bug the Chip README recorded before its cause was known.
    //
    // That fix is light-only, and the dark half is not fixed: `surface.subtle` and
    // `surface.disabled` are both `grey.800`, and `border.subtle` and
    // `border.disabled` are both `grey.700`, so in dark a component that paints
    // rest from the subtle pair and disabled from the disabled pair has nothing but
    // the label color to tell them apart. Soma's own values, so it is filed rather
    // than patched here; Chip's README carries the measurements.
    disabled: { dark: grey[800], light: grey[200] },
    inverse: { dark: white, light: grey[900] },
    muted: { dark: grey[700], light: grey[200] },
    // Scrims. The alpha step differs per theme rather than the hue.
    overlayDark: { dark: coolDark[80], light: coolDark[60] },
    overlayLight: { dark: coolLight[20], light: coolLight[60] },
    raised: { dark: grey[800], light: white },
    selected: { dark: blue[900], light: blue[100] },
    subtle: { dark: grey[800], light: grey[100] },
    success: {
      base: { dark: green[500], light: green[700] },
      hover: { dark: green[400], light: green[800] },
      pressed: { dark: green[300], light: green[900] },
      soft: { dark: green[900], light: green[100] },
      subtle: { dark: green[700], light: green[200] },
    },
    warning: {
      base: { dark: yellow[500], light: yellow[700] },
      hover: { dark: yellow[400], light: yellow[800] },
      pressed: { dark: yellow[300], light: yellow[900] },
      soft: { dark: yellow[900], light: yellow[100] },
      subtle: { dark: yellow[700], light: yellow[200] },
    },
  },
  text: {
    accent: {
      base: { dark: purple[400], light: purple[700] },
      hover: { dark: purple[300], light: purple[800] },
      subtle: { dark: purple[300], light: purple[700] },
    },
    brand: {
      base: { dark: blue[400], light: blue[800] },
      subtle: { dark: blue[300], light: blue[800] },
    },
    danger: {
      base: { dark: red[400], light: red[700] },
      subtle: { dark: red[200], light: red[700] },
    },
    disabled: { dark: grey[600], light: grey[400] },
    inverse: { dark: grey[900], light: white },
    link: {
      base: { dark: blue[400], light: blue[700] },
      hover: { dark: blue[300], light: blue[800] },
    },
    onAccent: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onBrand: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onDanger: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onInfo: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onSuccess: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    onWarning: {
      base: { dark: grey[900], light: white },
      pressed: { dark: grey[900], light: white },
    },
    primary: {
      base: { dark: white, light: grey[900] },
      onBrand: { dark: grey[900], light: white },
    },
    secondary: {
      base: { dark: grey[200], light: grey[700] },
      hover: { dark: grey[100], light: grey[800] },
      onBrand: { dark: grey[800], light: blue[200] },
      // Tooltip's Rich description text is the first consumer — see its README.
      // Soma's own pairing, transcribed faithfully rather than reusing `base`:
      // `onInverse` sits two steps lighter than `base` in both themes, so a
      // dimmed label on an inverse surface does not silently retune if `base`
      // moves later.
      onInverse: { dark: grey[700], light: grey[300] },
    },
    success: {
      base: { dark: green[400], light: green[800] },
      subtle: { dark: green[200], light: green[800] },
    },
    tertiary: {
      base: { dark: grey[300], light: grey[600] },
      hover: { dark: grey[300], light: grey[700] },
      onBrand: { dark: grey[600], light: blue[200] },
    },
    warning: {
      base: { dark: yellow[400], light: yellow[800] },
      subtle: { dark: yellow[200], light: yellow[800] },
    },
  },
} satisfies ColorRoles

// Reconciled against the Soma `Semantic` variable collection (both modes) on
// 2026-08-21 for Badge's soft-variant quartet: toned `border.*.subtle` steps,
// `border.neutral.subtle`, and `text.*.subtle`. Prior sync 2026-08-20. Sixteen new
// published roles landed in this file; `logo.brand` remains Nova-only. Primitive
// ramps in `primitives.ts` needed no change.
//
// Color and contrast misses against these transcribed values are catalogued in
// `docs/ACCESSIBILITY.md` (`dark-subtle-disabled-collapse`, Open rows). This
// file stays faithful to Soma; do not invent a step here or in a component to
// clear a catalog row.
//
// Read the variables, not the sticker sheets. An earlier pass took its values from
// a name→value dump of a painted component set and concluded `surface.subtle` was a
// step light. It is not — the Chips sheet pins the collection to Light mode and its
// Filled master resolves `surface/subtle` to `#f2f4f7`, which is what this file
// already had. `surface.disabled` was the role actually out of step in light.
// `docs/TOKENS.md`: variables win when they disagree with the painted table. Measure
// both modes; a light-only reading is not a reading of the collection.
//
// Present in Soma, deliberately not added here — a role ships with its first
// consumer (`docs/TOKENS.md`, rule 5), or the scale is a different question:
//
// - `fontWeight/light` (300) and `fontWeight/bold` (700) in the Typography
//   collection. `primitives.ts` publishes 400/500/600 only.
// - Soma models elevation as a themed shadow *color* — `coolDarkTransparent/10`
//   in both modes on most steps, documented as light-surface aliases. Nova's
//   elevation recipes hardcode one rgba and do not vary by theme.
// - Spacing Semantic (`inline/*`, `inset/*`, `stack/*`, `section/*`) and the
//   published `z-index/*` MUI slots (1000 / 1100 / 1300). `semantics.space` stays
//   px-keyed; stacking stays ADR 0004's derived `layer` order.
//
// Soma has no counterpart for the `6`, `10`, `14`, `18`, `28`, and `36` steps in
// `primitives.space` — its Spacing collection jumps 4 → 8 → 12. Those steps carry
// measurements taken off masters (Chip's 10px inline padding and 6px gap among
// them) rather than published values, which is worth knowing before treating a
// `space[10]` binding as design-sanctioned.

type Resolved<T> = {
  [K in keyof T]: T[K] extends ThemedColor ? string : Resolved<T[K]>
}

// A role has a string `light`; a group of roles never has a key named `light`,
// which is what keeps the two apart.
const isThemedColor = (value: ColorRoles | ThemedColor): value is ThemedColor =>
  typeof value.light === 'string'

const resolve = <T extends ColorRoles>(
  colorRoles: T,
  theme: keyof ThemedColor,
): Resolved<T> =>
  // eslint-disable-next-line no-restricted-syntax -- `Object.fromEntries` returns an index signature and cannot preserve the key-to-value mapping Resolved<T> encodes. Same containment as objectEntries in @nova/shared; the input is a local token tree, not external data.
  Object.fromEntries(
    Object.entries(colorRoles).map(([key, value]) => [
      key,
      isThemedColor(value) ? value[theme] : resolve(value, theme),
    ]),
  ) as Resolved<T>

// Light is the value the contract is declared with, so it is the default theme
// in the emitted CSS; dark is applied over it by themes.css.ts.
export const lightColors = resolve(roles, 'light')
export const darkColors = resolve(roles, 'dark')

// Read-outs for component stories, measured from the rendered element rather
// than restated from the design file. Contrast figures written by hand go stale
// the moment a ramp is retuned — these cannot, because they are computed from
// the same CSS variables the component paints with, in whichever theme and
// forced state is currently applied.

export interface Readout {
  failing: boolean
  label: string
}

interface Rgba {
  a: number
  b: number
  g: number
  r: number
}

const parseColor = (value: string): null | Rgba => {
  const parts = value
    .replaceAll(/^rgba?\(|\)$/gu, '')
    .split(/[\s,/]+/u)
    .filter((part) => part.length > 0)
    .map(Number)

  const [r, g, b, a] = parts

  if (r === undefined || g === undefined || b === undefined) return null
  if ([r, g, b].some(Number.isNaN)) return null

  return { a: a ?? 1, b, g, r }
}

// `over` is already opaque, so one composite is enough.
const composite = (top: Rgba, over: Rgba): Rgba => ({
  a: 1,
  b: top.b * top.a + over.b * (1 - top.a),
  g: top.g * top.a + over.g * (1 - top.a),
  r: top.r * top.a + over.r * (1 - top.a),
})

const relativeLuminance = ({ b, g, r }: Rgba): number => {
  const channel = (value: number): number => {
    const ratio = value / 255
    return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const contrastRatio = (a: Rgba, b: Rgba): number => {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)

  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

const TRANSPARENT: Rgba = { a: 0, b: 255, g: 255, r: 255 }
const WHITE: Rgba = { a: 1, b: 255, g: 255, r: 255 }

const addLayer = (layer: Rgba, behind: null | Rgba): Rgba => {
  if (behind === null || behind.a <= 0) return layer

  return layer.a === 0 ? behind : composite(layer, behind)
}

// Recursive rather than a loop because both the accumulated layer and the cursor
// would otherwise be `let`, which lint bans.
const compositeBehind = (node: HTMLElement | null, layer: Rgba): Rgba => {
  // Nothing opaque found: fall back to the canvas being white.
  if (node === null) return composite(layer, WHITE)

  const next = addLayer(
    layer,
    parseColor(getComputedStyle(node).backgroundColor),
  )

  return next.a >= 1 ? next : compositeBehind(node.parentElement, next)
}

// A transparent component has no fill, so its label sits on whatever is behind
// it. Walk up compositing every semi-transparent layer until an opaque one is
// reached — the same thing the eye does.
const effectiveBackground = (element: HTMLElement): Rgba =>
  compositeBehind(element, TRANSPARENT)

const isInactiveControl = (element: HTMLElement): boolean => {
  if (element instanceof HTMLButtonElement && element.disabled) return true
  if (element instanceof HTMLInputElement && element.disabled) return true

  return element.closest('[data-disabled]') !== null
}

// WCAG 2.2 1.4.3 at AA for normal-sized text. The button text styles are not
// large text, so 4.5:1 is the bar and 3:1 does not apply. A disabled control is
// exempt, and says so rather than showing a pass. Native `disabled` on a
// button or input, and `[data-disabled]` on the element or an ancestor, both
// count — Badge and Chip are spans.
export const contrastReadout = (element: HTMLElement): Readout => {
  const foreground = parseColor(getComputedStyle(element).color)

  if (foreground === null) return { failing: false, label: '—' }

  const background = effectiveBackground(element)
  const ratio = contrastRatio(composite(foreground, background), background)
  const rounded = ratio.toFixed(2)

  if (isInactiveControl(element)) {
    return { failing: false, label: `EXEMPT ${rounded}` }
  }

  if (ratio >= 7) return { failing: false, label: `AAA ${rounded}` }
  if (ratio >= 4.5) return { failing: false, label: `AA ${rounded}` }

  return { failing: true, label: `FAIL ${rounded}` }
}

// WCAG 2.2 1.4.11 at AA. A control's boundary is a non-text UI component, so the
// bar is 3:1 rather than the 4.5:1 `contrastReadout` applies to text. Measured
// against what sits *behind* the element, not its own fill: the edge's job is
// separating the control from the page, and comparing it to the fill it encloses
// would report a passing ratio for an invisible outline.
//
// The width is reported alongside the ratio because a border in layout is also a
// geometry fact — a rest-to-focus jump from 1px to 2px shrinks the content box,
// which is what `contentBoxReadout` below exists to expose. Inactive paint uses
// the same `isInactiveControl` check as `contrastReadout` (native `disabled` or
// `[data-disabled]` on the element or an ancestor).
const nonTextEdgeReadout = (
  width: number,
  color: null | Rgba,
  element: HTMLElement,
  empty: string,
): Readout => {
  if (color === null || Number.isNaN(width) || width === 0) {
    return { failing: false, label: empty }
  }

  const px = `${String(Math.round(width * 100) / 100)}px`
  const behind = effectiveBackground(element.parentElement ?? element)
  const ratio = contrastRatio(composite(color, behind), behind)
  const rounded = ratio.toFixed(2)

  if (isInactiveControl(element)) {
    return { failing: false, label: `${px} · EXEMPT ${rounded}` }
  }

  if (ratio >= 3) return { failing: false, label: `${px} · AA ${rounded}` }

  return { failing: true, label: `${px} · FAIL ${rounded}` }
}

export const strokeReadout = (element: HTMLElement): Readout => {
  const style = getComputedStyle(element)

  return nonTextEdgeReadout(
    Number.parseFloat(style.borderTopWidth),
    parseColor(style.borderTopColor),
    element,
    'no stroke',
  )
}

// Chip (and Badge) paint the rest edge as an inset `outline`, not a `border`.
// `strokeReadout` would print `no stroke` for Filled rest. Do not fold outline
// into that helper: Button's focus ring is also an `outline`, and mixing the
// two would make a rest readout pick up a ring.
export const outlineReadout = (element: HTMLElement): Readout => {
  const style = getComputedStyle(element)

  if (style.outlineStyle === '' || style.outlineStyle === 'none') {
    return { failing: false, label: 'no outline' }
  }

  return nonTextEdgeReadout(
    Number.parseFloat(style.outlineWidth),
    parseColor(style.outlineColor),
    element,
    'no outline',
  )
}

// The content box in px — the space left for the value once border and padding
// are taken. A border that lives in layout shrinks this when it thickens, so a
// rest row and a focus row reading different widths *is* the 1px value shift,
// measured rather than asserted.
export const contentBoxReadout = (element: HTMLElement): Readout => {
  const style = getComputedStyle(element)
  const round = (value: number): string => String(Math.round(value * 10) / 10)
  // A browser always reports a used length here; jsdom returns '' for a padding
  // it was never given, and NaN would poison the whole read-out.
  const px = (value: string): number => {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  const inline =
    element.clientWidth - px(style.paddingLeft) - px(style.paddingRight)
  const block =
    element.clientHeight - px(style.paddingTop) - px(style.paddingBottom)

  return { failing: false, label: `${round(inline)} × ${round(block)}` }
}

// Rounded to a tenth: subpixel noise from the border and line height is not the
// point, but a half-pixel difference between two sizes would be.
export const sizeReadout = (element: HTMLElement): Readout => {
  const { height, width } = element.getBoundingClientRect()
  const round = (value: number): string => String(Math.round(value * 10) / 10)

  return { failing: false, label: `${round(width)} × ${round(height)}` }
}

// The gaps above and below a label's content area, in px, relative to its own
// border box. `null` when there is no text to measure.
export interface TextBand {
  above: number
  below: number
  height: number
}

// The *content area* — the font's ascent-plus-descent box — not the ink and not
// the line box.
//
// Ink is the wrong instrument: "Label" has no descender, so its ink always sits
// high and an ink-symmetry check would fail correctly-centered text. The line box
// is also wrong, because `line-height: 1` makes it smaller than the content area,
// so it says nothing about where the glyphs landed. The content area is what CSS
// actually positions, and it is what both parity and flex centering act on — so it
// is the thing that reads 3.5 / 3.5 when centering is right and 3 / 4 when a
// floored half-leading has pushed the label up a pixel.
// Only `px` counts. Computed padding and border widths are always absolute in a
// browser, so anything else here means the value did not resolve — jsdom, for one,
// hands back the specified `0.25em` rather than computing it. Contributing 0 is
// right in that case; parsing "0.25em" as 0.25px would be a quietly wrong inset.
const cssPx = (value: string): number => {
  if (!value.endsWith('px')) return 0
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

// The block-axis padding and border on a trimmed label — space inside its border box
// that the glyphs do not occupy, so not part of the band being centered.
export const blockInset = (
  element: HTMLElement,
): { end: number; start: number } => {
  const style = getComputedStyle(element)

  return {
    end: cssPx(style.paddingBlockEnd) + cssPx(style.borderBlockEndWidth),
    start: cssPx(style.paddingBlockStart) + cssPx(style.borderBlockStartWidth),
  }
}

const firstNonEmptyText = (walker: TreeWalker): Node | null => {
  const node = walker.nextNode()

  if (node === null) return null

  return node.textContent?.trim() !== '' ? node : firstNonEmptyText(walker)
}

export const textBand = (element: HTMLElement): null | TextBand => {
  // The label may be a bare text node on the root (Badge) or wrapped in its own
  // element (Chip, which needs one to hang `text-box-trim` on), so search the
  // subtree rather than the direct children.
  const text = firstNonEmptyText(
    document.createTreeWalker(element, NodeFilter.SHOW_TEXT),
  )

  if (text === null) return null

  const box = element.getBoundingClientRect()
  const owner = text.parentElement

  // When the label is wrapped, measure that element's box rather than the text
  // range. The two differ under `text-box-trim`: the element is the trimmed box —
  // the space the label actually occupies and the thing flex centers — while a
  // `Range` still reports the untrimmed ascent-plus-descent area, which would say
  // nothing about where the glyphs ended up.
  //
  // Inset by padding and border, because `getBoundingClientRect` returns the border
  // box. Select pads its trimmed label deliberately — `overflow: hidden` clips at
  // the padding box, so padding is what keeps the ellipsis from cutting descenders
  // — and cancels that padding with a negative margin, so the band that is actually
  // centered is the content box. Reporting the border box there says "3.5px low" for
  // a label the eye reads as centered, which is a false failure. A no-op for Badge,
  // Button, and Chip, whose trimmed labels have neither padding nor border.
  if (owner !== null && owner !== element) {
    const trimmed = owner.getBoundingClientRect()
    if (trimmed.height === 0) return null

    const inset = blockInset(owner)
    const top = trimmed.top + inset.start
    const bottom = trimmed.bottom - inset.end
    if (bottom - top <= 0) return null

    return {
      above: top - box.top,
      below: box.bottom - bottom,
      height: bottom - top,
    }
  }

  const range = document.createRange()
  range.selectNodeContents(text)

  // jsdom implements `Range` but not its layout methods — `getBoundingClientRect`
  // is absent outright rather than returning zeros, so this must be probed before
  // it is called or every component test rendering a measured component throws.
  if (typeof range.getBoundingClientRect !== 'function') return null

  const label = range.getBoundingClientRect()

  // Elsewhere without layout, rects come back zero. Report nothing rather than a
  // confident 0 / 0 "centered".
  if (label.height === 0) return null

  return {
    above: label.top - box.top,
    below: box.bottom - label.bottom,
    height: label.height,
  }
}

// Pure so it is testable without layout. Half a pixel of tolerance: exact
// centering on an odd remainder is a legitimate x.5 / x.5, while the defect this
// exists to catch is a whole pixel.
export const centeringLabel = (band: null | TextBand): Readout => {
  if (band === null) return { failing: false, label: '—' }

  const round = (value: number): string => String(Math.round(value * 10) / 10)
  const drift = band.above - band.below
  const gaps = `${round(band.above)} / ${round(band.below)}`

  if (Math.abs(drift) <= 0.5)
    return { failing: false, label: `${gaps} centered` }

  return {
    failing: true,
    label: `${gaps} ${round(Math.abs(drift))}px ${drift < 0 ? 'high' : 'low'}`,
  }
}

export const centeringReadout = (element: HTMLElement): Readout =>
  centeringLabel(textBand(element))

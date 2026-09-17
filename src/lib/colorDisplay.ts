/** Parse #rgb, #rrggbb, or #rrggbbaa into channels. */
export function parseColor(input: string): {
  r: number
  g: number
  b: number
  a: number
} | null {
  const raw = input.trim().toLowerCase()
  if (!raw.startsWith('#')) return null
  const hex = raw.slice(1)
  if (hex.length === 3) {
    const r = Number.parseInt(hex[0]! + hex[0]!, 16)
    const g = Number.parseInt(hex[1]! + hex[1]!, 16)
    const b = Number.parseInt(hex[2]! + hex[2]!, 16)
    return { r, g, b, a: 1 }
  }
  if (hex.length === 6 || hex.length === 8) {
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    const a = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1
    if ([r, g, b, a].some((n) => Number.isNaN(n))) return null
    return { r, g, b, a }
  }
  return null
}

function channelToLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

/** Relative luminance for opaque sRGB. */
export function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  )
}

export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export type ContrastBadge = {
  label: string
  ratio: number
  /** Prefer white or black foreground on this swatch. */
  fg: '#ffffff' | '#000000'
}

/** Best WCAG label for text on an opaque fill (alpha < 1 treated as over white). */
export function contrastBadge(hex: string): ContrastBadge | null {
  const parsed = parseColor(hex)
  if (!parsed) return null

  // Composite translucent colors over white for a stable reading.
  const alpha = parsed.a
  const r = Math.round(parsed.r * alpha + 255 * (1 - alpha))
  const g = Math.round(parsed.g * alpha + 255 * (1 - alpha))
  const b = Math.round(parsed.b * alpha + 255 * (1 - alpha))
  const bg = relativeLuminance(r, g, b)
  const white = contrastRatio(bg, 1)
  const black = contrastRatio(bg, 0)
  const useWhite = white >= black
  const ratio = useWhite ? white : black
  let grade = 'Fail'
  if (ratio >= 7) grade = 'AAA'
  else if (ratio >= 4.5) grade = 'AA'
  else if (ratio >= 3) grade = 'AA Large'
  return {
    label: `${grade} ${ratio.toFixed(2)}`,
    ratio,
    fg: useWhite ? '#ffffff' : '#000000',
  }
}

export function formatHex(hex: string): string {
  return hex.toUpperCase()
}

export function formatRgb(hex: string): string {
  const parsed = parseColor(hex)
  if (!parsed) return hex
  if (parsed.a < 1) {
    return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a.toFixed(2)})`
  }
  return `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`
}

type NestedColors = { [key: string]: NestedColors | string }

export type FlatColor = { path: string; value: string }

export function flattenColorTree(
  tree: NestedColors,
  prefix = '',
): FlatColor[] {
  const out: FlatColor[] = []
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      out.push({ path, value })
    } else {
      out.push(...flattenColorTree(value, path))
    }
  }
  return out
}

export type ThemedFlatColor = {
  path: string
  light: string
  dark: string
}

export function flattenThemedColors(
  light: NestedColors,
  dark: NestedColors,
  prefix = '',
): ThemedFlatColor[] {
  const out: ThemedFlatColor[] = []
  for (const [key, lightValue] of Object.entries(light)) {
    const path = prefix ? `${prefix}.${key}` : key
    const darkValue = dark[key]
    if (typeof lightValue === 'string' && typeof darkValue === 'string') {
      out.push({ path, light: lightValue, dark: darkValue })
    } else if (
      lightValue &&
      typeof lightValue === 'object' &&
      darkValue &&
      typeof darkValue === 'object'
    ) {
      out.push(
        ...flattenThemedColors(
          lightValue as NestedColors,
          darkValue as NestedColors,
          path,
        ),
      )
    }
  }
  return out
}

export function groupByRoot(items: ThemedFlatColor[]): Map<string, ThemedFlatColor[]> {
  const map = new Map<string, ThemedFlatColor[]>()
  for (const item of items) {
    const root = item.path.split('.')[0] ?? item.path
    const list = map.get(root) ?? []
    list.push(item)
    map.set(root, list)
  }
  return map
}

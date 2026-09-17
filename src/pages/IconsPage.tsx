import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { SearchField } from '../components/detail/SearchField'
import { SegmentedControl } from '../components/detail/SegmentedControl'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'

type IconStyle = 'outline' | 'bold'

interface IconProp {
  name: string
  values?: string[]
}

interface IconVariant {
  variantCombo?: { Size?: string; Style?: string }
  nodeId?: string
}

interface IconEntry {
  name: string
  nodeId: string
  props?: IconProp[]
  variantMatrix?: IconVariant[]
}

const FIGMA_ICONS_URL =
  'https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System?node-id=9-13081'

/** Path under /icon-assets for a catalog entry + style. */
export function iconAssetPath(name: string, style: IconStyle): string {
  return `/icon-assets/${name}-${style}.svg`
}

function shortLabel(name: string): string {
  return name.replace(/^icon\//, '').split('/').slice(-2).join('/')
}

function monogramFromName(name: string): string {
  const segment = name.split('/').pop() ?? name
  const parts = segment.split(/[-_.]/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }
  return segment.slice(0, 2).toUpperCase()
}

function iconHasStyle(icon: IconEntry, style: IconStyle): boolean {
  const styleProp = icon.props?.find((prop) => prop.name === 'Style')
  return styleProp?.values?.includes(style) ?? style === 'outline'
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value)
}

async function fetchIconSvg(name: string, style: IconStyle): Promise<string> {
  const response = await fetch(iconAssetPath(name, style))
  if (!response.ok) throw new Error(`Failed to fetch ${name}`)
  return response.text()
}

function svgToJsx(svg: string, label: string): string {
  const cleaned = svg
    .replace(/<\?xml[\s\S]*?\?>/i, '')
    .replace(/<!DOCTYPE[\s\S]*?>/i, '')
    .trim()
  // Light SVG → JSX attribute normalization for drop-in use.
  const jsxBody = cleaned
    .replace(/\s(class|clip-path|fill-rule|clip-rule|stroke-width|stroke-linecap|stroke-linejoin|stroke-miterlimit)=/g, (_, attr: string) => {
      const map: Record<string, string> = {
        class: 'className',
        'clip-path': 'clipPath',
        'fill-rule': 'fillRule',
        'clip-rule': 'clipRule',
        'stroke-width': 'strokeWidth',
        'stroke-linecap': 'strokeLinecap',
        'stroke-linejoin': 'strokeLinejoin',
        'stroke-miterlimit': 'strokeMiterlimit',
      }
      return ` ${map[attr] ?? attr}=`
    })
    .replace(/\s([a-z]+-[a-z-]+)=/gi, (_, attr: string) => {
      const camel = attr.replace(/-([a-z])/g, (__: string, c: string) => c.toUpperCase())
      return ` ${camel}=`
    })
  return `/* ${label} */\n${jsxBody}`
}

function IconGlyph({
  name,
  style,
  sizeClass = 'size-8',
}: {
  name: string
  style: IconStyle
  sizeClass?: string
}) {
  const [failed, setFailed] = useState(false)
  const src = iconAssetPath(name, style)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (failed) {
    return (
      <span
        className={`grid ${sizeClass} place-items-center text-sm uppercase tracking-wide text-muted ${
          style === 'bold' ? 'font-bold' : 'font-medium'
        }`}
        aria-hidden
      >
        {monogramFromName(name)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={40}
      height={40}
      className={`${sizeClass} object-contain text-ink`}
      style={{ filter: 'var(--icon-glyph-filter, none)' }}
      onError={() => setFailed(true)}
    />
  )
}

function IconCard({ name, style }: { name: string; style: IconStyle }) {
  const [flash, setFlash] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const runCopy = async (kind: 'svg' | 'jsx') => {
    if (busy) return
    setBusy(true)
    try {
      const svg = await fetchIconSvg(name, style)
      await copyText(kind === 'svg' ? svg : svgToJsx(svg, shortLabel(name)))
      setFlash(kind === 'svg' ? 'SVG copied' : 'JSX copied')
      window.setTimeout(() => setFlash(null), 1400)
    } catch {
      setFlash('Copy failed')
      window.setTimeout(() => setFlash(null), 1400)
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="flex flex-col items-center gap-2.5 text-center">
      <div className="group relative flex aspect-square w-full max-w-[9.5rem] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--lib-text)_7%,var(--lib-surface))] focus-within:bg-[color-mix(in_srgb,var(--lib-text)_7%,var(--lib-surface))]">
        <IconGlyph name={name} style={style} sizeClass="size-10" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            disabled={busy}
            onClick={() => void runCopy('svg')}
            style={{ fontSize: 12 }}
            className="h-8 w-full cursor-pointer truncate rounded-full border border-ink/20 bg-surface px-3 font-medium leading-none text-ink shadow-none hover:border-ink/30 hover:bg-surface-subtle disabled:cursor-wait"
          >
            {flash?.startsWith('SVG') ? flash : 'Copy SVG'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void runCopy('jsx')}
            style={{ fontSize: 12 }}
            className="h-8 w-full cursor-pointer truncate rounded-full border border-ink/20 bg-surface px-3 font-medium leading-none text-ink shadow-none hover:border-ink/30 hover:bg-surface-subtle disabled:cursor-wait"
          >
            {flash?.startsWith('JSX') ? flash : flash === 'Copy failed' ? flash : 'Copy JSX'}
          </button>
        </div>
      </div>
      <span
        className="w-full truncate font-sans text-[11px] text-muted"
        title={name}
      >
        {shortLabel(name)}
      </span>
    </li>
  )
}

function GuidelineCard({
  kind,
  title,
  children,
}: {
  kind: 'do' | 'dont'
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p
        className={`mb-2 text-sm font-semibold ${
          kind === 'do' ? 'text-success' : 'text-danger'
        }`}
      >
        {title}
      </p>
      <p className="text-sm leading-6 text-muted">{children}</p>
    </div>
  )
}

export function IconsPage() {
  const [icons, setIcons] = useState<IconEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [style, setStyle] = useState<IconStyle>('outline')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/icons.json')
      .then((response) => response.json())
      .then((data: { icons?: IconEntry[] }) => {
        if (!cancelled) setIcons(data.icons ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return icons
      .filter((icon) => iconHasStyle(icon, style))
      .filter(
        (icon) => !normalized || icon.name.toLowerCase().includes(normalized),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [icons, style, query])

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <nav className="text-sm" aria-label="Breadcrumb">
          <Link to="/ui-library" className="text-muted/70 no-underline hover:text-muted">
            Resources
          </Link>
          <span className="mx-2 text-muted/45" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink" aria-current="page">
            Icons
          </span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">Soma icons</h1>
            <p className="max-w-2xl text-[15px] leading-7 text-muted">
              Streamline icon set from the Soma Figma file. Browse outline and bold SVG exports,
              then use implemented glyphs from{' '}
              <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-sm text-ink">
                @nova/ui
              </code>{' '}
              in production UI.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <a
              href={FIGMA_ICONS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
            >
              Open in Figma
              <ArrowTopRightIcon />
            </a>
            <a
              href="/icons.json"
              className="inline-flex rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
            >
              View registry
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Icon style"
          value={style}
          onChange={setStyle}
          options={
            [
              { value: 'outline', label: 'Outline' },
              { value: 'bold', label: 'Bold' },
            ] as const
          }
        />
        <SearchField
          className="w-full sm:max-w-xs"
          size="sm"
          value={query}
          onChange={setQuery}
          placeholder="Search icons…"
          label="Search icons"
        />
      </div>

      <p className="text-sm text-muted">
        {loading
          ? 'Loading…'
          : `${filtered.length} ${filtered.length === 1 ? 'icon' : 'icons'}`}
      </p>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map((icon) => (
          <IconCard key={icon.nodeId} name={icon.name} style={style} />
        ))}
      </ul>

      <section className="space-y-12 border-t border-line pt-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink">Design principles</h2>
          <p className="max-w-3xl text-[15px] leading-7 text-muted">
            Icons should be simple, consistent, and readable at small sizes. Use the Soma
            Streamline set from Figma so stroke weight, corner radius, and metaphors stay aligned
            across products.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <GuidelineCard kind="do" title="Do">
              Prefer simple geometric glyphs, consistent stroke weight, and a clear silhouette at
              16–24px.
            </GuidelineCard>
            <GuidelineCard kind="dont" title="Don't">
              Avoid over-detailed illustrations, uneven optical weight, or cryptic metaphors that
              do not read instantly.
            </GuidelineCard>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink">Sizes &amp; styles</h2>
          <p className="max-w-3xl text-[15px] leading-7 text-muted">
            Figma variants include Size <strong className="font-medium text-ink">xs</strong>,{' '}
            <strong className="font-medium text-ink">sm</strong>,{' '}
            <strong className="font-medium text-ink">md</strong>, and{' '}
            <strong className="font-medium text-ink">lg</strong>, plus Style{' '}
            <strong className="font-medium text-ink">outline</strong> and{' '}
            <strong className="font-medium text-ink">bold</strong> (bold is typically authored at
            xs in the file). This gallery previews{' '}
            <strong className="font-medium text-ink">md outline</strong> and{' '}
            <strong className="font-medium text-ink">xs bold</strong> SVG exports.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-ink">Using icons</h2>
          <ul className="max-w-3xl list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted">
            <li>
              Implemented icons ship as React glyphs in{' '}
              <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-sm text-ink">
                @nova/ui
              </code>{' '}
              (for example <code className="text-sm text-ink">IconCheck</code>,{' '}
              <code className="text-sm text-ink">IconClose</code>,{' '}
              <code className="text-sm text-ink">IconHome</code>).
            </li>
            <li>
              The{' '}
              <a
                href={FIGMA_ICONS_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand no-underline hover:underline"
              >
                Soma icons page in Figma
              </a>{' '}
              is the full set and naming source of truth.
            </li>
            <li>
              Machine-readable metadata lives in{' '}
              <a href="/icons.json" className="font-medium text-brand no-underline hover:underline">
                /icons.json
              </a>{' '}
              (names, node IDs, and variant matrix).
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}

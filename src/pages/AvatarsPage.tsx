import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchField } from '../components/detail/SearchField'
import { SegmentedControl } from '../components/detail/SegmentedControl'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'
import { componentPath, figmaNodeUrl } from '../lib/nav'
import { components } from '../lib/registry'

type AvatarTab = 'all' | 'photos' | 'components'

const PHOTO_PREFIX = 'Avatar / Photo / '
const AVATARS_FIGMA_NODE = '943:13210'

const AVATAR_COMPONENT_NAMES = [
  'Avatar',
  'Avatar / Presence dot',
  'Avatar Group',
  'Avatar Label Group',
] as const

const photoAssets = components
  .filter((component) => component.name.startsWith(PHOTO_PREFIX))
  .sort((a, b) => a.name.localeCompare(b.name))

const avatarComponents = components.filter((component) =>
  AVATAR_COMPONENT_NAMES.includes(
    component.name as (typeof AVATAR_COMPONENT_NAMES)[number],
  ),
)

const avatarComponent = components.find((component) => component.name === 'Avatar')

function personNameFromPhoto(componentName: string): string {
  return componentName.slice(PHOTO_PREFIX.length)
}

function slugFromPerson(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function avatarAssetPath(personName: string): string {
  return `/avatar-assets/${slugFromPerson(personName)}.png`
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function CloudDownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.5 18H7a4 4 0 0 1-.7-7.94A5.5 5.5 0 0 1 17.4 8.2 3.5 3.5 0 0 1 18.5 18h-1" />
      <path d="M12 12v7" />
      <path d="m9 16.5 3 3 3-3" />
    </svg>
  )
}

async function fetchAvatarBlob(src: string): Promise<Blob> {
  const response = await fetch(src)
  if (!response.ok) throw new Error(`Failed to fetch ${src}`)
  return response.blob()
}

async function copyAvatarImage(src: string): Promise<void> {
  const blob = await fetchAvatarBlob(src)
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type || 'image/png']: blob }),
    ])
    return
  }
  const absolute = new URL(src, window.location.origin).href
  await navigator.clipboard.writeText(absolute)
}

function downloadAvatarImage(src: string, person: string): void {
  const anchor = document.createElement('a')
  anchor.href = src
  anchor.download = `${slugFromPerson(person)}.png`
  anchor.rel = 'noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

function PhotoCard({ person }: { person: string }) {
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionsOpen, setActionsOpen] = useState(false)
  const src = avatarAssetPath(person)

  const handleCopy = async () => {
    if (failed || busy) return
    setBusy(true)
    try {
      await copyAvatarImage(src)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      try {
        await navigator.clipboard.writeText(
          new URL(src, window.location.origin).href,
        )
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
      } catch {
        /* ignore */
      }
    } finally {
      setBusy(false)
    }
  }

  const handleDownload = async () => {
    if (failed || busy) return
    try {
      const blob = await fetchAvatarBlob(src)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${slugFromPerson(person)}.png`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch {
      downloadAvatarImage(src, person)
    }
  }

  return (
    <li className="flex flex-col gap-2">
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface-subtle"
        onMouseEnter={() => setActionsOpen(true)}
        onMouseLeave={() => setActionsOpen(false)}
        onFocusCapture={() => setActionsOpen(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setActionsOpen(false)
          }
        }}
      >
        {failed ? (
          <div
            className="grid size-full place-items-center text-lg font-medium text-muted"
            aria-hidden
          >
            {initialsFromName(person)}
          </div>
        ) : (
          <img
            src={src}
            alt=""
            className="size-full object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}

        {!failed && (
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2.5 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              actionsOpen
                ? 'pointer-events-auto opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          >
            <div className="flex items-end justify-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                disabled={busy}
                style={{ fontSize: 12 }}
                className="h-8 min-w-0 flex-1 cursor-pointer truncate rounded-full border border-white/40 bg-black/70 px-3 text-center font-medium leading-none text-white shadow-none transition-colors duration-200 hover:bg-black/80 disabled:cursor-wait"
              >
                {copied ? 'Copied' : 'Click to copy'}
              </button>
              <button
                type="button"
                aria-label={`Download ${person}`}
                onClick={handleDownload}
                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-black/70 text-white shadow-none transition-colors duration-200 hover:bg-black/80"
              >
                <CloudDownloadIcon className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <span className="truncate px-0.5 text-sm font-semibold text-ink">
        {person}
      </span>
    </li>
  )
}

export function AvatarsPage() {
  const [tab, setTab] = useState<AvatarTab>('all')
  const [query, setQuery] = useState('')

  const filteredPhotos = useMemo(() => {
    if (tab === 'components') return []
    const needle = query.trim().toLowerCase()
    return photoAssets.filter((asset) => {
      const person = personNameFromPhoto(asset.name)
      return !needle || person.toLowerCase().includes(needle)
    })
  }, [tab, query])

  const visibleComponents = useMemo(() => {
    if (tab === 'photos') return []
    const needle = query.trim().toLowerCase()
    return avatarComponents.filter(
      (component) =>
        !needle || component.name.toLowerCase().includes(needle),
    )
  }, [tab, query])

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <nav className="text-sm" aria-label="Breadcrumb">
          <Link
            to="/ui-library"
            className="text-muted/70 no-underline hover:text-muted"
          >
            Resources
          </Link>
          <span className="mx-2 text-muted/45" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink" aria-current="page">
            Avatars
          </span>
        </nav>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Free user avatars
            </h1>
            <p className="text-[15px] leading-7 text-muted">
              Placeholder portrait photos from the Soma Figma file for demos and
              documentation. Available as PNG assets here — use the live Avatar
              component with a runtime <code className="text-ink">src</code> in
              product UI.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={figmaNodeUrl(AVATARS_FIGMA_NODE)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
            >
              Open in Figma
              <ArrowTopRightIcon />
            </a>
            {avatarComponent ? (
              <Link
                to={componentPath(avatarComponent)}
                className="inline-flex h-10 items-center rounded-full bg-brand px-4 text-sm font-medium text-white no-underline hover:opacity-90"
              >
                Avatar component
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Avatar categories"
          value={tab}
          onChange={setTab}
          options={
            [
              { value: 'all', label: 'All' },
              { value: 'photos', label: 'Photos' },
              { value: 'components', label: 'Components' },
            ] as const
          }
        />
        <SearchField
          className="w-full sm:max-w-xs"
          size="sm"
          value={query}
          onChange={setQuery}
          label="Search avatars"
        />
      </div>

      {filteredPhotos.length > 0 && (
        <section>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredPhotos.map((asset) => (
              <PhotoCard
                key={asset.nodeId}
                person={personNameFromPhoto(asset.name)}
              />
            ))}
          </ul>
        </section>
      )}

      {visibleComponents.length > 0 && (
        <section className="space-y-5">
          {tab !== 'components' && (
            <h2 className="text-lg font-semibold text-ink">Components</h2>
          )}
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {visibleComponents.map((component) => (
              <li key={component.nodeId}>
                <Link
                  to={componentPath(component)}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 text-sm no-underline hover:bg-surface-subtle"
                >
                  <span className="font-medium text-ink">{component.name}</span>
                  <span className="text-muted">View →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {filteredPhotos.length === 0 && visibleComponents.length === 0 && (
        <p className="text-sm text-muted">No avatars match “{query}”.</p>
      )}
    </div>
  )
}

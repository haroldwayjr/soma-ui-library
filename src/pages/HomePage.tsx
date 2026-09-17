import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'
import { components, getDisplayStatus } from '../lib/registry'

const order = [
  'Done',
  'In progress',
  'Blocked',
  'Not started',
  'Not implemented',
  'Status unknown',
] as const

type StatusKey = (typeof order)[number]

const statusVisual: Record<
  StatusKey,
  { tint: string; ink: string; icon: 'check' | 'progress' | 'block' | 'idle' | 'code' | 'help' }
> = {
  Done: {
    tint: 'bg-success/10 dark:bg-success/15',
    ink: 'text-success',
    icon: 'check',
  },
  'In progress': {
    tint: 'bg-brand/10 dark:bg-brand/15',
    ink: 'text-brand',
    icon: 'progress',
  },
  Blocked: {
    tint: 'bg-danger/10 dark:bg-danger/15',
    ink: 'text-danger',
    icon: 'block',
  },
  'Not started': {
    tint: 'bg-[color-mix(in_srgb,var(--lib-text)_6%,transparent)]',
    ink: 'text-muted',
    icon: 'idle',
  },
  'Not implemented': {
    tint: 'bg-[color-mix(in_srgb,#9b58e6_12%,transparent)]',
    ink: 'text-[#7c3aed] dark:text-[#c9a8fa]',
    icon: 'code',
  },
  'Status unknown': {
    tint: 'bg-[color-mix(in_srgb,var(--lib-text)_5%,transparent)]',
    ink: 'text-muted',
    icon: 'help',
  },
}

function StatusIcon({
  kind,
  className,
}: {
  kind: (typeof statusVisual)[StatusKey]['icon']
  className?: string
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (kind) {
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    case 'progress':
      return (
        <svg {...common}>
          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      )
    case 'block':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M7 12h10" />
        </svg>
      )
    case 'idle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
        </svg>
      )
    case 'help':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4" />
          <path d="M12 17h.01" />
        </svg>
      )
  }
}

function GetStartedIcon({
  kind,
  className,
}: {
  kind: 'components' | 'resources' | 'agents'
  className?: string
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (kind) {
    case 'components':
      // Stacked UI frames — browsing the component library
      return (
        <svg {...common}>
          <rect x="4" y="4" width="12" height="12" rx="2" />
          <path d="M8 16v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2" />
          <path d="M8 9h4M8 12h2" />
        </svg>
      )
    case 'resources':
      // Image / media asset — icons & avatar photos
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <circle cx="8.5" cy="10.5" r="1.75" />
          <path d="m21 15-4.5-4.5L7 20" />
        </svg>
      )
    case 'agents':
      // Simple 4-point sparkle — AI / agent sharing
      return (
        <svg {...common}>
          <path d="M12 2.5 13.85 10.15 21.5 12 13.85 13.85 12 21.5 10.15 13.85 2.5 12 10.15 10.15 12 2.5Z" />
        </svg>
      )
  }
}

export function HomePage() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('section') !== 'get-started') return
    document
      .getElementById('get-started')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [searchParams])

  const counts = new Map<string, number>()
  components.forEach((component) => {
    const status = getDisplayStatus(component)
    counts.set(status, (counts.get(status) ?? 0) + 1)
  })

  return (
    <div className="space-y-12">
      {/* Soma cover — inset card, ~⅔ viewport height */}
      <section
        className="relative isolate overflow-hidden rounded-3xl"
        style={{
          backgroundColor: '#0117e3',
          backgroundImage: [
            'radial-gradient(ellipse 90% 80% at 8% 92%, #0117e3 0%, transparent 58%)',
            'radial-gradient(ellipse 70% 65% at 28% 35%, #1a2ef0 0%, transparent 55%)',
            'radial-gradient(ellipse 75% 70% at 52% 48%, #3370fd 0%, transparent 52%)',
            'radial-gradient(ellipse 65% 75% at 78% 28%, #5854d8 0%, transparent 50%)',
            'radial-gradient(ellipse 85% 90% at 96% 88%, #f1566d 0%, transparent 58%)',
            'radial-gradient(ellipse 50% 45% at 62% 72%, rgba(241, 86, 109, 0.55) 0%, transparent 60%)',
          ].join(', '),
        }}
      >
        <div className="relative z-10 flex h-[66vh] max-h-[560px] min-h-[360px] flex-col justify-end p-8 text-white sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-semibold tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">
              Soma
            </h1>
            <p className="mt-2 text-2xl font-normal tracking-tight text-white/90 sm:mt-3 sm:text-3xl lg:text-4xl">
              IH Design System
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl space-y-16 px-3 sm:px-4 lg:px-6">
      <header className="max-w-2xl space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Introduction
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Welcome to the Soma UI library
        </h2>
        <p className="text-base leading-7 text-muted">
          Browse the Figma-first component registry, inspect live Nova
          implementations, and share specs with design and engineering tools.
          This catalog mirrors the Soma Design System file structure — foundation,
          base components, patterns, and app examples. It will ultimately live in
          the new Nova Care app so teams can dogfood Soma components in a real
          product context as they ship.
        </p>
      </header>

      <section id="get-started" className="scroll-mt-24 space-y-6 border-t border-line pt-12">
        <h3 className="text-xl font-semibold text-ink">Get started</h3>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            {
              id: 'explore',
              title: 'Explore components',
              body: 'Open Base components or Patterns in the sidebar, then pick a category to browse variants.',
              to: '/ui-library/buttons/button',
              tint: 'bg-brand/10 text-brand',
              icon: 'components' as const,
            },
            {
              id: 'resources',
              title: 'Check resources',
              body: 'Icons and avatar photo assets live under Resources — same sources as Figma.',
              to: '/ui-library/resources/icons',
              tint: 'bg-[color-mix(in_srgb,#9b58e6_12%,transparent)] text-[#7c3aed] dark:text-[#c9a8fa]',
              icon: 'resources' as const,
            },
            {
              id: 'agents',
              title: 'Share with agents',
              body: 'Use Copy as markdown on any component page, or hit /registry.json and /llms.txt.',
              to: '/registry.json',
              external: true,
              tint: 'bg-success/10 text-success',
              icon: 'agents' as const,
            },
          ].map((item) => {
            const openClass =
              'mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle'
            return (
              <li
                key={item.id}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <span
                  className={`inline-flex size-12 items-center justify-center rounded-2xl ${item.tint}`}
                  aria-hidden
                >
                  <GetStartedIcon kind={item.icon} className="size-6" />
                </span>
                <h4 className="mt-4 text-lg font-semibold tracking-tight text-ink">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                {item.external ? (
                  <a href={item.to} className={openClass}>
                    Open
                    <ArrowTopRightIcon />
                  </a>
                ) : (
                  <Link to={item.to} className={openClass}>
                    Open
                    <ArrowTopRightIcon />
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <section className="space-y-6 border-t border-line pt-12">
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-xl font-semibold text-ink">Registry status</h3>
          <p className="text-sm text-muted">{components.length} components</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {order.map((status) => {
            const visual = statusVisual[status]
            const count = counts.get(status) ?? 0
            return (
              <div
                key={status}
                className={`rounded-2xl border border-line/70 p-4 ${visual.tint}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-surface/80 ${visual.ink}`}
                  >
                    <StatusIcon kind={visual.icon} className="size-4" />
                  </span>
                  <dt className={`text-[13px] font-semibold leading-snug ${visual.ink}`}>
                    {status}
                  </dt>
                </div>
                <dd className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-ink">
                  {count}
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <section className="flex flex-wrap gap-3 border-t border-line pt-12 pb-4">
        <Link
          to="/ui-library/resources/icons"
          className="inline-flex items-center rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white no-underline hover:opacity-90"
        >
          Browse icons
        </Link>
        <Link
          to="/ui-library/foundation/colors"
          className="inline-flex items-center rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
        >
          Foundation
        </Link>
        <a
          href="https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
        >
          Open Figma
          <ArrowTopRightIcon />
        </a>
      </section>
      </div>
    </div>
  )
}

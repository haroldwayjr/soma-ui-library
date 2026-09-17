import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ArrowTopRightIcon } from '../icons/ArrowTopRightIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { figmaNodeUrl } from '../../lib/nav'
import type { RegistryComponent } from '../../lib/registry'
import { getDisplayStatus } from '../../lib/registry'

export interface ShareTool {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  run: (ctx: ShareContext) => void | Promise<void>
}

export interface ShareContext {
  component: RegistryComponent
  markdown: string
  pageUrl: string
}

function MenuIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className="mt-1 inline-flex size-4 shrink-0 items-center justify-center text-tertiary [&_svg]:block"
      aria-hidden
    >
      {children}
    </span>
  )
}

function IconCopyMarkdown() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function IconDownloadMd() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-6Z" />
      <path d="M14 3v6h6M12 18v-6M9.5 15.5 12 18l2.5-2.5" />
    </svg>
  )
}

function IconCursor() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4 10.5 20l2-6.5L19 11.5 4 4Z" />
    </svg>
  )
}

function IconFigma() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H8.5a3.5 3.5 0 0 0 0 7H12V2Z" />
      <path d="M12 9H8.5a3.5 3.5 0 0 0 0 7H12V9Z" />
      <path d="M12 16H8.5a3.5 3.5 0 1 0 3.5 3.5V16Z" />
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z" />
      <path d="M15.5 9a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z" />
    </svg>
  )
}

function IconSparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5 13.85 10.15 21.5 12 13.85 13.85 12 21.5 10.15 13.85 2.5 12 10.15 10.15 12 2.5Z" />
    </svg>
  )
}

function buildMarkdown(component: RegistryComponent): string {
  const status = getDisplayStatus(component)
  const props = (component.props ?? [])
    .map((prop) => {
      const values = Array.isArray(prop.figmaValues)
        ? prop.figmaValues.map(String).join(' | ')
        : '—'
      return `- **${prop.name}**: ${values}`
    })
    .join('\n')

  const variants = (component.variants ?? [])
    .slice(0, 40)
    .map((variant) => {
      const combo = Object.entries(variant.properties ?? {})
        .map(([key, value]) => `${key}=${String(value)}`)
        .join(', ')
      return `- ${combo || 'Default'}${variant.nodeId ? ` (\`${variant.nodeId}\`)` : ''}`
    })
    .join('\n')

  return [
    `# ${component.name}`,
    '',
    component.description && component.description !== 'TODO'
      ? component.description
      : '_No description yet._',
    '',
    `- **Status:** ${status}`,
    `- **Implementation:** ${component.implementationStatus ?? 'unknown'}`,
    `- **Figma node:** \`${component.nodeId}\``,
    component.importPath ? `- **Import:** \`${component.importPath}\`` : null,
    '',
    '## Props',
    props || '_None recorded._',
    '',
    '## Variants',
    variants || '_None recorded._',
    '',
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** Append tools here to scale future destinations (Claude, v0, etc.). */
export const shareTools: ShareTool[] = [
  {
    id: 'copy-markdown',
    label: 'Copy as markdown',
    description: 'Component spec for docs or chat',
    icon: <IconCopyMarkdown />,
    async run({ markdown }) {
      await navigator.clipboard.writeText(markdown)
    },
  },
  {
    id: 'view-markdown',
    label: 'View as markdown',
    description: 'Download a .md file',
    icon: <IconDownloadMd />,
    run({ markdown, component }) {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${component.name.replace(/\s+/g, '-').toLowerCase()}.md`
      anchor.click()
      URL.revokeObjectURL(url)
    },
  },
  {
    id: 'cursor',
    label: 'Open in Cursor',
    description: 'Copy a Cursor-ready prompt',
    icon: <IconCursor />,
    async run({ markdown, component }) {
      await navigator.clipboard.writeText(
        [
          `Implement or review the Soma UI component "${component.name}" using this registry spec:`,
          '',
          markdown,
        ].join('\n'),
      )
    },
  },
  {
    id: 'figma',
    label: 'Open in Figma',
    description: 'Jump to the component set node',
    icon: <IconFigma />,
    run({ component }) {
      window.open(figmaNodeUrl(component.nodeId), '_blank', 'noreferrer')
    },
  },
  {
    id: 'figma-make',
    label: 'Open in Figma Make',
    description: 'Copy a Make-ready brief',
    icon: <IconSparkle />,
    async run({ markdown, component }) {
      await navigator.clipboard.writeText(
        [
          `Figma Make brief — Soma / ${component.name}`,
          '',
          'Use the Soma Design System. Match these variants and props exactly:',
          '',
          markdown,
        ].join('\n'),
      )
    },
  },
]

export function ShareMenu({
  component,
  tools = shareTools,
}: {
  component: RegistryComponent
  tools?: ShareTool[]
}) {
  const [open, setOpen] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const markdown = buildMarkdown(component)
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href : component.name

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        style={{ fontSize: 14 }}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 font-medium text-ink hover:bg-surface-subtle"
      >
        {flash ?? 'Copy'}
        <ChevronDownIcon className="size-3.5 shrink-0 text-muted" />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 z-30 mt-2 w-max min-w-56 max-w-xs overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          {tools.map((tool) => (
            <li key={tool.id} role="none">
              <button
                type="button"
                role="menuitem"
                className="flex w-full cursor-pointer items-start gap-2.5 bg-transparent px-3 py-2.5 text-left hover:bg-surface-subtle"
                onClick={async () => {
                  await tool.run({ component, markdown, pageUrl })
                  const copied =
                    tool.id === 'copy-markdown' ||
                    tool.id === 'cursor' ||
                    tool.id === 'figma-make'
                  setFlash(copied ? 'Copied' : tool.label)
                  setOpen(false)
                  window.setTimeout(() => setFlash(null), 1600)
                }}
              >
                {tool.icon ? <MenuIcon>{tool.icon}</MenuIcon> : null}
                <span className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    {tool.label}
                    {(tool.id === 'cursor' ||
                      tool.id === 'figma' ||
                      tool.id === 'figma-make') && (
                      <ArrowTopRightIcon />
                    )}
                  </span>
                  {tool.description ? (
                    <span className="block text-[11px] leading-snug text-muted">
                      {tool.description}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PageToc({
  items,
}: {
  items: { id: string; label: string }[]
}) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    if (items.length === 0) return
    const observers = items.map((item) => {
      const el = document.getElementById(item.id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setActive(item.id)
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 },
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-48 shrink-0 self-start overflow-y-auto xl:block"
    >
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        On this page
      </p>
      <ul className="space-y-1 border-l border-line">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault()
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                window.history.replaceState(
                  null,
                  '',
                  `${window.location.pathname}${window.location.search}#${item.id}`,
                )
              }}
              className={`block border-l-2 py-1 pl-3 text-[13px] no-underline transition-colors ${
                active === item.id
                  ? '-ml-px border-brand font-medium text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

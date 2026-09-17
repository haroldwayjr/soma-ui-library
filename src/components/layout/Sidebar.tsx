import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  categoryPath,
  componentPath,
  navGroups,
  type NavLink as NavLinkItem,
  type NavPageGroup,
} from '../../lib/nav'
import { highlightMatch, useRegistrySearch } from '../../lib/search'
import { SearchField } from '../detail/SearchField'
import { ArrowTopRightIcon } from '../icons/ArrowTopRightIcon'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'

const STORAGE_KEY = 'soma-ui-library:sidebar-expanded:v2'

/** Stroke chevron expand indicator. */
function ExpandIcon({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={`size-5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
        open ? 'rotate-180 text-ink' : 'rotate-0 text-muted'
      }`}
    />
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  const parts = highlightMatch(text, query)
  if (typeof parts === 'string') return parts
  return (
    <>
      {parts.before}
      <mark>{parts.match}</mark>
      {parts.after}
    </>
  )
}

function initialExpanded(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

/** Soft sky-blue selected pill — clear brand blue, not muddy navy mix. */
const selectedItemClass =
  'bg-[#dce8ff] font-semibold text-ink dark:bg-[color-mix(in_srgb,#7eb6ff_28%,transparent)]'

/** Open parent uses the same soft tint as idle hover — not a darker gray. */
const openParentClass =
  'bg-[color-mix(in_srgb,var(--lib-text)_6%,transparent)] font-medium text-ink'

/** Parents and children share 14px; parents use medium, idle children use regular. */
const parentIdleClass =
  'font-medium text-ink hover:bg-[color-mix(in_srgb,var(--lib-text)_6%,transparent)]'

const childIdleClass =
  'font-normal text-ink hover:bg-[color-mix(in_srgb,var(--lib-text)_6%,transparent)]'

/** Shared focus treatment for nav pills — brand IH blue ring. */
const itemFocusClass =
  'outline-none focus-visible:!outline-2 focus-visible:!outline-solid focus-visible:!outline-offset-2 focus-visible:!outline-brand'

const itemBase =
  `relative flex min-h-11 w-full items-center gap-2 rounded-full px-4 text-left !text-[14px] leading-5 tracking-[-0.01em] transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${itemFocusClass}`

function isNavItemActive(item: NavLinkItem, location: ReturnType<typeof useLocation>): boolean {
  if (item.to === '/ui-library') {
    return (
      location.pathname === '/ui-library' &&
      !location.search.includes('section=get-started')
    )
  }
  if (item.to.includes('section=get-started')) {
    return (
      location.pathname === '/ui-library' &&
      location.search.includes('section=get-started')
    )
  }
  if (item.to.includes('?')) {
    const [path, searchPart] = item.to.split('?')
    return location.pathname === path && location.search.includes(searchPart)
  }
  if (item.end ?? false) {
    return location.pathname === item.to
  }
  return (
    location.pathname === item.to ||
    location.pathname.startsWith(`${item.to}/`)
  )
}

function labelMatches(label: string, query: string): boolean {
  return label.toLowerCase().includes(query.trim().toLowerCase())
}

export function Sidebar() {
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string[]>(() => {
    const saved = initialExpanded()
    return saved.length > 0
      ? saved
      : ['getting-started', 'resources', 'foundation', 'base', 'patterns', 'app']
  })
  const { query: activeQuery, results } = useRegistrySearch(query)
  const matchSet = useMemo(() => new Set(results), [results])
  const searching = activeQuery.trim().length > 0

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expanded))
    } catch {
      // ignore
    }
  }, [expanded])

  const toggle = (id: string) =>
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )

  return (
    <aside
      className="fixed bottom-0 left-0 top-16 z-10 flex w-[272px] flex-col border-r border-line/70 bg-[color-mix(in_srgb,var(--lib-surface-subtle)_65%,var(--lib-surface))]"
      aria-label="Library navigation"
    >
      <div className="px-3 pb-2 pt-3">
        <SearchField id="component-search" value={query} onChange={setQuery} />
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-1">
        {navGroups.map((group) => {
          const filteredItems = group.items.filter((item) => {
            if (!searching) return true
            if (item.kind === 'link') return labelMatches(item.label, activeQuery)
            if (labelMatches(item.label, activeQuery)) return true
            if (labelMatches(group.label, activeQuery)) return true
            return item.components.some((component) => matchSet.has(component))
          })
          if (searching && filteredItems.length === 0) return null

          const open = searching ? true : expanded.includes(group.id)
          return (
            <div key={group.id} className="mb-1 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={open}
                className={`${itemBase} justify-between active:scale-[0.99] ${
                  open ? openParentClass : parentIdleClass
                }`}
              >
                <span>{group.label}</span>
                <ExpandIcon open={open} />
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.2,0,0,1)] ${
                  open
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                {/* M3-style hierarchy: children sit inset under the section label */}
                <ul
                  className={`flex min-h-0 flex-col gap-1.5 pl-5 ${
                    open ? 'overflow-visible' : 'overflow-hidden'
                  }`}
                >
                  {filteredItems.map((item) => {
                    if (item.kind === 'link') {
                      if (item.external) {
                        return (
                          <li key={item.to}>
                            <a
                              href={item.to}
                              target="_blank"
                              rel="noreferrer"
                              className={`${itemBase} ${childIdleClass} no-underline`}
                            >
                              <span className="min-w-0 flex-1 truncate">
                                {item.label}
                              </span>
                              <ArrowTopRightIcon className="size-3.5 shrink-0 text-muted" />
                            </a>
                          </li>
                        )
                      }
                      return (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end={item.end ?? false}
                            aria-current={
                              isNavItemActive(item, location) ? 'page' : undefined
                            }
                            className={() => {
                              const isActive = isNavItemActive(item, location)
                              return `${itemBase} no-underline ${
                                isActive ? selectedItemClass : childIdleClass
                              }`
                            }}
                          >
                            {item.label}
                          </NavLink>
                        </li>
                      )
                    }

                    return (
                      <PageNavItem
                        key={item.slug}
                        item={item}
                        activeQuery={activeQuery}
                        matchSet={matchSet}
                      />
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
        {searching ? (
          <p className="px-4 py-3 text-xs text-muted">
            Showing matches for “{activeQuery}”
          </p>
        ) : null}
      </nav>

      <div className="border-t border-line/70 px-4 py-3 text-xs text-muted">
        <Link
          to="/ui-library"
          className="font-medium text-ink no-underline transition-colors hover:text-brand"
        >
          Soma
        </Link>
        {' · '}IH Design System
      </div>
    </aside>
  )
}

/** Page groups link to their category; single-component groups go straight to the component. */
function PageNavItem({
  item,
  activeQuery,
  matchSet,
}: {
  item: NavPageGroup
  activeQuery: string
  matchSet: Set<(typeof item.components)[number]>
}) {
  const location = useLocation()
  const categoryUrl = categoryPath(item.slug)
  const sole = item.components.length === 1 ? item.components[0] : undefined
  const targetUrl = sole ? componentPath(sole) : categoryUrl
  const label = sole?.name ?? item.label
  const labelHit =
    Boolean(activeQuery) &&
    (labelMatches(item.label, activeQuery) || labelMatches(label, activeQuery))
  const visible = item.components.filter(
    (component) => !activeQuery || labelHit || matchSet.has(component),
  )

  if (activeQuery && visible.length === 0) return null

  const isActive =
    location.pathname === targetUrl ||
    location.pathname === categoryUrl ||
    location.pathname.startsWith(`${categoryUrl}/`)

  return (
    <li>
      <NavLink
        to={targetUrl}
        className={() =>
          `${itemBase} no-underline ${
            isActive ? selectedItemClass : childIdleClass
          }`
        }
      >
        <span className="min-w-0 flex-1 truncate">
          <Highlight text={label} query={activeQuery} />
        </span>
        {!sole ? (
          <span className="text-xs font-normal tabular-nums text-muted">
            {activeQuery ? visible.length : item.components.length}
          </span>
        ) : null}
      </NavLink>
    </li>
  )
}

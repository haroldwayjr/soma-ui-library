import { Link, useLocation } from 'react-router-dom'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="text-[15px] leading-7 text-muted">
        No page matches{' '}
        <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-sm text-ink">
          {location.pathname}
        </code>
        . Check the sidebar, or browse the full component registry.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/ui-library"
          className="inline-flex rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white no-underline"
        >
          Introduction
        </Link>
        <Link
          to="/ui-library/resources/icons"
          className="inline-flex rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
        >
          Browse icons
        </Link>
      </div>
    </div>
  )
}

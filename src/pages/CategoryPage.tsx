import { Link, Navigate, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/detail/StatusBadge'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'
import { componentPath, findCategory, figmaNodeUrl } from '../lib/nav'
import { getDisplayStatus } from '../lib/registry'

export function CategoryPage() {
  const { categorySlug } = useParams()
  const category = findCategory(categorySlug)

  if (!category) return <Navigate to="/ui-library" replace />

  // Skip the category index when there's only one component (e.g. Buttons → Button).
  if (category.components.length === 1) {
    return <Navigate to={componentPath(category.components[0]!)} replace />
  }

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Category
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          {category.label}
        </h1>
        <p className="max-w-2xl text-[15px] leading-7 text-muted">
          {category.components.length} component
          {category.components.length === 1 ? '' : 's'} from the Soma Figma
          file. Open a component for props, variants, and the Figma node.
        </p>
      </header>

      <ul className="divide-y divide-line rounded-2xl border border-line">
        {category.components.map((component) => {
          const status = getDisplayStatus(component)
          return (
            <li key={`${component.name}-${component.nodeId}`}>
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                <Link
                  to={componentPath(component)}
                  className="min-w-0 flex-1 text-sm font-medium text-ink no-underline hover:text-brand"
                >
                  {component.name}
                </Link>
                <StatusBadge component={component} />
                <span className="text-xs text-muted">{status}</span>
                <a
                  href={figmaNodeUrl(component.nodeId)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted no-underline hover:text-ink"
                >
                  Figma
                  <ArrowTopRightIcon />
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

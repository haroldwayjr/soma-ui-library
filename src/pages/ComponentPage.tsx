import { Link, useParams } from 'react-router-dom'
import { ExternalResourceLinks } from '../components/detail/ExternalResourceLinks'
import { Playground, hasPlayground } from '../components/detail/Playground'
import { PropsTable } from '../components/detail/PropsTable'
import { PageToc, ShareMenu } from '../components/detail/ShareMenu'
import { TodoPanel } from '../components/detail/TodoPanel'
import { UsageGuidelines } from '../components/detail/UsageGuidelines'
import {
  VariantGallery,
  variantTocItems,
} from '../components/detail/VariantGallery'
import { CodeBlock } from '../components/detail/CodeBlock'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'
import {
  categoryPath,
  figmaNodeUrl,
  findComponent,
  pageSlugForComponent,
} from '../lib/nav'
import { cleanPageName } from '../lib/registry'

export function ComponentPage() {
  const { categorySlug, componentSlug } = useParams()
  const component = findComponent(categorySlug, componentSlug)

  if (!component) {
    return (
      <div className="mx-auto max-w-lg space-y-6 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Not found
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Component not in registry
        </h1>
        <p className="text-[15px] leading-7 text-muted">
          No Figma component matches{' '}
          <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-sm text-ink">
            /{categorySlug}/{componentSlug}
          </code>
          .
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {categorySlug ? (
            <Link
              to={categoryPath(categorySlug)}
              className="inline-flex rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
            >
              Browse category
            </Link>
          ) : null}
          <Link
            to="/ui-library"
            className="inline-flex rounded-full bg-brand px-4 py-2.5 text-sm font-medium text-white no-underline"
          >
            Introduction
          </Link>
        </div>
      </div>
    )
  }

  const a11y = component.a11yNotes
  const notImplemented = component.implementationStatus === 'not-implemented'
  const toc = [
    ...variantTocItems(component),
    { id: 'figma', label: 'Figma' },
  ]
  const pageLabel = cleanPageName(component.page ?? component.category)

  return (
    <div className="flex items-start gap-12">
      <article className="min-w-0 flex-1 space-y-12">
        <header id="overview" className="scroll-mt-24 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                <Link
                  to={categoryPath(pageSlugForComponent(component))}
                  className="text-muted no-underline hover:text-ink"
                >
                  {pageLabel}
                </Link>
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                {component.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ShareMenu component={component} />
            </div>
          </div>

          {notImplemented && (
            <p
              className="rounded-xl border border-line bg-surface-subtle px-4 py-3 text-sm text-ink"
              role="status"
            >
              Not yet implemented in code. Specs below come from Figma — use
              the Figma link for the source of truth.
            </p>
          )}

          <p className="max-w-2xl text-[15px] leading-7 text-muted">
            {component.description && component.description !== 'TODO'
              ? component.description
              : 'A registry description has not been written for this component yet. Use the Figma node and variant matrix below.'}
          </p>

          <ExternalResourceLinks component={component} />
        </header>

        {hasPlayground(component) ? (
          <Playground key={component.nodeId} component={component} />
        ) : null}

        <VariantGallery component={component} />

        <div id="props" className="scroll-mt-24">
          <PropsTable component={component} />
        </div>

        <div id="usage" className="scroll-mt-24">
          <UsageGuidelines component={component} />
        </div>

        <section
          id="accessibility"
          className="scroll-mt-24 space-y-4 border-t border-line pt-8"
        >
          <h2 className="text-lg font-semibold text-ink">Accessibility</h2>
          {a11y ? (
            <p className="text-sm leading-6 text-muted">
              {Array.isArray(a11y) ? a11y.join(' ') : a11y}
            </p>
          ) : (
            <TodoPanel>
              Accessibility notes have not been captured in the registry yet.
            </TodoPanel>
          )}
        </section>

        <section
          id="figma"
          className="scroll-mt-24 space-y-4 border-t border-line pt-8"
        >
          <h2 className="text-lg font-semibold text-ink">Figma</h2>
          <p className="text-sm leading-6 text-muted">
            This page is linked to node{' '}
            <code className="rounded bg-surface-subtle px-1.5 py-0.5 font-mono text-ink">
              {component.nodeId}
            </code>
            {component.figmaComponentName
              ? ` (${component.figmaComponentName})`
              : ''}{' '}
            in the Soma Design System file.
          </p>
          <a
            href={figmaNodeUrl(component.nodeId)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
          >
            Open component in Figma
            <ArrowTopRightIcon />
          </a>
        </section>

        {!notImplemented && component.codeExample && (
          <section className="space-y-4 border-t border-line pt-8">
            <h2 className="text-lg font-semibold text-ink">Full example</h2>
            <CodeBlock code={component.codeExample} />
          </section>
        )}
      </article>

      <PageToc items={toc} />
    </div>
  )
}

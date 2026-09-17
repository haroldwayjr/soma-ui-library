import type { RegistryComponent } from '../../lib/registry'
import { getLiveGroups } from '../../live/renderers'
import { hasPlayground } from './Playground'
import { PreviewFrame } from './PreviewFrame'
import { TodoPanel } from './TodoPanel'

function formatCombo(properties: Record<string, unknown> | undefined): string {
  if (!properties || Object.keys(properties).length === 0) return 'Default'
  return Object.entries(properties)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' · ')
}

function format(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function FigmaVariantMatrix({ component }: { component: RegistryComponent }) {
  const variants = component.variants ?? []
  const propKeys = Array.from(
    new Set(variants.flatMap((variant) => Object.keys(variant.properties ?? {}))),
  )

  if (variants.length === 0) {
    return (
      <p className="text-sm text-muted">
        No Figma variant matrix recorded. Component set node:{' '}
        <span className="font-mono text-ink">{component.nodeId}</span>
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Figma component set{' '}
        <span className="font-mono text-ink">{component.nodeId}</span>
        {component.page ? ` · ${component.page}` : ''}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-muted">
              {propKeys.length > 0 ? (
                propKeys.map((key) => (
                  <th key={key} className="py-2 pr-4 font-semibold">
                    {key}
                  </th>
                ))
              ) : (
                <th className="py-2 pr-4 font-semibold">Variant</th>
              )}
              <th className="py-2 font-semibold">Figma node</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant, index) => (
              <tr
                key={`${formatCombo(variant.properties)}-${variant.nodeId ?? index}`}
                className="border-b border-line align-top"
              >
                {propKeys.length > 0 ? (
                  propKeys.map((key) => (
                    <td key={key} className="py-3 pr-4 font-mono text-xs text-ink">
                      {format(variant.properties?.[key])}
                    </td>
                  ))
                ) : (
                  <td className="py-3 pr-4 text-ink">
                    {formatCombo(variant.properties)}
                  </td>
                )}
                <td className="py-3 font-mono text-xs text-muted">
                  {variant.nodeId ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function VariantGallery({ component }: { component: RegistryComponent }) {
  const groups = getLiveGroups(component)
  const notImplemented = component.implementationStatus === 'not-implemented'

  if (notImplemented) {
    return (
      <section id="variants" className="scroll-mt-24 space-y-5">
        <h2 className="text-lg font-semibold text-ink">Figma variants</h2>
        <p className="text-sm leading-6 text-muted">
          Design-sourced variant matrix. No live demo or copyable example yet.
        </p>
        <FigmaVariantMatrix component={component} />
      </section>
    )
  }

  if (!groups) {
    return (
      <section id="variants" className="scroll-mt-24 space-y-5">
        <h2 className="text-lg font-semibold text-ink">Variants</h2>
        <TodoPanel>
          Matched in code, but a safe live renderer has not been added yet.
        </TodoPanel>
        <FigmaVariantMatrix component={component} />
      </section>
    )
  }

  return (
    <section id="variants" className="scroll-mt-24 space-y-10">
      <h2 className="text-lg font-semibold text-ink">Examples</h2>
      {groups.map((group) => (
        <div key={group.label} id={slugId(group.label)} className="scroll-mt-24">
          <PreviewFrame title={group.label} code={group.code}>
            {group.example}
          </PreviewFrame>
        </div>
      ))}
    </section>
  )
}

export function variantTocItems(component: RegistryComponent): {
  id: string
  label: string
}[] {
  const groups = getLiveGroups(component)
  const items: { id: string; label: string }[] = [
    { id: 'overview', label: 'Overview' },
  ]

  if (hasPlayground(component)) {
    items.push({ id: 'playground', label: 'Playground' })
  }

  if (component.implementationStatus === 'not-implemented' || !groups) {
    items.push({ id: 'variants', label: 'Figma variants' })
  } else {
    groups.forEach((group) => {
      items.push({ id: slugId(group.label), label: group.label })
    })
  }

  if ((component.props?.length ?? 0) > 0) {
    items.push({ id: 'props', label: 'Props' })
  }
  items.push({ id: 'usage', label: 'Usage' })
  items.push({ id: 'accessibility', label: 'Accessibility' })
  return items
}

function slugId(label: string): string {
  return `example-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

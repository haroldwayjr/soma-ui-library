import type { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ColorsSection } from './ColorsSection'

const TOKENS = ['colors', 'typography', 'spacing', 'radius'] as const
type FoundationToken = (typeof TOKENS)[number]

function isFoundationToken(value: string | undefined): value is FoundationToken {
  return TOKENS.includes(value as FoundationToken)
}

const TITLES: Record<FoundationToken, string> = {
  colors: 'Colors',
  typography: 'Typography',
  spacing: 'Spacing',
  radius: 'Radius',
}

const DESCRIPTIONS: Record<FoundationToken, string> = {
  colors:
    'Primitive ramps, semantic mapping, and utility transparencies sourced from the Soma Figma Colors foundation pages.',
  typography:
    'Design tokens bridged from Nova semantics into site-level CSS custom properties.',
  spacing:
    'Design tokens bridged from Nova semantics into site-level CSS custom properties.',
  radius:
    'Design tokens bridged from Nova semantics into site-level CSS custom properties.',
}

function TypographySection() {
  return (
    <div className="space-y-8 font-sans">
      <div className="space-y-2 border-b border-line pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Display</p>
        <p className="text-4xl font-semibold tracking-tight text-ink">Figtree semibold 36</p>
      </div>
      <div className="space-y-2 border-b border-line pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Heading</p>
        <p className="text-2xl font-semibold text-ink">Section heading at 24px</p>
      </div>
      <div className="space-y-2 border-b border-line pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Body</p>
        <p className="text-base leading-7 text-ink">
          Regular body text at 16px with relaxed line height for readable documentation content.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Caption</p>
        <p className="text-sm text-muted">Small supporting labels and metadata at 14px.</p>
      </div>
    </div>
  )
}

function SpacingSection() {
  const steps = [
    { token: '--lib-space-1', label: '4px' },
    { token: '--lib-space-2', label: '8px' },
    { token: '--lib-space-3', label: '12px' },
    { token: '--lib-space-4', label: '16px' },
    { token: '--lib-space-6', label: '24px' },
  ]

  return (
    <ul className="space-y-6">
      {steps.map((step) => (
        <li key={step.token} className="flex items-center gap-4">
          <div
            className="h-3 shrink-0 rounded-sm bg-brand"
            style={{ width: `var(${step.token})` }}
          />
          <div className="text-sm">
            <span className="font-mono text-ink">{step.token}</span>
            <span className="ml-2 text-muted">{step.label}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

function RadiusSection() {
  const steps = [
    { token: '--lib-radius-sm', label: 'Small (tooltip)' },
    { token: '--lib-radius-md', label: 'Medium (surface)' },
  ]

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3">
      {steps.map((step) => (
        <li key={step.token} className="space-y-3">
          <div
            className="h-24 border border-line bg-surface-subtle"
            style={{ borderRadius: `var(${step.token})` }}
          />
          <div>
            <p className="text-sm font-medium text-ink">{step.label}</p>
            <p className="font-mono text-xs text-muted">{step.token}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

const SECTIONS: Record<FoundationToken, () => ReactNode> = {
  colors: ColorsSection,
  typography: TypographySection,
  spacing: SpacingSection,
  radius: RadiusSection,
}

export function FoundationPage() {
  const { token } = useParams()
  if (!isFoundationToken(token)) {
    return <Navigate to="/ui-library/foundation/colors" replace />
  }

  const Section = SECTIONS[token]

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <nav className="text-sm" aria-label="Breadcrumb">
          <span className="text-muted/70">Foundation</span>
          <span className="mx-2 text-muted/45" aria-hidden>
            /
          </span>
          <span className="font-medium text-ink" aria-current="page">
            {TITLES[token]}
          </span>
        </nav>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">{TITLES[token]}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            {DESCRIPTIONS[token]}
          </p>
        </div>
      </header>
      <Section />
    </div>
  )
}

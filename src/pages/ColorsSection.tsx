import { useMemo, useState } from 'react'
import { SearchField } from '../components/detail/SearchField'
import { SegmentedControl } from '../components/detail/SegmentedControl'
import { ArrowTopRightIcon } from '../components/icons/ArrowTopRightIcon'
import { figmaNodeUrl } from '../lib/nav'
import {
  contrastBadge,
  formatHex,
} from '../lib/colorDisplay'
import {
  FIGMA_PRIMITIVES_NODE,
  FIGMA_SEMANTICS_NODE,
  figmaBrand,
  figmaBrandDangerTransparent,
  figmaCoolDarkTransparent,
  figmaCoolLightTransparent,
  figmaNeutrals,
  figmaRampBases,
  figmaRamps,
  figmaSemantics,
  type FigmaSemanticRow,
} from '../lib/figmaColorTokens'

type ColorTab = 'all' | 'primitives' | 'semantics' | 'utility'

const RAMP_ORDER = [
  'blue',
  'teal',
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'grey',
] as const

const RAMP_STEPS = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
] as const

const UTILITY_STEPS = [
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
] as const

const SECTION_ORDER = [
  'Text',
  'Surface',
  'Border',
  'Icon',
  'Action',
  'Focus',
  'Status',
] as const

function SectionHeading({
  title,
  description,
  count,
  figmaNode,
}: {
  title: string
  description?: string
  count?: string
  figmaNode?: string
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
        {figmaNode ? (
          <a
            href={figmaNodeUrl(figmaNode)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink no-underline hover:bg-surface-subtle"
          >
            Open in Figma
            <ArrowTopRightIcon />
          </a>
        ) : null}
        {count ? (
          <p className="text-xs font-medium text-muted">{count}</p>
        ) : null}
      </div>
    </div>
  )
}





function SwatchMeta({
  name,
  hex,
  emphasis,
  isBase,
  onDark,
}: {
  name: string
  hex: string
  /** Primary label weight — use for step numbers in ramp rows. */
  emphasis?: boolean
  isBase?: boolean
  onDark?: boolean
}) {
  const label = onDark ? 'text-white' : 'text-ink'
  const meta = onDark ? 'text-white/65' : 'text-muted'

  return (
    <div className="space-y-0.5 pt-0.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <p
          className={`truncate tracking-tight ${label} ${
            emphasis
              ? 'text-[13px] font-semibold tabular-nums'
              : 'text-[12px] font-medium'
          }`}
        >
          {name}
        </p>
        {isBase ? (
          <span
            className={`shrink-0 rounded px-1 py-px text-[9px] font-semibold uppercase tracking-wide ${
              onDark
                ? 'bg-white/15 text-white/90'
                : 'bg-surface-subtle text-muted'
            }`}
          >
            Base
          </span>
        ) : null}
      </div>
      <p
        className={`truncate font-mono text-[10px] leading-none tracking-wide tabular-nums ${meta}`}
      >
        {formatHex(hex)}
      </p>
    </div>
  )
}

function LargeSwatch({
  name,
  hex,
  bordered,
}: {
  name: string
  hex: string
  bordered?: boolean
}) {
  return (
    <li className="min-w-0 space-y-2">
      <div
        className={`h-20 overflow-hidden rounded-lg ${
          bordered ? 'border border-line' : ''
        }`}
        style={{ background: hex }}
      />
      <SwatchMeta name={name} hex={hex} />
    </li>
  )
}

function RampSwatch({
  step,
  hex,
  isBase,
}: {
  step: string
  hex: string
  isBase?: boolean
}) {
  const badge = contrastBadge(hex)
  const needsBorder = (badge?.ratio ?? 21) < 1.25

  return (
    <li className="min-w-0 space-y-1.5">
      <div
        className={`h-16 overflow-hidden rounded-lg ${
          needsBorder ? 'border border-line' : ''
        }`}
        style={{ background: hex }}
      />
      <SwatchMeta name={step} hex={hex} emphasis isBase={isBase} />
    </li>
  )
}

function UtilitySwatch({
  name,
  hex,
  stepLabel,
  onDark,
}: {
  name: string
  hex: string
  /** Short label under the swatch (e.g. step). Falls back to full name. */
  stepLabel?: string
  onDark?: boolean
}) {
  return (
    <li className="min-w-0 space-y-1.5">
      <div
        className={`relative h-16 overflow-hidden rounded-lg ${
          onDark ? '' : 'border border-line'
        }`}
        style={{
          background: onDark
            ? 'linear-gradient(135deg, #101828 0%, #1d2939 100%)'
            : `repeating-conic-gradient(#eaecf0 0% 25%, #ffffff 0% 50%) 50% / 10px 10px`,
        }}
      >
        <div className="absolute inset-0" style={{ background: hex }} />
      </div>
      <SwatchMeta
        name={stepLabel ?? name}
        hex={hex}
        emphasis={Boolean(stepLabel)}
        onDark={onDark}
      />
    </li>
  )
}

function MappingPill({
  hex,
  label,
  tone,
}: {
  hex: string
  label: string
  tone: 'light' | 'dark'
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-2 py-1 ${
        tone === 'dark'
          ? 'border-white/10 bg-[#1d2939] text-white'
          : 'border-line bg-surface text-ink'
      }`}
    >
      <span
        className="size-4 shrink-0 rounded border border-black/10"
        style={{ background: hex }}
        aria-hidden
      />
      <span className="truncate font-mono text-[11px] whitespace-nowrap">
        {label}
      </span>
    </span>
  )
}

function SemanticsTable({ rows }: { rows: FigmaSemanticRow[] }) {
  const bySection = useMemo(() => {
    const map = new Map<string, FigmaSemanticRow[]>()
    for (const row of rows) {
      const list = map.get(row.section) ?? []
      list.push(row)
      map.set(row.section, list)
    }
    return map
  }, [rows])

  const sections = [
    ...SECTION_ORDER.filter((s) => bySection.has(s)),
    ...[...bySection.keys()].filter(
      (s) => !(SECTION_ORDER as readonly string[]).includes(s),
    ),
  ]

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section} className="overflow-hidden rounded-xl border border-line">
          <div className="border-b border-line bg-surface-subtle px-4 py-2.5">
            <p className="text-sm font-semibold text-ink">{section}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-2.5 font-semibold">Token</th>
                  <th className="px-4 py-2.5 font-semibold">Light mode</th>
                  <th className="px-4 py-2.5 font-semibold">Dark mode</th>
                  <th className="px-4 py-2.5 font-semibold">Usage</th>
                </tr>
              </thead>
              <tbody>
                {(bySection.get(section) ?? []).map((row) => (
                  <tr
                    key={row.token}
                    className="border-b border-line last:border-b-0"
                  >
                    <td className="px-4 py-2.5 align-middle">
                      <code className="rounded-md bg-surface-subtle px-2 py-1 font-mono text-[12px] text-ink">
                        {row.token}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <MappingPill
                        hex={row.light}
                        label={row.lightRef}
                        tone="light"
                      />
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <MappingPill
                        hex={row.dark}
                        label={row.darkRef}
                        tone="dark"
                      />
                    </td>
                    <td className="max-w-sm px-4 py-2.5 align-middle text-[13px] leading-5 text-muted">
                      {row.usage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

function PrimitivesBlock({ families }: { families: readonly (typeof RAMP_ORDER)[number][] }) {
  return (
    <section className="space-y-16">
      <div>
        <SectionHeading
          title="Primitives"
          description="Core (primitive) colors are the atoms of the palette. Product work should consume semantic tokens instead."
          figmaNode={FIGMA_PRIMITIVES_NODE}
        />
        <div className="space-y-12">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Brand
            </p>
            <ul className="grid max-w-[180px] grid-cols-1 gap-4">
              <LargeSwatch name="brand/blue" hex={figmaBrand.blue} />
            </ul>
          </div>
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Neutrals
            </p>
            <ul className="grid max-w-[368px] grid-cols-2 gap-2">
              <LargeSwatch name="white" hex={figmaNeutrals.white} bordered />
              <LargeSwatch name="black" hex={figmaNeutrals.black} />
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <SectionHeading
          title="Color ramps"
          description="Nine-step families used by the semantic layer. Slash notation in Figma maps to dotted paths in code (blue/800 → blue.800)."
          count={`${families.length} families`}
        />
        {families.map((family) => {
          const ramp = figmaRamps[family]
          const base = figmaRampBases[family]
          return (
            <div key={family}>
              <p className="mb-3 text-sm font-semibold capitalize text-ink">
                {family === 'grey' ? 'Grey' : family}
              </p>
              <ul className="grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-9">
                {RAMP_STEPS.map((step) => (
                  <RampSwatch
                    key={step}
                    step={step}
                    hex={ramp[step]}
                    isBase={step === base}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UtilityBlock() {
  return (
    <section className="space-y-10">
      <SectionHeading
        title="Utility ramps"
        description="Translucent steps for scrims, pressed overlays, and highlights — from the Soma primitives sheet."
        figmaNode={FIGMA_PRIMITIVES_NODE}
        count="Brand/danger + cool ramps"
      />

      <div className="space-y-12">
        <div>
          <p className="mb-4 text-sm font-semibold text-ink">
            Brand / danger transparent
          </p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {figmaBrandDangerTransparent.map((swatch) => (
              <UtilitySwatch
                key={swatch.name}
                name={swatch.name}
                hex={swatch.hex}
              />
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">coolDarkTransparent</p>
          <ul className="grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-9">
            {UTILITY_STEPS.map((step) => (
              <UtilitySwatch
                key={step}
                name={`coolDarkTransparent/${step}`}
                stepLabel={step}
                hex={figmaCoolDarkTransparent[step]}
              />
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink">
            coolLightTransparent
          </p>
          <div className="rounded-2xl bg-[#101828] p-4 sm:p-5">
            <ul className="grid grid-cols-3 gap-1 sm:grid-cols-5 lg:grid-cols-9">
              {UTILITY_STEPS.map((step) => (
                <UtilitySwatch
                  key={step}
                  name={`coolLightTransparent/${step}`}
                  stepLabel={step}
                  hex={figmaCoolLightTransparent[step]}
                  onDark
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ColorsSection() {
  const [tab, setTab] = useState<ColorTab>('all')
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()

  const matchingFamilies = useMemo(() => {
    if (!needle) return RAMP_ORDER
    return RAMP_ORDER.filter(
      (family) =>
        family.includes(needle) ||
        (family === 'grey' && 'gray'.includes(needle)),
    )
  }, [needle])

  const filteredSemantics = useMemo(() => {
    if (!needle) return figmaSemantics
    return figmaSemantics.filter(
      (row) =>
        row.token.toLowerCase().includes(needle) ||
        row.lightRef.toLowerCase().includes(needle) ||
        row.darkRef.toLowerCase().includes(needle) ||
        row.usage.toLowerCase().includes(needle) ||
        row.section.toLowerCase().includes(needle),
    )
  }, [needle])

  const showPrimitives = tab === 'all' || tab === 'primitives'
  const showSemantics = tab === 'all' || tab === 'semantics'
  const showUtility = tab === 'all' || tab === 'utility'

  const brandMatch =
    !needle ||
    'brand'.includes(needle) ||
    needle.includes('brand') ||
    needle.includes('soma') ||
    figmaBrand.blue.includes(needle)

  const neutralsMatch =
    !needle ||
    needle.includes('white') ||
    needle.includes('black') ||
    needle.includes('neutral')

  const utilityMatch =
    !needle ||
    needle.includes('cool') ||
    needle.includes('util') ||
    needle.includes('trans') ||
    needle.includes('brand') ||
    needle.includes('danger')

  return (
    <div className="space-y-20">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          aria-label="Color categories"
          value={tab}
          onChange={setTab}
          options={
            [
              { value: 'all', label: 'All' },
              { value: 'primitives', label: 'Primitives' },
              { value: 'semantics', label: 'Semantics' },
              { value: 'utility', label: 'Utility' },
            ] as const
          }
        />
        <SearchField
          className="w-full sm:max-w-xs"
          size="sm"
          value={query}
          onChange={setQuery}
          placeholder="Search tokens…"
          label="Search colors"
        />
      </div>

      {showPrimitives &&
      (brandMatch || neutralsMatch || matchingFamilies.length > 0) ? (
        <PrimitivesBlock
          families={
            brandMatch || neutralsMatch || !needle
              ? matchingFamilies.length
                ? matchingFamilies
                : RAMP_ORDER
              : matchingFamilies
          }
        />
      ) : null}

      {showSemantics ? (
        <section className="space-y-8">
          <SectionHeading
            title="Semantic mapping"
            description="Contextual tokens mapped across Light and Dark mode variations."
            figmaNode={FIGMA_SEMANTICS_NODE}
            count={`${filteredSemantics.length} roles`}
          />
          {filteredSemantics.length === 0 ? (
            <p className="text-sm text-muted">No semantic tokens match.</p>
          ) : (
            <SemanticsTable rows={filteredSemantics} />
          )}
        </section>
      ) : null}

      {showUtility && utilityMatch ? <UtilityBlock /> : null}
    </div>
  )
}

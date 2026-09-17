import { useMemo, useState, type ReactNode } from 'react'
import { Switch as NovaSwitch } from '@nova/ui'
import {
  getPlaygroundConfig,
  type PlaygroundControl,
} from '../../live/playgroundConfigs'
import type { RegistryComponent } from '../../lib/registry'
import { previewFrameDark } from '../../styles/preview-frame.css'
import { SegmentedControl } from './SegmentedControl'
import { CodeBlock } from './CodeBlock'

type StateValue = string | boolean | number

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl
  value: StateValue
  onChange: (value: StateValue) => void
}) {
  const id = `playground-${control.key}`

  return (
    <label
      htmlFor={control.kind === 'boolean' ? undefined : id}
      className="flex min-w-0 flex-col items-start gap-2"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {control.label}
      </span>

      {control.kind === 'enum' ? (
        control.options.length <= 4 ? (
          <SegmentedControl
            aria-label={control.label}
            size="sm"
            value={String(value)}
            options={control.options.map((option) => ({
              value: option,
              label: option,
            }))}
            onChange={(next) => onChange(next)}
          />
        ) : (
          <select
            id={id}
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
            className="h-10 w-full cursor-pointer rounded-xl border border-line bg-surface px-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {control.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      ) : null}

      {control.kind === 'boolean' ? (
        <div className="flex h-10 items-center">
          <NovaSwitch
            aria-label={control.label}
            checked={Boolean(value)}
            onCheckedChange={(checked) => onChange(Boolean(checked))}
          />
        </div>
      ) : null}

      {control.kind === 'string' ? (
        <input
          id={id}
          type="text"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
      ) : null}

      {control.kind === 'number' ? (
        <input
          id={id}
          type="number"
          value={Number(value)}
          min={control.min}
          max={control.max}
          step={control.step ?? 1}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
      ) : null}
    </label>
  )
}

export function hasPlayground(component: RegistryComponent): boolean {
  if (
    component.implementationStatus !== 'matched' &&
    component.implementationStatus !== 'partial'
  ) {
    return false
  }
  return getPlaygroundConfig(component.name) !== null
}

export function Playground({
  component,
}: {
  component: RegistryComponent
}): ReactNode {
  const config = getPlaygroundConfig(component.name)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [state, setState] = useState<Record<string, StateValue>>(() => ({
    ...config?.defaults,
  }))

  const preview = useMemo(
    () => (config ? config.render(state) : null),
    [config, state],
  )
  const code = useMemo(
    () => (config ? config.toCode(state) : ''),
    [config, state],
  )

  if (!config || !hasPlayground(component)) return null

  const setValue = (key: string, value: StateValue) => {
    setState((current) => ({ ...current, [key]: value }))
  }

  // Interactive Switch preview: clicking the live control updates state too.
  const livePreview =
    config.name === 'Switch' ? (
      <NovaSwitch
        aria-label="Notifications"
        checked={Boolean(state.checked)}
        disabled={Boolean(state.disabled)}
        onCheckedChange={(checked) => setValue('checked', Boolean(checked))}
      />
    ) : (
      preview
    )

  return (
    <section id="playground" className="scroll-mt-24 space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-ink">Playground</h2>
        <p className="text-sm leading-6 text-muted">
          Change props and see the live{' '}
          <code className="rounded bg-surface-subtle px-1.5 py-0.5 text-[13px] text-ink">
            @nova/ui
          </code>{' '}
          component update instantly.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink">Preview</h3>
          <button
            type="button"
            aria-label={
              theme === 'light'
                ? 'Switch preview to dark'
                : 'Switch preview to light'
            }
            onClick={() =>
              setTheme((current) => (current === 'light' ? 'dark' : 'light'))
            }
            className="grid size-8 cursor-pointer place-items-center rounded-lg border border-line bg-surface text-sm hover:bg-surface-subtle"
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
        </div>
        <div
          className={`flex min-h-28 items-center overflow-hidden rounded-2xl border p-8 transition-colors duration-150 ${
            theme === 'dark'
              ? previewFrameDark
              : 'border-line bg-surface-subtle'
          }`}
        >
          {livePreview}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Controls
        </p>
        <div
          className={`grid gap-5 ${
            config.controls.length > 4
              ? 'sm:grid-cols-2'
              : 'grid-cols-1 sm:max-w-xl'
          }`}
        >
          {config.controls.map((control) => (
            <ControlRow
              key={control.key}
              control={control}
              value={state[control.key] ?? config.defaults[control.key] ?? ''}
              onChange={(value) => setValue(control.key, value)}
            />
          ))}
        </div>
      </div>

      <CodeBlock code={code} />
    </section>
  )
}

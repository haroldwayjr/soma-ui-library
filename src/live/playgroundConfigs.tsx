import type { ReactNode } from 'react'
import {
  Badge,
  Button,
  Chip,
  IconCheck,
  Switch,
} from '@nova/ui'

export type PlaygroundControl =
  | {
      kind: 'enum'
      key: string
      label: string
      options: readonly string[]
    }
  | {
      kind: 'boolean'
      key: string
      label: string
    }
  | {
      kind: 'string'
      key: string
      label: string
    }
  | {
      kind: 'number'
      key: string
      label: string
      min?: number
      max?: number
      step?: number
    }

export interface PlaygroundConfig {
  /** Registry component name match (exact, case-insensitive). */
  name: string
  controls: readonly PlaygroundControl[]
  defaults: Record<string, string | boolean | number>
  render: (state: Record<string, string | boolean | number>) => ReactNode
  toCode: (state: Record<string, string | boolean | number>) => string
}

function str(state: Record<string, string | boolean | number>, key: string): string {
  return String(state[key] ?? '')
}

function bool(state: Record<string, string | boolean | number>, key: string): boolean {
  return Boolean(state[key])
}

function formatProp(
  key: string,
  value: string | boolean | number | undefined,
): string | null {
  if (value === undefined) return null
  if (typeof value === 'boolean') return value ? key : null
  if (typeof value === 'number') return `${key}={${value}}`
  return `${key}="${value}"`
}

function joinProps(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

const BUTTON: PlaygroundConfig = {
  name: 'Button',
  defaults: {
    children: 'Continue',
    variant: 'contained',
    tone: 'brand',
    size: 'medium',
    disabled: false,
    loading: false,
    startIcon: false,
    endIcon: false,
  },
  controls: [
    { kind: 'string', key: 'children', label: 'Label' },
    {
      kind: 'enum',
      key: 'variant',
      label: 'Variant',
      options: ['contained', 'outlined', 'text'],
    },
    {
      kind: 'enum',
      key: 'tone',
      label: 'Tone',
      options: ['brand', 'danger', 'success'],
    },
    {
      kind: 'enum',
      key: 'size',
      label: 'Size',
      options: ['small', 'medium'],
    },
    { kind: 'boolean', key: 'disabled', label: 'Disabled' },
    { kind: 'boolean', key: 'loading', label: 'Loading' },
    { kind: 'boolean', key: 'startIcon', label: 'Leading icon' },
    { kind: 'boolean', key: 'endIcon', label: 'Trailing icon' },
  ],
  render: (state) => (
    <Button
      size={str(state, 'size') as 'small' | 'medium'}
      tone={str(state, 'tone') as 'brand' | 'danger' | 'success'}
      variant={str(state, 'variant') as 'contained' | 'outlined' | 'text'}
      disabled={bool(state, 'disabled')}
      loading={bool(state, 'loading')}
      startIcon={bool(state, 'startIcon') ? IconCheck : undefined}
      endIcon={bool(state, 'endIcon') ? IconCheck : undefined}
    >
      {str(state, 'children') || 'Continue'}
    </Button>
  ),
  toCode: (state) => {
    const props = joinProps([
      formatProp('size', str(state, 'size')),
      formatProp('tone', str(state, 'tone')),
      formatProp('variant', str(state, 'variant')),
      formatProp('disabled', bool(state, 'disabled') || undefined),
      formatProp('loading', bool(state, 'loading') || undefined),
      bool(state, 'startIcon') ? 'startIcon={IconCheck}' : null,
      bool(state, 'endIcon') ? 'endIcon={IconCheck}' : null,
    ])
    const label = str(state, 'children') || 'Continue'
    return `<Button ${props}>${label}</Button>`
  },
}

const BADGE: PlaygroundConfig = {
  name: 'Badge',
  defaults: {
    children: 'Label',
    size: 'medium',
    variant: 'soft',
    tone: 'brand',
    leading: 'none',
    disabled: false,
  },
  controls: [
    { kind: 'string', key: 'children', label: 'Label' },
    {
      kind: 'enum',
      key: 'size',
      label: 'Size',
      options: ['small', 'medium'],
    },
    {
      kind: 'enum',
      key: 'tone',
      label: 'Tone',
      options: ['neutral', 'brand', 'accent', 'success', 'warning', 'danger'],
    },
    {
      kind: 'enum',
      key: 'leading',
      label: 'Leading',
      options: ['none', 'dot', 'icon'],
    },
    { kind: 'boolean', key: 'disabled', label: 'Disabled' },
  ],
  render: (state) => (
    <Badge
      size={str(state, 'size') as 'small' | 'medium'}
      variant={str(state, 'variant') as 'soft'}
      tone={
        str(state, 'tone') as
          | 'neutral'
          | 'brand'
          | 'accent'
          | 'success'
          | 'warning'
          | 'danger'
      }
      leading={str(state, 'leading') as 'none' | 'dot' | 'icon'}
      disabled={bool(state, 'disabled')}
    >
      {str(state, 'children') || 'Label'}
    </Badge>
  ),
  toCode: (state) => {
    const leading = str(state, 'leading')
    const props = joinProps([
      formatProp('size', str(state, 'size')),
      formatProp('tone', str(state, 'tone')),
      formatProp('variant', str(state, 'variant')),
      leading !== 'none' ? formatProp('leading', leading) : null,
      formatProp('disabled', bool(state, 'disabled') || undefined),
    ])
    return `<Badge ${props}>${str(state, 'children') || 'Label'}</Badge>`
  },
}

const SWITCH: PlaygroundConfig = {
  name: 'Switch',
  defaults: {
    checked: false,
    disabled: false,
  },
  controls: [
    { kind: 'boolean', key: 'checked', label: 'Checked' },
    { kind: 'boolean', key: 'disabled', label: 'Disabled' },
  ],
  render: (state) => (
    <Switch
      aria-label="Notifications"
      checked={bool(state, 'checked')}
      disabled={bool(state, 'disabled')}
      onCheckedChange={() => undefined}
    />
  ),
  toCode: (state) => {
    const props = joinProps([
      'aria-label="Notifications"',
      formatProp('checked', bool(state, 'checked') || undefined),
      formatProp('disabled', bool(state, 'disabled') || undefined),
    ])
    return `<Switch ${props} />`
  },
}

const CHIP: PlaygroundConfig = {
  name: 'Chip',
  defaults: {
    children: 'Label',
    variant: 'filled',
    disabled: false,
    dismissible: false,
  },
  controls: [
    { kind: 'string', key: 'children', label: 'Label' },
    {
      kind: 'enum',
      key: 'variant',
      label: 'Variant',
      options: ['filled', 'outlined'],
    },
    { kind: 'boolean', key: 'disabled', label: 'Disabled' },
    { kind: 'boolean', key: 'dismissible', label: 'Dismissible' },
  ],
  render: (state) => {
    const label = str(state, 'children') || 'Label'
    const variant = str(state, 'variant') as 'filled' | 'outlined'
    const disabled = bool(state, 'disabled')
    if (bool(state, 'dismissible')) {
      return (
        <Chip
          variant={variant}
          disabled={disabled}
          dismissLabel={`Remove ${label}`}
          onDismiss={() => undefined}
        >
          {label}
        </Chip>
      )
    }
    return (
      <Chip variant={variant} disabled={disabled}>
        {label}
      </Chip>
    )
  },
  toCode: (state) => {
    const label = str(state, 'children') || 'Label'
    const base = joinProps([
      formatProp('variant', str(state, 'variant')),
      formatProp('disabled', bool(state, 'disabled') || undefined),
    ])
    if (bool(state, 'dismissible')) {
      return `<Chip ${base} dismissLabel="Remove ${label}" onDismiss={…}>${label}</Chip>`
    }
    return `<Chip ${base}>${label}</Chip>`
  },
}

const CONFIGS: PlaygroundConfig[] = [BUTTON, BADGE, SWITCH, CHIP]

export function getPlaygroundConfig(
  componentName: string,
): PlaygroundConfig | null {
  const needle = componentName.trim().toLowerCase()
  return CONFIGS.find((config) => config.name.toLowerCase() === needle) ?? null
}

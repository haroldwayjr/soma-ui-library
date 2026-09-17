import { getDisplayStatus, type RegistryComponent } from '../../lib/registry'

const styles = {
  Done: 'bg-success/10 text-success',
  'In progress': 'bg-brand/10 text-brand',
  Blocked: 'bg-danger/10 text-danger',
  'Not started': 'border border-line bg-transparent text-muted',
  'Not implemented': 'bg-surface-subtle text-muted',
  'Status unknown': 'border border-dashed border-line bg-transparent text-muted',
}

const labels = {
  Done: 'Done',
  'In progress': 'In progress',
  Blocked: 'Blocked',
  'Not started': 'Not started',
  'Not implemented': 'Not yet implemented in code',
  'Status unknown': 'Status unknown',
} as const

export function StatusBadge({ component }: { component: RegistryComponent }) {
  const status = getDisplayStatus(component)
  return (
    <span className={`inline-flex max-w-52 rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

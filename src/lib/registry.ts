import registryJson from '../../registry.json'

export type DisplayStatus =
  | 'Done'
  | 'In progress'
  | 'Blocked'
  | 'Not started'
  | 'Not implemented'
  | 'Status unknown'

export interface RegistryProp {
  name: string
  figmaValues?: unknown[]
  codeProp?: string | null
  implementationStatus?: string
  notes?: string | null
  default?: unknown
  required?: boolean
}

export interface RegistryVariant {
  properties?: Record<string, unknown>
  nodeId?: string
  implementationStatus?: string
}

export interface RegistryComponent {
  name: string
  figmaComponentName?: string | null
  category?: string | null
  page?: string | null
  nodeId: string
  description?: string | null
  buildStatus?: string | null
  importPath?: string | null
  implementationStatus?: string | null
  props?: RegistryProp[]
  variants?: RegistryVariant[]
  codeExample?: string | null
  a11yNotes?: string | string[] | null
  gaps?: unknown[]
  notApplicable?: unknown[]
}

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Display / URL page name without trailing (WIP). */
export function cleanPageName(page: string | null | undefined): string {
  return (page ?? 'Uncategorized').replace(/\s*\(WIP\)\s*$/i, '').trim()
}

export function pageSlug(page: string | null | undefined): string {
  return slugify(cleanPageName(page))
}

export function isDeletedComponent(component: RegistryComponent): boolean {
  const haystack =
    `${component.name} ${component.figmaComponentName ?? ''}`.toLowerCase()
  return (
    haystack.includes('_deleted') ||
    haystack.includes('do not use') ||
    haystack.includes('do-not-use')
  )
}

export function getDisplayStatus(component: RegistryComponent): DisplayStatus {
  if (component.implementationStatus === 'not-implemented') {
    return 'Not implemented'
  }
  if (
    component.buildStatus === 'Done' ||
    component.buildStatus === 'In progress' ||
    component.buildStatus === 'Blocked' ||
    component.buildStatus === 'Not started'
  ) {
    return component.buildStatus
  }
  return 'Status unknown'
}

const rawComponents = (registryJson as { components: RegistryComponent[] })
  .components
const seen = new Set<string>()

export const components = rawComponents.filter((component) => {
  if (isDeletedComponent(component)) return false
  const key = `${component.name}\u0000${component.nodeId}`
  if (seen.has(key)) return false
  seen.add(key)
  return true
})

/** Stable URL slug; appends node id when the same page has duplicate names. */
export function componentSlug(component: RegistryComponent): string {
  const base = slugify(component.name)
  const page = pageSlug(component.page)
  const siblings = components.filter(
    (candidate) =>
      pageSlug(candidate.page) === page && slugify(candidate.name) === base,
  )
  if (siblings.length <= 1) return base
  const primary = siblings[0]
  if (primary && primary.nodeId === component.nodeId) return base
  return `${base}-${component.nodeId.replace(/:/g, '-')}`
}

import type { RegistryComponent } from './registry'

/** Upstream Nova UI package in ConsultingMD/nova-care-app. */
export const NOVA_UI_GITHUB_ROOT =
  'https://github.com/ConsultingMD/nova-care-app/tree/main/libs/ui'

/** Published @nova/ui Storybook (Chromatic). */
export const NOVA_UI_STORYBOOK_ROOT =
  'https://6a7a0344962c55c3354c2052-eobdrczgls.chromatic.com'

const FOLDER_ALIASES: Record<string, string> = {
  'avatar-presence-dot': 'avatar',
  'badge-count': 'badge',
  'button-avatar': 'button-avatar',
  'button-link': 'button-link',
  'card-notice': 'card',
  'checkbox-control': 'checkbox',
  'checkbox-group': 'checkbox',
  'checkbox-item': 'checkbox',
  'chip-dismiss': 'chip',
  'choice-chip': 'chip',
  'input-email': 'text-input',
  'input-phone': 'text-input',
  'input-website': 'text-input',
  'password-input': 'text-input',
  'progress-bar': 'progress',
  'radio-control': 'radio',
  'radio-group': 'radio',
  'radio-item': 'radio',
  'search-input': 'text-input',
  'select-field': 'select-field',
  'select-item': 'select',
  'select-popup': 'select',
  'select-popup-panel': 'select',
  'select-trigger': 'select',
  'table-cell-actions': 'table',
  'table-cell-avatar': 'table',
  'table-cell-badge': 'table',
  'table-cell-chips': 'table',
  'table-cell-select': 'table',
  'table-cell-text': 'table',
  'table-empty-state': 'table',
  'table-header-cell': 'table',
  'table-header-row': 'table',
  'table-results': 'table',
  'table-row': 'table',
  'text-input': 'text-input',
  'logo-dot': 'logomark',
  'logo-dot-lockup': 'logomark',
  'logo-care-app': 'logomark',
  'logo-included-health': 'logomark',
}

/** Folders that exist under libs/ui/src/components in the vendored Nova tree. */
const KNOWN_FOLDERS = new Set([
  'avatar',
  'badge',
  'button',
  'button-avatar',
  'button-link',
  'card',
  'checkbox',
  'chip',
  'field',
  'icon',
  'icon-button',
  'link',
  'link-button',
  'logomark',
  'pagination',
  'progress',
  'radio',
  'select',
  'select-field',
  'stack',
  'switch',
  'table',
  'text-field',
  'text-input',
  'tooltip',
  'typography',
])

/**
 * Storybook story ids on Chromatic (`?path=/story/{id}`).
 * Prefer the published Playground story when one exists.
 */
const STORYBOOK_STORY_IDS: Record<string, string> = {
  avatar: 'components-avatar-avatar--playground',
  badge: 'components-badge--playground',
  // Published Chromatic id (not components-button-button from local title).
  button: 'components-button--playground',
  'button-avatar': 'components-avatar-buttonavatar--playground',
  'button-link': 'components-link-buttonlink--playground',
  card: 'components-card--playground',
  checkbox: 'components-checkbox--playground',
  chip: 'components-chip--playground',
  field: 'forms-field--playground',
  icon: 'components-icon--playground',
  'icon-button': 'components-button-iconbutton--playground',
  link: 'components-link-link--playground',
  'link-button': 'components-button-linkbutton--playground',
  logomark: 'components-logomark--playground',
  pagination: 'components-pagination-pagination--playground',
  progress: 'components-progress--playground',
  radio: 'components-radio--playground',
  select: 'forms-select-select--playground',
  'select-field': 'forms-select-selectfield--playground',
  stack: 'layout-stack--playground',
  switch: 'components-switch--playground',
  table: 'components-table--playground',
  'text-field': 'forms-textinput-textfield--playground',
  'text-input': 'forms-textinput-textinput--playground',
  tooltip: 'components-tooltip--playground',
  typography: 'components-typography--playground',
}

function kebab(name: string): string {
  return name
    .toLowerCase()
    .replace(/[/·]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Best-effort Nova source folder for a registry component. */
export function novaComponentFolder(
  component: RegistryComponent,
): string | null {
  const base = kebab(component.name)
  const candidates = [
    FOLDER_ALIASES[base],
    base,
    base.split('-')[0],
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    if (KNOWN_FOLDERS.has(candidate)) return candidate
  }
  return null
}

export function githubSourceUrl(component: RegistryComponent): string {
  const folder = novaComponentFolder(component)
  if (!folder) return NOVA_UI_GITHUB_ROOT
  return `${NOVA_UI_GITHUB_ROOT}/src/components/${folder}`
}

/** Chromatic Storybook URL for the component Playground story. */
export function storybookSourceUrl(component: RegistryComponent): string {
  const folder = novaComponentFolder(component)
  const storyId = folder ? STORYBOOK_STORY_IDS[folder] : undefined
  if (!storyId) return NOVA_UI_STORYBOOK_ROOT
  return `${NOVA_UI_STORYBOOK_ROOT}/?path=/story/${storyId}`
}

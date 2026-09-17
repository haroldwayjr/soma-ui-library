import registryJson from '../../registry.json'
import type { RegistryComponent } from './registry'
import {
  cleanPageName,
  componentSlug,
  components,
  pageSlug,
  slugify,
} from './registry'

/** Figma-mirrored site IA (sidebar groups). */
export type NavGroupId =
  | 'getting-started'
  | 'resources'
  | 'foundation'
  | 'base'
  | 'patterns'
  | 'app'

export interface NavLink {
  kind: 'link'
  label: string
  to: string
  external?: boolean
  /** Match only this exact path (no prefix). */
  end?: boolean
}

export interface NavPageGroup {
  kind: 'page'
  label: string
  slug: string
  components: RegistryComponent[]
}

export type NavItem = NavLink | NavPageGroup

export interface NavGroup {
  id: NavGroupId
  label: string
  items: NavItem[]
}

/** Figma page → site section (mirrors Soma file IA). */
const PAGE_GROUP: Record<string, NavGroupId> = {
  // Base
  Buttons: 'base',
  'Text links': 'base',
  Inputs: 'base',
  Checkbox: 'base',
  Radio: 'base',
  Switches: 'base',
  Select: 'base',
  'Multi-select': 'base',
  Chips: 'base',
  Badges: 'base',
  Cards: 'base',
  Tooltips: 'base',
  Popovers: 'base',
  Modals: 'base',
  Pagination: 'base',
  'Progress Indicators': 'base',
  Spinners: 'base',
  Sliders: 'base',
  Logos: 'base',
  Illustrations: 'base',
  Icons: 'base',
  // Patterns
  Avatars: 'patterns',
  Tables: 'patterns',
  Breadcrumbs: 'patterns',
  Tabs: 'patterns',
  Dropdowns: 'patterns',
  Lists: 'patterns',
  Steppers: 'patterns',
  'Alerts (WIP)': 'patterns',
  'Chat bubbles': 'patterns',
  'Form sections (WIP)': 'patterns',
  'View switcher (WIP)': 'patterns',
  // App
  'App components (WIP)': 'app',
}

const GROUP_ORDER: NavGroupId[] = [
  'getting-started',
  'resources',
  'foundation',
  'base',
  'patterns',
  'app',
]

const GROUP_LABELS: Record<NavGroupId, string> = {
  'getting-started': 'Getting started',
  resources: 'Resources',
  foundation: 'Foundation',
  base: 'Base components',
  patterns: 'Patterns',
  app: 'App examples',
}

function componentsForPage(page: string): RegistryComponent[] {
  return components
    .filter((component) => (component.page ?? 'Uncategorized') === page)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const pages = [
  ...new Set(
    (registryJson as { components: RegistryComponent[] }).components.map(
      (component) => component.page ?? 'Uncategorized',
    ),
  ),
].sort((a, b) => a.localeCompare(b))

function buildPageItems(groupId: NavGroupId): NavPageGroup[] {
  return pages
    .filter((page) => (PAGE_GROUP[page] ?? 'patterns') === groupId)
    .map((page) => ({
      kind: 'page' as const,
      label: cleanPageName(page),
      slug: pageSlug(page),
      components: componentsForPage(page),
    }))
    .filter((item) => item.components.length > 0)
}

export const navGroups: NavGroup[] = GROUP_ORDER.map((id) => {
  if (id === 'getting-started') {
    return {
      id,
      label: GROUP_LABELS[id],
      items: [
        {
          kind: 'link',
          label: 'Introduction',
          to: '/ui-library',
          end: true,
        },
        {
          kind: 'link',
          label: 'Get started',
          to: '/ui-library?section=get-started',
          end: true,
        },
      ],
    }
  }

  if (id === 'resources') {
    return {
      id,
      label: GROUP_LABELS[id],
      items: [
        { kind: 'link', label: 'Icons', to: '/ui-library/resources/icons' },
        { kind: 'link', label: 'Avatars', to: '/ui-library/resources/avatars' },
        {
          kind: 'link',
          label: 'Figma file',
          to: 'https://www.figma.com/design/hB1NzwMnZt2ALeR0OslaWi/Soma-Design-System',
          external: true,
        },
        {
          kind: 'link',
          label: 'Registry JSON',
          to: '/registry.json',
          external: true,
        },
        { kind: 'link', label: 'llms.txt', to: '/llms.txt', external: true },
      ],
    }
  }

  if (id === 'foundation') {
    return {
      id,
      label: GROUP_LABELS[id],
      items: [
        { kind: 'link', label: 'Colors', to: '/ui-library/foundation/colors' },
        {
          kind: 'link',
          label: 'Typography',
          to: '/ui-library/foundation/typography',
        },
        { kind: 'link', label: 'Spacing', to: '/ui-library/foundation/spacing' },
        { kind: 'link', label: 'Radius', to: '/ui-library/foundation/radius' },
      ],
    }
  }

  return {
    id,
    label: GROUP_LABELS[id],
    items: buildPageItems(id),
  }
})

export function pageSlugForComponent(component: RegistryComponent): string {
  return pageSlug(component.page)
}

export function componentPath(component: RegistryComponent): string {
  return `/ui-library/${pageSlugForComponent(component)}/${componentSlug(component)}`
}

export function categoryPath(pageSlugValue: string): string {
  return `/ui-library/${pageSlugValue}`
}

/** Accept both cleaned and legacy `*-wip` page slugs. */
function pageSlugMatches(
  component: RegistryComponent,
  routeSlug: string,
): boolean {
  const clean = pageSlug(component.page)
  if (clean === routeSlug) return true
  const raw = slugify(component.page ?? 'uncategorized')
  return raw === routeSlug
}

export function findComponent(
  pageSlugParam: string | undefined,
  componentSlugParam: string | undefined,
): RegistryComponent | undefined {
  if (!pageSlugParam || !componentSlugParam) return undefined
  return components.find(
    (component) =>
      pageSlugMatches(component, pageSlugParam) &&
      componentSlug(component) === componentSlugParam,
  )
}

export function findCategory(
  pageSlugParam: string | undefined,
): { label: string; slug: string; components: RegistryComponent[] } | undefined {
  if (!pageSlugParam) return undefined
  const groups = navGroups.flatMap((group) =>
    group.items.filter((item): item is NavPageGroup => item.kind === 'page'),
  )
  const match = groups.find(
    (group) =>
      group.slug === pageSlugParam ||
      slugify(`${group.label} (WIP)`) === pageSlugParam,
  )
  if (match) return match

  // Fallback: any components whose page slug matches (incl. legacy wip).
  const matched = components.filter((component) =>
    pageSlugMatches(component, pageSlugParam),
  )
  if (matched.length === 0) return undefined
  return {
    label: cleanPageName(matched[0]?.page),
    slug: pageSlug(matched[0]?.page),
    components: matched.sort((a, b) => a.name.localeCompare(b.name)),
  }
}

export const FIGMA_FILE_KEY = 'hB1NzwMnZt2ALeR0OslaWi'

export function figmaNodeUrl(nodeId: string): string {
  const node = nodeId.replace(':', '-')
  return `https://www.figma.com/design/${FIGMA_FILE_KEY}/Soma-Design-System?node-id=${encodeURIComponent(node)}`
}

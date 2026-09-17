export type ColorScheme = 'dark' | 'light'

export const COLOR_SCHEME_STORAGE_KEY = 'nova:data-theme'

const isColorScheme = (value: string): value is ColorScheme =>
  value === 'dark' || value === 'light'

export function applyColorScheme(scheme: ColorScheme): void {
  document.documentElement.setAttribute('data-theme', scheme)
  try {
    localStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme)
  } catch {
    // Storage may be unavailable in private browsing or locked-down contexts.
  }
}

export function initColorScheme(): void {
  const stored = readStoredColorScheme()
  if (stored !== undefined) {
    document.documentElement.setAttribute('data-theme', stored)
  }
}

export function readStoredColorScheme(): ColorScheme | undefined {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_STORAGE_KEY)
    if (stored === null || !isColorScheme(stored)) {
      return undefined
    }
    return stored
  } catch {
    return undefined
  }
}

export function resolveColorScheme(
  root: HTMLElement = document.documentElement,
): ColorScheme {
  const explicit = root.getAttribute('data-theme')
  if (explicit === 'dark') {
    return 'dark'
  }
  if (explicit === 'light') {
    return 'light'
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

export function subscribeColorScheme(onStoreChange: () => void): () => void {
  const notify = (): void => {
    queueMicrotask(onStoreChange)
  }

  const observer = new MutationObserver(notify)
  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
    attributes: true,
  })

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', notify)

  return () => {
    observer.disconnect()
    media.removeEventListener('change', notify)
  }
}

export function toggleColorScheme(): ColorScheme {
  const next = resolveColorScheme() === 'dark' ? 'light' : 'dark'
  applyColorScheme(next)
  return next
}

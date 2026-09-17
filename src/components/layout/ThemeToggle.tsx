import { useSyncExternalStore } from 'react'
import {
  resolveColorScheme,
  subscribeColorScheme,
  toggleColorScheme,
} from '@nova/ui/helper/colorScheme'

export function ThemeToggle() {
  const scheme = useSyncExternalStore(
    subscribeColorScheme,
    () => resolveColorScheme(),
    () => 'light',
  )

  return (
    <button
      type="button"
      onClick={toggleColorScheme}
      className="grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-base text-ink transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--lib-text)_8%,transparent)]"
      aria-label={`Switch to ${scheme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${scheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {scheme === 'dark' ? '☀' : '◐'}
    </button>
  )
}

import { type ReactElement, useSyncExternalStore } from 'react'

import { IconMoon, IconSun } from '../../components/icon'
import { IconButton } from '../../components/icon-button'
import {
  resolveColorScheme,
  subscribeColorScheme,
  toggleColorScheme,
} from '../../helper/colorScheme'

export function AppHeaderThemeToggle(): ReactElement {
  const scheme = useSyncExternalStore(
    subscribeColorScheme,
    resolveColorScheme,
    () => 'light' as const,
  )
  const dark = scheme === 'dark'

  return (
    <IconButton
      icon={dark ? IconSun : IconMoon}
      onClick={() => {
        toggleColorScheme()
      }}
      size="medium"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      tone="brand"
      variant="text"
    />
  )
}

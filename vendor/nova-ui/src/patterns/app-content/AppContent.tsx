import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { appContentRecipe } from './AppContent.css'

export type AppContentBackground = 'default' | 'subtle'

export type AppContentPadding = 'md' | 'none' | 'sm'

export interface AppContentProps {
  /**
   * Page canvas fill. `default` is `surface.default` (white in light);
   * `subtle` is `surface.subtle` (grey 100 in light). Required — screens
   * disagree, so there is no implicit canvas.
   */
  background: AppContentBackground
  children: ReactNode
  className?: string
  /**
   * Inset around the route. `md` is `space[24]`, `sm` is `space[20]`.
   * `none` is flush — a full-bleed table or a nested `Card` owns its own
   * chrome. Required — inset is a per-screen choice.
   */
  padding: AppContentPadding
}

export function AppContent({
  background,
  children,
  className,
  padding,
}: AppContentProps): ReactElement {
  return (
    <main className={cx(appContentRecipe({ background, padding }), className)}>
      {children}
    </main>
  )
}

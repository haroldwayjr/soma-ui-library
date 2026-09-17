import type { ReactElement, ReactNode } from 'react'

import {
  brandStyle,
  rootStyle,
  startStyle,
  trailingStyle,
} from './AppHeader.css'

export interface AppHeaderProps {
  /** Wordmark / logotype. Centered in the 56px bar, before the tabs. */
  brand?: ReactNode
  /** Primary nav. Stretch to the bar height. */
  children?: ReactNode
  /** Header actions — IconButtons and ButtonAvatar on the Soma master. */
  trailing?: ReactNode
}

export function AppHeaderRoot({
  brand,
  children,
  trailing,
}: AppHeaderProps): ReactElement {
  return (
    <header className={rootStyle}>
      <div className={startStyle}>
        {brand === undefined ? null : <div className={brandStyle}>{brand}</div>}
        {children}
      </div>
      {trailing === undefined ? null : (
        <div className={trailingStyle}>{trailing}</div>
      )}
    </header>
  )
}

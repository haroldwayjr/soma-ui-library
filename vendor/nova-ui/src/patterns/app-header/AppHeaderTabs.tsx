import type { CSSProperties, ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { tabsNavStyle } from './AppHeader.css'

export type AppHeaderTabsProps = (
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string }
) & {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function AppHeaderTabs({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  style,
}: AppHeaderTabsProps): ReactElement {
  return (
    <nav
      className={cx(tabsNavStyle, className)}
      style={style}
      {...(ariaLabel === undefined ? {} : { 'aria-label': ariaLabel })}
      {...(ariaLabelledBy === undefined
        ? {}
        : { 'aria-labelledby': ariaLabelledBy })}
    >
      {children}
    </nav>
  )
}

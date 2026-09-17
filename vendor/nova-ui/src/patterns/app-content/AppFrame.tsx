import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { appFrameStyle } from './AppFrame.css'

export interface AppFrameProps {
  children: ReactNode
  className?: string
}

export function AppFrame({ children, className }: AppFrameProps): ReactElement {
  return <div className={cx(appFrameStyle, className)}>{children}</div>
}

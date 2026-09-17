import type { ReactElement, ReactNode } from 'react'

import { trailingActionStyle } from './AppHeader.css'

export interface AppHeaderActionProps {
  children: ReactNode
}

export function AppHeaderAction({
  children,
}: AppHeaderActionProps): ReactElement {
  return <div className={trailingActionStyle}>{children}</div>
}

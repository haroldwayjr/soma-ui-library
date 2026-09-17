import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { groupStyle } from './Table.css'

export interface TableBodyProps {
  children: ReactNode
  className?: string
}

export function TableBody({
  children,
  className,
}: TableBodyProps): ReactElement {
  return (
    <div
      className={cx(groupStyle, className)}
      data-table-group="body"
      role="rowgroup"
    >
      {children}
    </div>
  )
}

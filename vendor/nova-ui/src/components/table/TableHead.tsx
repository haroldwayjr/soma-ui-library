import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { groupStyle } from './Table.css'

export interface TableHeadProps {
  children: ReactNode
  className?: string
}

export function TableHead({
  children,
  className,
}: TableHeadProps): ReactElement {
  return (
    <div
      className={cx(groupStyle, className)}
      data-table-group="head"
      role="rowgroup"
    >
      {children}
    </div>
  )
}

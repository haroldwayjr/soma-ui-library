import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { rowStyle } from './Table.css'

export interface TableRowProps {
  children: ReactNode
  className?: string
  selected?: boolean
}

export function TableRow({
  children,
  className,
  selected,
}: TableRowProps): ReactElement {
  return (
    <div
      className={cx(rowStyle, className)}
      role="row"
      {...(selected === undefined ? {} : { 'aria-selected': selected })}
    >
      {children}
    </div>
  )
}

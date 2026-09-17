import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { headerCellRecipe } from './Table.css'

export interface TableHeaderCellProps {
  align?: 'center' | 'start'
  'aria-label'?: string
  children?: ReactNode
  className?: string
}

export function TableHeaderCell({
  align = 'start',
  'aria-label': ariaLabel,
  children,
  className,
}: TableHeaderCellProps): ReactElement {
  return (
    <div
      aria-label={ariaLabel}
      className={cx(headerCellRecipe({ align }), className)}
      role="columnheader"
    >
      {children}
    </div>
  )
}

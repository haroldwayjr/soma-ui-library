import type { ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { cellRecipe, cellTruncateRecipe } from './Table.css'

export interface TableCellProps {
  align?: 'center' | 'start'
  children: ReactNode
  className?: string
  truncate?: boolean
}

export function TableCell({
  align = 'start',
  children,
  className,
  truncate = false,
}: TableCellProps): ReactElement {
  return (
    <div className={cx(cellRecipe({ align }), className)} role="cell">
      {truncate ? (
        <span className={cellTruncateRecipe({ align })}>{children}</span>
      ) : (
        children
      )}
    </div>
  )
}

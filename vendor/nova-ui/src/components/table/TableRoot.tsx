import type { CSSProperties, ReactElement, ReactNode } from 'react'

import { cx } from '../../helper/cx'
import { rootStyle } from './Table.css'
import { type TableColumn, tableTemplate } from './tableColumns'

export type TableRootProps = (
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string }
) & {
  children: ReactNode
  className?: string
  columns: readonly TableColumn[]
  style?: CSSProperties
}

export function TableRoot({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  columns,
  style,
}: TableRootProps): ReactElement {
  return (
    <div
      aria-colcount={columns.length}
      className={cx(rootStyle, className)}
      role="table"
      style={{ ...style, gridTemplateColumns: tableTemplate(columns) }}
      {...(ariaLabel === undefined ? {} : { 'aria-label': ariaLabel })}
      {...(ariaLabelledBy === undefined
        ? {}
        : { 'aria-labelledby': ariaLabelledBy })}
    >
      {children}
    </div>
  )
}

import type { ReactElement } from 'react'

import { ellipsisStyle } from './Pagination.css'

export function PaginationEllipsis(): ReactElement {
  return (
    <span aria-hidden="true" className={ellipsisStyle}>
      …
    </span>
  )
}

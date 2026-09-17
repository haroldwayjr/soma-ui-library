import type { ReactElement } from 'react'

import { Button as BaseButton } from '@base-ui/react/button'

import { cx } from '../../helper/cx'
import { pageNumberRecipe } from './Pagination.css'

export interface PaginationPageNumberProps {
  current?: boolean
  onClick?: (() => void) | undefined
  page: number
}

export function PaginationPageNumber({
  current = false,
  onClick,
  page,
}: PaginationPageNumberProps): ReactElement {
  return (
    <BaseButton
      {...(current ? { 'aria-current': 'page' as const } : {})}
      aria-label={`Page ${String(page)}`}
      className={cx(pageNumberRecipe({ current }))}
      onClick={onClick}
      type="button"
    >
      {page}
    </BaseButton>
  )
}

import type { ReactElement } from 'react'

import { cx } from '../../helper/cx'
import { getPaginationRange } from './getPaginationRange'
import { navStyle, pagesStyle } from './Pagination.css'
import { PaginationArrow } from './PaginationArrow'
import { PaginationEllipsis } from './PaginationEllipsis'
import { PaginationPageNumber } from './PaginationPageNumber'
import { resolvePaginationInput } from './paginationValidation'

export interface PaginationProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
  onPageChange: (page: number) => void
  page: number
  pageCount: number
}

export function Pagination({
  'aria-label': ariaLabel = 'Pagination',
  'aria-labelledby': ariaLabelledBy,
  className,
  onPageChange,
  page,
  pageCount,
}: PaginationProps): ReactElement {
  const resolved = resolvePaginationInput(page, pageCount)

  if (resolved.kind === 'invalid-page-count') {
    return (
      <nav
        aria-label={ariaLabelledBy === undefined ? ariaLabel : undefined}
        aria-labelledby={ariaLabelledBy}
        className={cx(navStyle, className)}
      />
    )
  }

  const { displayPage, pageCount: validPageCount } = resolved
  const range = getPaginationRange(displayPage, validPageCount)
  const previousDisabled = displayPage <= 1
  const nextDisabled = displayPage >= validPageCount

  return (
    <nav
      aria-label={ariaLabelledBy === undefined ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      className={cx(navStyle, className)}
    >
      <PaginationArrow
        direction="previous"
        disabled={previousDisabled}
        onClick={
          previousDisabled
            ? undefined
            : (): void => {
                onPageChange(displayPage - 1)
              }
        }
      />
      <div className={pagesStyle}>
        {range.map((item, index) => {
          if (item === 'ellipsis') {
            return <PaginationEllipsis key={`ellipsis-${String(index)}`} />
          }

          const current = item === displayPage

          return (
            <PaginationPageNumber
              current={current}
              key={item}
              onClick={
                current
                  ? undefined
                  : (): void => {
                      onPageChange(item)
                    }
              }
              page={item}
            />
          )
        })}
      </div>
      <PaginationArrow
        direction="next"
        disabled={nextDisabled}
        onClick={
          nextDisabled
            ? undefined
            : (): void => {
                onPageChange(displayPage + 1)
              }
        }
      />
    </nav>
  )
}

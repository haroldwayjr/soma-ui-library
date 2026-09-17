import type { ReactElement } from 'react'

import { useId } from 'react'

import { Pagination } from '../../components/pagination'
import { Select, type SelectItem } from '../../components/select'
import { cx } from '../../helper/cx'
import {
  pageSizeClusterStyle,
  pageSizeLabelStyle,
  pageSizeSelectStyle,
  rootStyle,
  type TablePaginationSize,
} from './TablePagination.css'
import {
  getPageSizeLabelText,
  normalizePageSizeOptions,
  resolveSelectPageSize,
} from './tablePaginationValidation'

export interface TablePaginationPageSizeChangeDetails {
  page: 1
  pageSize: number
}

export interface TablePaginationProps {
  className?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (details: TablePaginationPageSizeChangeDetails) => void
  page: number
  pageCount: number
  pageSize: number
  pageSizeOptions: readonly number[]
  paginationLabel?: string
  paginationLabelledBy?: string
  size?: TablePaginationSize
}

export function TablePagination({
  className,
  onPageChange,
  onPageSizeChange,
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  paginationLabel = 'Pagination',
  paginationLabelledBy,
  size = 'small',
}: TablePaginationProps): null | ReactElement {
  const labelId = useId()
  const normalizedOptions = normalizePageSizeOptions(pageSizeOptions)

  if (normalizedOptions.length === 0) {
    return null
  }

  const selectValue = resolveSelectPageSize(pageSize, normalizedOptions)
  const items: SelectItem<string>[] = normalizedOptions.map((option) => ({
    label: String(option),
    value: String(option),
  }))

  return (
    <div className={cx(rootStyle, className)}>
      <Pagination
        {...(paginationLabelledBy === undefined
          ? { 'aria-label': paginationLabel }
          : { 'aria-labelledby': paginationLabelledBy })}
        onPageChange={onPageChange}
        page={page}
        pageCount={pageCount}
      />
      <div className={pageSizeClusterStyle}>
        <span className={pageSizeLabelStyle} id={labelId}>
          {getPageSizeLabelText()}
        </span>
        <Select
          aria-labelledby={labelId}
          className={pageSizeSelectStyle}
          items={items}
          onValueChange={(value) => {
            if (value === null) {
              return
            }

            const nextPageSize = Number(value)
            if (nextPageSize === pageSize) {
              return
            }

            onPageSizeChange({
              page: 1,
              pageSize: nextPageSize,
            })
          }}
          size={size}
          value={selectValue}
        />
      </div>
    </div>
  )
}

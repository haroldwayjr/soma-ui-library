import {
  isPaginationInteger,
  warnPaginationOnce,
} from '../../components/pagination/paginationValidation'

const PAGE_SIZE_LABEL = 'Rows per page'

export function getPageSizeLabelText(): string {
  return PAGE_SIZE_LABEL
}

export function normalizePageSizeOptions(
  pageSizeOptions: readonly number[],
): readonly number[] {
  if (pageSizeOptions.length === 0) {
    if (import.meta.env.DEV) {
      throw new Error(
        '@nova/ui TablePagination: pageSizeOptions must contain at least one value',
      )
    }
    return []
  }

  const normalized: number[] = []
  const seen = new Set<number>()

  pageSizeOptions.forEach((option) => {
    if (!isPaginationInteger(option) || option <= 0) {
      if (import.meta.env.DEV) {
        throw new Error(
          `@nova/ui TablePagination: pageSizeOptions must be unique positive integers, received ${String(option)}`,
        )
      }
      return
    }

    if (seen.has(option)) {
      if (import.meta.env.DEV) {
        throw new Error(
          '@nova/ui TablePagination: pageSizeOptions must be unique positive integers',
        )
      }
      return
    }

    seen.add(option)
    normalized.push(option)
  })

  return normalized
}

export function resolveSelectPageSize(
  pageSize: number,
  pageSizeOptions: readonly number[],
): string {
  const fallback = pageSizeOptions[0]

  if (fallback === undefined) {
    return '1'
  }

  if (!isPaginationInteger(pageSize) || pageSize <= 0) {
    warnPaginationOnce(
      'table-pagination-page-size-invalid',
      `@nova/ui TablePagination: pageSize must be a positive integer, received ${String(pageSize)}`,
    )
    return String(fallback)
  }

  if (!pageSizeOptions.includes(pageSize)) {
    warnPaginationOnce(
      'table-pagination-page-size-missing',
      `@nova/ui TablePagination: pageSize ${String(pageSize)} is not in pageSizeOptions`,
    )
    return String(fallback)
  }

  return String(pageSize)
}

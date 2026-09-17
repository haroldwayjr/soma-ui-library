export const SHOW_ALL_MAX = 6
export const START_BOUNDARY = 3
export const END_BOUNDARY = 3
export const SIBLING_COUNT = 1

export type PaginationRangeItem = 'ellipsis' | number

const pageIndices = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

export function getPaginationRange(
  page: number,
  pageCount: number,
): PaginationRangeItem[] {
  if (pageCount <= SHOW_ALL_MAX) {
    return pageIndices(1, pageCount)
  }

  const pages = new Set<number>([1, pageCount])

  if (page <= START_BOUNDARY) {
    pageIndices(1, Math.min(START_BOUNDARY, pageCount)).forEach((index) => {
      pages.add(index)
    })
  } else if (page >= pageCount - (END_BOUNDARY - 1)) {
    pageIndices(Math.max(1, pageCount - (END_BOUNDARY - 1)), pageCount).forEach(
      (index) => {
        pages.add(index)
      },
    )
  } else {
    pages.add(page - SIBLING_COUNT)
    pages.add(page)
    pages.add(page + SIBLING_COUNT)
  }

  const sorted = [...pages].sort((left, right) => left - right)
  const range: PaginationRangeItem[] = []

  sorted.forEach((value, index) => {
    if (index > 0) {
      const previous = sorted[index - 1]
      if (previous !== undefined && value - previous > 1) {
        range.push('ellipsis')
      }
    }
    range.push(value)
  })

  return range
}

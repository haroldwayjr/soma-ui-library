export type ResolvedPaginationInput =
  | { displayPage: number; kind: 'valid'; pageCount: number }
  | { kind: 'invalid-page-count' }

export function clampPaginationPage(page: number, pageCount: number): number {
  return Math.min(Math.max(page, 1), pageCount)
}

export function isPaginationInteger(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value)
}

export function normalizePaginationPage(
  page: number,
  pageCount: number,
): number {
  if (!Number.isFinite(page)) {
    return clampPaginationPage(1, pageCount)
  }

  if (!Number.isInteger(page)) {
    return clampPaginationPage(Math.trunc(page), pageCount)
  }

  return clampPaginationPage(page, pageCount)
}

const warnedKeys = new Set<string>()

/** Clears dev warn-once keys. For unit tests only. */
export function resetPaginationValidationWarningsForTests(): void {
  warnedKeys.clear()
}

export function resolvePaginationInput(
  page: number,
  pageCount: number,
): ResolvedPaginationInput {
  if (!isPaginationInteger(pageCount) || pageCount < 1) {
    if (import.meta.env.DEV) {
      throw new Error(
        `@nova/ui Pagination: pageCount must be a finite integer >= 1, received ${String(pageCount)}`,
      )
    }
    return { kind: 'invalid-page-count' }
  }

  if (!isPaginationInteger(page)) {
    warnPaginationOnce(
      'page-non-integer',
      `@nova/ui Pagination: page must be a finite integer, received ${String(page)}`,
    )
  } else if (page < 1 || page > pageCount) {
    warnPaginationOnce(
      'page-out-of-range',
      `@nova/ui Pagination: page ${String(page)} is outside [1, ${String(pageCount)}]`,
    )
  }

  return {
    displayPage: normalizePaginationPage(page, pageCount),
    kind: 'valid',
    pageCount,
  }
}

export function warnPaginationOnce(key: string, message: string): void {
  if (import.meta.env.DEV && !warnedKeys.has(key)) {
    warnedKeys.add(key)
    console.warn(message)
  }
}

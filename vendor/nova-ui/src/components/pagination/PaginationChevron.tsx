import type { ReactElement } from 'react'

import { chevronStyle } from './Pagination.css'

export type PaginationChevronDirection = 'next' | 'previous'

export function PaginationChevron({
  direction,
}: {
  direction: PaginationChevronDirection
}): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={chevronStyle}
      fill="none"
      focusable="false"
      style={{
        rotate: direction === 'previous' ? '90deg' : '-90deg',
      }}
      viewBox="0 0 12 12"
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

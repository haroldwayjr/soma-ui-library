import type { ReactElement } from 'react'

import { Button as BaseButton } from '@base-ui/react/button'

import { cx } from '../../helper/cx'
import { arrowRecipe } from './Pagination.css'
import {
  PaginationChevron,
  type PaginationChevronDirection,
} from './PaginationChevron'

export interface PaginationArrowProps {
  direction: PaginationChevronDirection
  disabled?: boolean
  onClick?: (() => void) | undefined
}

const ARROW_LABEL: Record<PaginationChevronDirection, string> = {
  next: 'Next page',
  previous: 'Previous page',
}

export function PaginationArrow({
  direction,
  disabled = false,
  onClick,
}: PaginationArrowProps): ReactElement {
  return (
    <BaseButton
      aria-label={ARROW_LABEL[direction]}
      className={cx(arrowRecipe())}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <PaginationChevron direction={direction} />
    </BaseButton>
  )
}

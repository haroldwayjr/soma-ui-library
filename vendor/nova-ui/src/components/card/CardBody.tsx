import type { ReactElement } from 'react'

import type { CardContainerProps } from './cardProps'

import { cx } from '../../helper/cx'
import { bodyStyle } from './Card.css'

export type CardBodyProps = CardContainerProps

export function CardBody({
  children,
  className,
  ...props
}: CardBodyProps): ReactElement {
  return (
    <div className={cx(bodyStyle, className)} {...props}>
      {children}
    </div>
  )
}

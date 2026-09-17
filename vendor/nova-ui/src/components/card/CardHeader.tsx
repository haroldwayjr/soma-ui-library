import type { ReactElement } from 'react'

import type { CardContainerProps } from './cardProps'

import { cx } from '../../helper/cx'
import { headerStyle } from './Card.css'

export type CardHeaderProps = CardContainerProps

export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps): ReactElement {
  return (
    <div className={cx(headerStyle, className)} {...props}>
      {children}
    </div>
  )
}

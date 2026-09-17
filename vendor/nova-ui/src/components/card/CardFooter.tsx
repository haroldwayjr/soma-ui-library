import type { ReactElement } from 'react'

import type { CardContainerProps } from './cardProps'

import { cx } from '../../helper/cx'
import { footerStyle } from './Card.css'

export type CardFooterProps = CardContainerProps

export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps): ReactElement {
  return (
    <div className={cx(footerStyle, className)} {...props}>
      {children}
    </div>
  )
}

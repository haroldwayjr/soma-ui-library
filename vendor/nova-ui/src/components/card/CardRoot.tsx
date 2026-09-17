import type { ReactElement } from 'react'

import type { CardContainerProps } from './cardProps'

import { cx } from '../../helper/cx'
import { rootStyle } from './Card.css'

// Card has no Base UI primitive underneath it — there is no accessible
// "card" role — so this and every other part is a plain element.
export type CardRootProps = CardContainerProps

export function CardRoot({
  children,
  className,
  ...props
}: CardRootProps): ReactElement {
  return (
    <div className={cx(rootStyle, className)} {...props}>
      {children}
    </div>
  )
}

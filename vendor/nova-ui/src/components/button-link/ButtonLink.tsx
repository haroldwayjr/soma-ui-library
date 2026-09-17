import type { ComponentPropsWithRef, ReactElement } from 'react'

import { cx } from '../../helper/cx'
import { linkStyle } from '../link/Link.css'
import { resetHost } from './ButtonLink.css'

export type ButtonLinkProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'type'
> & {
  children: string
  className?: string
  type?: 'button' | 'reset' | 'submit'
}

export function ButtonLink({
  children,
  className,
  type = 'button',
  ...props
}: ButtonLinkProps): null | ReactElement {
  if (children === '') {
    return null
  }

  return (
    <button
      {...props}
      className={cx(linkStyle, resetHost, className)}
      type={type}
    >
      {children}
    </button>
  )
}

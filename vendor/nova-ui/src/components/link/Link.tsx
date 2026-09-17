import type { ComponentPropsWithRef, ReactElement } from 'react'

import { externalRel, missingLabelOrHref } from '../../helper/anchor'
import { cx } from '../../helper/cx'
import { IconExternalLink } from '../icon'
import { iconStyle, linkStyle } from './Link.css'

export type LinkProps = Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'className' | 'href'
> & {
  children: string
  className?: string
  href: string
}

export function Link({
  children,
  className,
  href,
  rel,
  target,
  ...props
}: LinkProps): null | ReactElement {
  if (missingLabelOrHref(href, children)) {
    return null
  }

  const external = target === '_blank'

  return (
    <a
      {...props}
      className={cx(linkStyle, className)}
      href={href}
      rel={externalRel(target, rel)}
      target={target}
    >
      {children}
      {external ? <IconExternalLink className={iconStyle} size="xs" /> : null}
    </a>
  )
}

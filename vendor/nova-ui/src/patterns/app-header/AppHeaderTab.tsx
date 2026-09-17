import type { ComponentPropsWithRef, ReactElement } from 'react'

import { externalRel, missingLabelOrHref } from '../../helper/anchor'
import { cx } from '../../helper/cx'
import { tabLabelStyle, tabSizerStyle, tabStyle } from './AppHeader.css'

export type AppHeaderTabProps = Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'className' | 'href'
> & {
  children: string
  className?: string
  href: string
}

export function AppHeaderTab({
  children,
  className,
  href,
  rel,
  target,
  ...props
}: AppHeaderTabProps): null | ReactElement {
  if (missingLabelOrHref(href, children)) {
    return null
  }

  return (
    <a
      {...props}
      className={cx(tabStyle, className)}
      href={href}
      rel={externalRel(target, rel)}
      target={target}
    >
      <span aria-hidden className={tabSizerStyle}>
        {children}
      </span>
      <span className={tabLabelStyle}>{children}</span>
    </a>
  )
}

import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react'

import { externalRel, missingHref } from '../../helper/anchor'
import { cx } from '../../helper/cx'
import { brandLinkStyle } from './AppHeader.css'

export type AppHeaderBrandProps = Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'className' | 'href'
> & {
  children: ReactNode
  className?: string
  href: string
}

export function AppHeaderBrand({
  children,
  className,
  href,
  rel,
  target,
  ...props
}: AppHeaderBrandProps): null | ReactElement {
  if (missingHref(href)) {
    return null
  }

  return (
    <a
      {...props}
      // After the spread so `createLink`'s active `aria-current="page"` cannot
      // land. Current page belongs on `AppHeader.Tab`; the lockup is a second
      // link to the same URL and must not announce current twice.
      aria-current={undefined}
      className={cx(brandLinkStyle, className)}
      href={href}
      rel={externalRel(target, rel)}
      target={target}
    >
      {children}
    </a>
  )
}

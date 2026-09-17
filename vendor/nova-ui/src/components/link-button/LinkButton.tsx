import type { ComponentPropsWithRef, ReactElement } from 'react'

import { externalRel, missingLabelOrHref } from '../../helper/anchor'
import { cx } from '../../helper/cx'
import {
  buttonRecipe,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
  labelRecipe,
} from '../button/Button.css'
import { resetUnderline } from './LinkButton.css'

export type LinkButtonProps = Omit<
  ComponentPropsWithRef<'a'>,
  'children' | 'className' | 'href'
> & {
  children: string
  className?: string
  href: string
  size: ButtonSize
  tone: ButtonTone
  variant: ButtonVariant
}

export function LinkButton({
  children,
  className,
  href,
  rel,
  size,
  target,
  tone,
  variant,
  ...props
}: LinkButtonProps): null | ReactElement {
  if (missingLabelOrHref(href, children)) {
    return null
  }

  return (
    <a
      {...props}
      // Recipe first, then the UA-underline reset. The recipe never sets
      // decoration, so equal specificity does not fight; emission order is
      // irrelevant today.
      className={cx(
        buttonRecipe({ size, tone, variant }),
        resetUnderline,
        className,
      )}
      href={href}
      rel={externalRel(target, rel)}
      target={target}
    >
      {/*
        The label carries its own element so `Button.css.ts` can trim its text
        box — the trim applies to the box that formats the line, and setting
        it on the root does nothing. Same span Button uses. Not a styling
        hook for consumers.
      */}
      <span className={labelRecipe({ size })}>{children}</span>
    </a>
  )
}

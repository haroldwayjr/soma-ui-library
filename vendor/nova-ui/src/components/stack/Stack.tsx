import type {
  ComponentPropsWithRef,
  ElementType,
  ReactElement,
  ReactNode,
} from 'react'

import { cx } from '../../helper/cx'
import { type semantics } from '../../tokens/semantic.css'
import { stackRecipe } from './Stack.css'

export type StackAlign = 'center' | 'end' | 'start' | 'stretch'
export type StackDisplay = 'block' | 'inline'
// Containers a layout wrapper can legitimately be. Deliberately a closed list
// rather than every intrinsic tag: `keyof HTMLElementTagNameMap` also admits
// void elements (`img`, `br`, `input`) and metadata (`script`, `base`), which
// cannot hold children and would turn a type error into a React runtime warning.
// Widen it when a real layout needs another container, not preemptively.
export type StackElement =
  | 'article'
  | 'aside'
  | 'dd'
  | 'div'
  | 'dl'
  | 'fieldset'
  | 'footer'
  | 'form'
  | 'header'
  | 'li'
  | 'main'
  | 'nav'
  | 'ol'
  | 'section'
  | 'span'
  | 'ul'
export type StackGap = keyof typeof semantics.space

export type StackJustify = 'between' | 'center' | 'end' | 'start'

export type StackProps<T extends StackElement = 'div'> = Omit<
  ComponentPropsWithRef<T>,
  StackOwnPropName
> &
  StackLayoutProps &
  StackOwnProps<T>

// `wrap` is only meaningful on the inline axis, and a wrapped column reorders
// content down columns rather than across lines. Pairing it with an explicit
// `horizontal` makes `<Stack gap={8} wrap>` a type error instead of silently
// wrapping nothing.
type StackLayoutProps =
  | {
      horizontal: true
      wrap?: boolean
    }
  | {
      horizontal?: false
      wrap?: never
    }

type StackOwnPropName =
  'horizontal' | 'wrap' | keyof StackOwnProps<StackElement>

interface StackOwnProps<T extends StackElement> {
  align?: StackAlign
  as?: T
  children: ReactNode
  className?: string
  display?: StackDisplay
  gap: StackGap
  justify?: StackJustify
}

export function Stack<T extends StackElement = 'div'>({
  align = 'stretch',
  as,
  children,
  className,
  display = 'block',
  gap,
  horizontal = false,
  justify = 'start',
  wrap,
  ...props
}: StackProps<T>): ReactElement {
  // Every `StackElement` is an `ElementType`, so the widening is sound. It has
  // to be an assertion: an annotated `const` narrows back to the assigned
  // literal and JSX then rejects the generic props, while laundering it through
  // a function reads to @eslint-react as creating a component during render.
  // eslint-disable-next-line no-restricted-syntax -- Sound widening of a closed union of intrinsic tags, explained above.
  const Element = (as ?? 'div') as ElementType
  // Types already prevent this pairing; the guard keeps a JavaScript caller or a
  // spread props object from wrapping a column.
  const resolvedWrap = horizontal && (wrap ?? false)

  return (
    <Element
      {...props}
      className={cx(
        stackRecipe({
          align,
          direction: horizontal ? 'horizontal' : 'vertical',
          display,
          gap,
          justify,
          wrap: resolvedWrap,
        }),
        className,
      )}
    >
      {children}
    </Element>
  )
}

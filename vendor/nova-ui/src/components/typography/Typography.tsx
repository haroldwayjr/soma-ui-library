import type { RecipeVariants } from '@vanilla-extract/recipes'
import type { ElementType, HTMLAttributes, ReactElement, Ref } from 'react'

import { cx } from '../../helper/cx'
import { typographyRecipe } from './Typography.css'

export type TypographyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 'p'

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /**
   * Native element when it must differ from `variant`. A heading variant is
   * still that role's type; `level` only chooses the tag — `p` for a wordmark
   * that must not enter the outline, or 1–6 when visual size and outline
   * depth are not the same heading.
   */
  level?: TypographyLevel
  ref?: Ref<HTMLElement>
  variant: NonNullable<
    NonNullable<RecipeVariants<typeof typographyRecipe>>['variant']
  >
}
export type TypographyVariant = TypographyProps['variant']

const elementForVariant = {
  body1: 'p',
  body2: 'p',
  buttonMedium: 'span',
  buttonSmall: 'span',
  caption: 'span',
  // Display styles are a size, not a level: a page can open with one without it
  // being that page's h1. Render as prose and let a heading variant carry the
  // outline.
  displayLarge: 'p',
  displayMedium: 'p',
  displaySmall: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  overline: 'span',
  subtitle1: 'p',
  subtitle2: 'p',
  subtitle3: 'p',
} as const satisfies Record<TypographyVariant, ElementType>

const elementForLevel = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
  p: 'p',
} as const satisfies Record<TypographyLevel, ElementType>

// `className` and `style` reach the root element so a consumer can position the
// text within a layout; the variant still owns the type styles.
export function Typography({
  className,
  level,
  variant,
  ...props
}: TypographyProps): ReactElement {
  const tag =
    level === undefined ? elementForVariant[variant] : elementForLevel[level]

  // The lookup returns a union of intrinsic tags, so TypeScript narrows the
  // element's props to the intersection and rejects a generic `HTMLElement`
  // ref. The cast restates what the props interface already guarantees.
  // eslint-disable-next-line no-restricted-syntax -- Re-types a union of intrinsic tags, which an annotation cannot do; soundness is carried by TypographyProps, per the comment above.
  const Element = tag as ElementType<
    Omit<TypographyProps, 'level' | 'variant'> & {
      'data-typography-variant': TypographyVariant
    }
  >

  // The data attribute sits after the spread so it always reflects the variant
  // actually applied, and gives e2e and Storybook a stable hook that doesn't
  // depend on class hashes.
  return (
    <Element
      className={cx(typographyRecipe({ variant }), className)}
      {...props}
      data-typography-variant={variant}
    />
  )
}

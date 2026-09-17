import type { CSSProperties, ReactElement, Ref } from 'react'

import { cx } from '../../helper/cx'
import { titleStyle } from './Card.css'

// `children` is a required `string` for the same reason Button's is: a title
// slot that admits `ReactNode` can satisfy the type with `null` / `false` /
// `[]` and still render an empty heading. Type lives here, not on Header,
// so a trailing action is not restyled as a title.
export interface CardHeaderTitleProps {
  [dataAttribute: `data-${string}`]: string | undefined
  children: string
  className?: string | undefined
  id?: string | undefined
  ref?: Ref<HTMLParagraphElement>
  style?: CSSProperties | undefined
}

// A `<p>`, not `Typography`'s `h4`. The metrics match `h4` (see
// `semantics.text.cardTitle`) but a card title is not a document heading —
// a page of cards must not dump an `<h4>` per panel. Renders as prose; a
// future heading-in-a-card needs Typography's `level` prop, not this part
// swapping tags.
export function CardHeaderTitle({
  children,
  className,
  ...props
}: CardHeaderTitleProps): ReactElement {
  return (
    <p className={cx(titleStyle, className)} {...props}>
      {children}
    </p>
  )
}

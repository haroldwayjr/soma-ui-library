import type { Button as BaseButton } from '@base-ui/react/button'
import type { ReactElement } from 'react'

import { type BaseUiProps } from '../../helper/types'
import {
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from './Button.css'
import { ButtonBase, type ButtonIcon } from './ButtonBase'

export type { ButtonIcon }

// `children` narrows Base UI's `ReactNode` to a required `string`. Required so a
// button cannot ship without an accessible name, and `string` because `ReactNode`
// admits `null`, `undefined`, `false`, and `[]` — all of which satisfy a required
// prop and still render a nameless control, which is the likelier mistake of the
// two. Matches `Chip`. Icon-only is `IconButton` (see
// `../icon-button/README.md`), not a Button prop, and not a reason to widen
// `children` back to `ReactNode`.
export interface ButtonProps extends BaseUiProps<typeof BaseButton> {
  children: string
  // Decorative only — the slot wrapper is `aria-hidden` regardless of whether
  // the passed Icon paints a label, so an icon can never contribute to (or
  // override) the button's accessible name. A hint that needs to be announced
  // belongs on `children` or `aria-describedby`, not on the icon. The button
  // size selects `Icon`'s `xs` / `sm`; pass the component, not an element.
  endIcon?: ButtonIcon
  // A focusable, `aria-busy` state that suppresses activation rather than the
  // native `disabled` state, so a loading button stays in the tab order and
  // keeps its accessible name while `children` continues to hold the label.
  // Replaces `startIcon` with a spinner; `endIcon` is hidden rather than kept.
  loading?: boolean
  size: ButtonSize
  startIcon?: ButtonIcon
  tone: ButtonTone
  variant: ButtonVariant
}

export function Button(props: ButtonProps): ReactElement {
  return <ButtonBase {...props} />
}

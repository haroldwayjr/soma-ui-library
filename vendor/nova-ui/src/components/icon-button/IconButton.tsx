import type { ReactElement } from 'react'

import { type Button as BaseButton } from '@base-ui/react/button'

import { type BaseUiProps } from '../../helper/types'
import {
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from '../button/Button.css'
import { ButtonBase, type ButtonIcon } from '../button/ButtonBase'

export type IconButtonProps = Omit<
  BaseUiProps<typeof BaseButton>,
  'aria-label' | 'aria-labelledby' | 'children' | 'title'
> & {
  icon: ButtonIcon
  loading?: boolean
  size: ButtonSize
  title: string
  tone: ButtonTone
  type?: 'button' | 'reset' | 'submit'
  variant: ButtonVariant
}

export function IconButton({
  icon,
  title,
  ...props
}: IconButtonProps): ReactElement {
  if (import.meta.env.DEV && title.trim() === '') {
    console.warn(
      '@nova/ui IconButton: an empty `title` leaves the control nameless.',
    )
  }

  return (
    <ButtonBase {...props} aria-label={title} startIcon={icon} title={title} />
  )
}

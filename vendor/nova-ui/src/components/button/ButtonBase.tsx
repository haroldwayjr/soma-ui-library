import { Button as BaseButton } from '@base-ui/react/button'
import { type ComponentType, createElement, type ReactElement } from 'react'

import { cx } from '../../helper/cx'
import { type BaseUiProps } from '../../helper/types'
import { type IconProps } from '../icon'
import {
  buttonRecipe,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
  iconRecipe,
  labelRecipe,
  spinnerStyle,
} from './Button.css'

// An unpublished `Icon` component type. The slot renders it with `xs` or `sm`
// from the button size — callers do not pass a sized element.
export type ButtonIcon = ComponentType<IconProps>

const iconSlot = (icon: ButtonIcon, size: ButtonSize): ReactElement => (
  <span aria-hidden className={iconRecipe({ size })}>
    {createElement(icon, { size: size === 'small' ? 'xs' : 'sm' })}
  </span>
)

// Lax shared host for `Button` and `IconButton`. Unpublished — do not add to
// `button/index.ts` or the `@nova/ui` barrel. Facades own the name contract
// (`children: string` vs required `title` as `title` and `aria-label`).
interface ButtonBaseProps extends Omit<
  BaseUiProps<typeof BaseButton>,
  'children'
> {
  children?: string
  endIcon?: ButtonIcon
  loading?: boolean
  size: ButtonSize
  startIcon?: ButtonIcon
  tone: ButtonTone
  variant: ButtonVariant
}

// Loading is busy, not disabled: stay in the tab order and keep the name.
// Native `disabled` would remove both. Passing the caller's `onClick`
// through would double-submit. `preventDefault` is what stops a
// `type="submit"` control from posting the form; omitting `onClick` would
// not. Enter/Space still synthesize click, so this is the keyboard path too.
const suppressActivation: NonNullable<ButtonBaseProps['onClick']> = (event) => {
  event.preventDefault()
}

export function ButtonBase({
  children,
  className,
  endIcon,
  loading = false,
  onClick,
  size,
  startIcon,
  tone,
  type = 'button',
  variant,
  ...props
}: ButtonBaseProps): ReactElement {
  return (
    <BaseButton
      {...props}
      aria-busy={loading || undefined}
      className={cx(
        buttonRecipe({
          size,
          tone,
          variant,
          ...(children === undefined ? { iconOnly: true } : {}),
        }),
        className,
      )}
      onClick={loading ? suppressActivation : onClick}
      type={type}
    >
      {loading ? (
        <span aria-hidden className={cx(iconRecipe({ size }), spinnerStyle)} />
      ) : (
        startIcon && iconSlot(startIcon, size)
      )}
      {children === undefined ? null : (
        <span className={labelRecipe({ size })}>{children}</span>
      )}
      {!loading && endIcon && iconSlot(endIcon, size)}
    </BaseButton>
  )
}

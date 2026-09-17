import type { ReactElement } from 'react'

import { Switch as BaseSwitch } from '@base-ui/react/switch'

import { cx } from '../../helper/cx'
import { type BaseUiProps } from '../../helper/types'
import { rootStyle, thumbStyle } from './Switch.css'

export type SwitchProps = Omit<
  BaseUiProps<typeof BaseSwitch.Root>,
  'children' | 'nativeButton'
>

export function Switch({ className, ...props }: SwitchProps): ReactElement {
  return (
    <BaseSwitch.Root className={cx(rootStyle, className)} {...props}>
      <BaseSwitch.Thumb aria-hidden className={thumbStyle} />
    </BaseSwitch.Root>
  )
}

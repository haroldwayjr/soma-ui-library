import type { ReactElement } from 'react'

import { Radio as BaseRadio } from '@base-ui/react/radio'

import { cx } from '../../helper/cx'
import { type BaseUiProps } from '../../helper/types'
import { dotStyle, rootStyle } from './Radio.css'
import { useRequireRadioGroup } from './radioGroupContext'

export interface RadioProps extends Omit<
  BaseUiProps<typeof BaseRadio.Root>,
  'children' | 'nativeButton' | 'required' | 'value'
> {
  value: string
}

// `required` is omitted deliberately. Being required is a property of the choice,
// so it belongs on the group; Base UI mirrors the native attribute onto the item
// as well, but leaving it out makes the rule a type error rather than a
// convention to remember.
export function Radio({ className, ...props }: RadioProps): ReactElement {
  useRequireRadioGroup()

  return (
    <BaseRadio.Root className={cx(rootStyle, className)} {...props}>
      <BaseRadio.Indicator className={dotStyle} />
    </BaseRadio.Root>
  )
}

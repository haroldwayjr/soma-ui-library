import type { ReactElement } from 'react'

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'

import { cx } from '../../helper/cx'
import { type BaseUiProps } from '../../helper/types'
import { IconCheck } from '../icon'
import {
  checkStyle,
  dashStyle,
  indicatorStyle,
  rootStyle,
} from './Checkbox.css'

export interface CheckboxProps extends Omit<
  BaseUiProps<typeof BaseCheckbox.Root>,
  'children' | 'nativeButton' | 'parent'
> {
  indeterminate?: boolean
}

export function Checkbox({
  className,
  indeterminate = false,
  ...props
}: CheckboxProps): ReactElement {
  return (
    <BaseCheckbox.Root
      className={cx(rootStyle, className)}
      indeterminate={indeterminate}
      {...props}
    >
      <BaseCheckbox.Indicator className={indicatorStyle}>
        {indeterminate ? (
          <span className={dashStyle} />
        ) : (
          <IconCheck className={checkStyle} size="xs" />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

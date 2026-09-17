import type { ReactElement } from 'react'

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'

import { type BaseUiProps } from '../../helper/types'
import { RadioGroupProvider } from './radioGroupContext'

// One of the two, never both and never neither. A group of named radios with no
// group name is a common axe miss; requiring the name at the type level is the
// only check that catches it. `label` is RadioGroupField's job, not a prop here.
export type RadioGroupProps = Omit<
  BaseUiProps<typeof BaseRadioGroup>,
  'aria-label' | 'aria-labelledby' | 'defaultValue' | 'onValueChange' | 'value'
> & {
  defaultValue?: string
  onValueChange?: (
    value: string,
    details: BaseRadioGroup.ChangeEventDetails,
  ) => void
  value?: string
} & (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  )

// The group owns `name`, the selected value, and group-wide disabled/readOnly/
// required. It renders a plain `<div>` and applies no layout of its own —
// spacing and orientation belong to the consumer.
export function RadioGroup({
  onValueChange,
  ...props
}: RadioGroupProps): ReactElement {
  return (
    <RadioGroupProvider value>
      <BaseRadioGroup
        {...props}
        {...(onValueChange === undefined
          ? {}
          : {
              onValueChange: (
                value: unknown,
                details: BaseRadioGroup.ChangeEventDetails,
              ): void => {
                onValueChange(String(value), details)
              },
            })}
      />
    </RadioGroupProvider>
  )
}

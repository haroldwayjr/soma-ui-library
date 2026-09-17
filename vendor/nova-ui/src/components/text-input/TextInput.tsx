import type { ReactElement, Ref } from 'react'

import { Input as BaseInput } from '@base-ui/react/input'

import { type BaseUiProps } from '../../helper/types'
import { useFieldControlProps } from '../field'
import { inputStyle } from './TextInput.css'

export interface TextInputProps extends Omit<
  BaseUiProps<typeof BaseInput>,
  'aria-required' | 'className' | 'ref' | 'required' | 'style' | 'type'
> {
  ref?: Ref<HTMLInputElement> | undefined
  type?: TextInputType | undefined
}

export type TextInputType =
  'email' | 'password' | 'search' | 'tel' | 'text' | 'url'

// A separate component so the ARIA state can be read from Field context. A hook
// called in TextField would sit above the provider and see nothing.
export function TextInput({
  ref,
  type,
  ...inputProps
}: TextInputProps): ReactElement {
  const controlProps = useFieldControlProps()

  return (
    // `controlProps` and `required` come after the spread on purpose. Omitting
    // them from the prop type only stops well-typed callers; these two lines are
    // what stop a leaked `aria-required` or `required` at runtime, so the
    // announced state cannot disagree with the label asterisk.
    <BaseInput
      {...inputProps}
      {...controlProps}
      className={inputStyle}
      ref={ref}
      required={false}
      type={type}
    />
  )
}

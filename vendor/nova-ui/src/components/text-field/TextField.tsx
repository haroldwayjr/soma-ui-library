import type { CSSProperties, ReactElement, Ref } from 'react'

import { Field } from '../field'
import {
  TextInput,
  type TextInputProps,
  type TextInputType,
} from '../text-input'

// `aria-label` and `aria-labelledby` are removed rather than forwarded: `label`
// is required and is the accessible name, so a second naming path would compete
// with it. A name that must come from elsewhere is unpublished `TextInput`.
export interface TextFieldProps extends Omit<
  TextInputProps,
  'aria-label' | 'aria-labelledby'
> {
  // Optionals accept an explicit `undefined` — matching Base UI's own prop types
  // — so callers and the internal Field boundary can forward "not set" without a
  // conditional spread for every prop under `exactOptionalPropertyTypes`.
  className?: string | undefined
  description?: string | undefined
  error?: string | undefined
  /**
   * Declares the field required: sets `aria-required` on the input and paints a
   * decorative `*` after the label.
   *
   * Deliberately does not set the native `required` attribute — validation
   * belongs to the consuming form layer, and a native constraint would let the
   * browser block submission and show its own bubble before that layer renders
   * `error`. Native `required` is removed from the inherited Input surface so it
   * cannot be passed through either.
   */
  indicateRequired?: boolean | undefined
  label: string
  ref?: Ref<HTMLInputElement> | undefined
  style?: CSSProperties | undefined
}

export type TextFieldType = TextInputType

export function TextField({
  className,
  description,
  disabled = false,
  error,
  indicateRequired = false,
  label,
  name,
  ref,
  style,
  ...inputProps
}: TextFieldProps): ReactElement {
  return (
    <Field
      className={className}
      description={description}
      // `disabled` and `name` go to Field rather than TextInput: Field routes
      // them through `Field.Root`, whose values take precedence over the nested
      // control, so passing them to both would set up a conflict with a silent
      // winner.
      disabled={disabled}
      error={error}
      indicateRequired={indicateRequired}
      label={label}
      name={name}
      style={style}
    >
      <TextInput {...inputProps} ref={ref} />
    </Field>
  )
}

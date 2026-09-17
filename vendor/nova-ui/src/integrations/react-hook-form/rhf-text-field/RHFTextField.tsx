import type { ReactElement } from 'react'
import type {
  FieldPathByValue,
  FieldPathValue,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form'

import { useController } from 'react-hook-form'

import { TextField, type TextFieldProps } from '../../../components/text-field'
import { EMPTY_TEXT } from '../const'
import { getErrorMessage } from '../helper/getErrorMessage'

export type RHFTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>,
> = Omit<
  TextFieldProps,
  | 'defaultValue'
  | 'disabled'
  | 'error'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onValueChange'
  | 'ref'
  | 'value'
> &
  Pick<
    UseControllerProps<TFieldValues, TName>,
    | 'control'
    | 'defaultValue'
    | 'disabled'
    | 'name'
    | 'rules'
    | 'shouldUnregister'
  >

// Paths whose value is exactly `string`. `FieldPathByValue` only checks that the
// value extends `string`, which drops optionals (`string | undefined`) and
// nullables (`string | null`) but still admits literal unions such as
// `'draft' | 'published'`. Seeding a union with empty text would put an invalid
// value in the store; the reverse assignability check drops those. Form values
// are therefore `firstName: string`. Optionality belongs in the payload mapper.
export type StringFieldPath<TFieldValues extends FieldValues> = {
  [
    Key in FieldPathByValue<TFieldValues, string>
  ]: string extends FieldPathValue<TFieldValues, Key> ? Key : never
}[FieldPathByValue<TFieldValues, string>]

// `never` + `NoInfer` require `<RHFTextField<Form>>`. Otherwise TypeScript infers
// from `control` or falls back to `FieldValues`, and `name` is untyped when the
// field reads FormProvider context.
export function RHFTextField<
  TFieldValues extends FieldValues = never,
  TName extends StringFieldPath<NoInfer<TFieldValues>> = StringFieldPath<
    NoInfer<TFieldValues>
  >,
>({
  control,
  defaultValue,
  disabled,
  name,
  rules,
  shouldUnregister,
  ...textFieldProps
}: RHFTextFieldProps<NoInfer<TFieldValues>, TName>): ReactElement {
  const {
    field: {
      disabled: fieldDisabled,
      name: fieldName,
      onBlur,
      onChange,
      ref,
      value,
    },
    fieldState,
  } = useController({
    // `StringFieldPath` guarantees this path's value is exactly `string`, so empty
    // text is a valid seed. TypeScript cannot see that: `FieldPathValue` stays
    // deferred while `TFieldValues` and `TName` are type parameters, so the
    // assignability check cannot be discharged here.
    // @ts-expect-error deferred FieldPathValue cannot be narrowed to string
    defaultValue: defaultValue ?? EMPTY_TEXT,
    name,
    ...(control === undefined ? {} : { control }),
    ...(disabled === undefined ? {} : { disabled }),
    ...(rules === undefined ? {} : { rules }),
    ...(shouldUnregister === undefined ? {} : { shouldUnregister }),
  })
  const error = getErrorMessage(fieldState.error)

  return (
    <TextField
      {...textFieldProps}
      {...(error === undefined ? {} : { error })}
      disabled={fieldDisabled ?? false}
      name={fieldName}
      onBlur={onBlur}
      onValueChange={onChange}
      ref={ref}
      value={value}
    />
  )
}
